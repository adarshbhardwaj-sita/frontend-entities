import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Employee } from '../../services/data.service';
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

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.dataService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
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
    if (this.isEditing && this.currentEmployee.id) {
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
      this.dataService.addEmployee(this.currentEmployee as Omit<Employee, 'id'>).subscribe({
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
        error: (error : Error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}
