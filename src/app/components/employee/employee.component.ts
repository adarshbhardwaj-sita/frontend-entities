import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Employee, PaginatedResponse, PaginationParams } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  showModal = false;
  isEditing = false;
  currentEmployee: Partial<Employee> = {};
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;
  
  // Make Math available in template
  Math = Math;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    console.log('EmployeeComponent initialized');
    this.loadEmployees();
  }

  loadEmployees() {
    console.log('Loading employees...');
    this.loading = true;
    this.error = null;
    
    const params: PaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    console.log('Pagination params:', params);
    
    this.dataService.getEmployees(params).subscribe({
      next: (response: PaginatedResponse<Employee>) => {
        console.log('Response received:', response);
        if (response && response.items) {
          this.employees = response.items;
          this.totalItems = response.totalCount || 0;
          this.totalPages = response.totalPages || Math.ceil((response.totalCount || 0) / (response.pageSize || 10));
          this.currentPage = response.page || 1;
        } else {
          this.employees = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.currentPage = 1;
        }
        this.loading = false;
        console.log('Employees loaded:', this.employees);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.currentPage = 1;
        this.loading = false;
        this.error = 'Failed to load employees. Please try again.';
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    this.isEditing = false;
    this.currentEmployee = {};
    this.showModal = true;
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.currentEmployee = { ...employee };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentEmployee = {};
  }

  saveEmployee() {
    if (this.isEditing && this.currentEmployee.employee_Id) {
      this.dataService.updateEmployee(this.currentEmployee as Employee).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
        },
        error: (error: Error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      this.dataService.addEmployee(this.currentEmployee as Omit<Employee, 'employee_Id'>).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
        },
        error: (error : Error) => {
          console.error('Error adding employee:', error);
        }
      });
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.dataService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error: Error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value);
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadEmployees();
  }

  getPageNumbers(): number[] {
    if (!this.totalPages || this.totalPages <= 0) {
      return [];
    }
    
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
