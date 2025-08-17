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
  
  // Make Math available in template
  Math = Math;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    const params: PaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    this.dataService.getEmployees(params).subscribe({
      next: (response: PaginatedResponse<Employee>) => {
        this.employees = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.loading = false;
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
