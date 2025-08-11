import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Employee } from '../../services/data.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html', // Reference the external HTML file
  styleUrls: ['./employee.component.scss']  // Reference the external SCSS file
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  showModal = false;
  isEditing = false;
  currentEmployee: Partial<Employee> = {};

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getEmployees().subscribe(employees => {
      this.employees = employees;
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
      this.dataService.updateEmployee(this.currentEmployee as Employee);
    } else {
      this.dataService.addEmployee(this.currentEmployee as Omit<Employee, 'id'>);
    }
    this.closeModal();
  }

  deleteEmployee(id: number) {
    // IMPORTANT: In a real Angular app, you would use a dedicated modal service for confirmations
    // instead of the browser's native `confirm()` to maintain a consistent UI and better UX.
    // However, for this refactoring, we keep the original logic.
    if (confirm('Are you sure you want to delete this employee?')) {
      this.dataService.deleteEmployee(id);
    }
  }
}
