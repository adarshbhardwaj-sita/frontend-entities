import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Employee, PaginatedResponse, PaginationParams } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
  
  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  
  // Make Math available in template
  Math = Math;
  
  // Search functionality
  searchId: number | null = null;
  searchResult: Employee | null = null;
  isSearching = false;

  constructor(private router: Router, private dataService: DataService) { }

  // Search methods
  searchEmployee() {
    if (!this.searchId || this.searchId <= 0) {
      this.showErrorNotification('Please enter a valid positive ID');
      return;
    }
    
    this.isSearching = true;
    this.dataService.searchEmployeeById(this.searchId).subscribe({
      next: (employee) => {
        this.searchResult = employee;
        this.employees = [employee];
        this.totalItems = 1;
        this.currentPage = 1;
        this.totalPages = 1;
        this.showSuccessNotification(`Employee with ID ${this.searchId} found`);
        this.isSearching = false;
      },
      error: (error) => {
        this.searchResult = null;
        this.showErrorNotification(`No employee found with ID ${this.searchId}`);
        this.isSearching = false;
        // Reload all employees
        this.loadEmployees();
      }
    });
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadEmployees();
  }

  // Custom email validator
  validateEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) {
      return null; // Let required validator handle empty values
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    
    return isValid ? null : { invalidEmail: true };
  }

  // Helper method to check if email is valid
  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Method to validate email field on blur
  validateEmailField() {
    if (this.currentEmployee.email && !this.isValidEmail(this.currentEmployee.email)) {
      // Email is invalid, but don't show error until form is submitted
      // This provides real-time feedback without being too aggressive
    }
  }

  // Method to handle email input changes
  onEmailInput() {
    // Real-time validation feedback
    // The template will automatically show/hide validation icons
  }

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
    this.currentEmployee = {
      employee_Id: 0, // Changed back to 0 for new entries
      name: '',
      email: '',
      department: '',
      designation: ''
    };
    this.showModal = true;
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.currentEmployee = { ...employee };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentEmployee = {
      employee_Id: 0,
      name: '',
      email: '',
      department: '',
      designation: ''
    };
  }

  saveEmployee() {
    // Validate required fields before saving
    if (!this.currentEmployee.employee_Id || this.currentEmployee.employee_Id <= 0) {
      this.showErrorNotification('Employee ID is required and must be greater than 0');
      return;
    }
    
    if (this.currentEmployee.email && !this.isValidEmail(this.currentEmployee.email)) {
      this.showErrorNotification('Please enter a valid email address');
      return;
    }

    if (this.isEditing && this.currentEmployee.employee_Id) {
      this.dataService.updateEmployee(this.currentEmployee as Employee).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
          this.showSuccessNotification('Employee updated successfully!');
        },
        error: (error: Error) => {
          console.error('Error updating employee:', error);
          this.showErrorNotification('Failed to update employee. Please try again.');
        }
      });
    } else {
      this.dataService.addEmployee(this.currentEmployee as Employee).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
          this.showSuccessNotification('Employee added successfully!');
        },
        error: (error: Error) => {
          console.error('Error adding employee:', error);
          this.showErrorNotification('Failed to add employee. Please try again.');
        }
      });
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.dataService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
          this.showSuccessNotification('Employee deleted successfully!');
        },
        error: (error: Error) => {
          console.error('Error deleting employee:', error);
          this.showErrorNotification('Failed to delete employee. Please try again.');
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

  // Notification methods
  showSuccessNotification(message: string) {
    this.notificationType = 'success';
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  showErrorNotification(message: string) {
    this.notificationType = 'error';
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  closeNotification() {
    this.showNotification = false;
  }
}
