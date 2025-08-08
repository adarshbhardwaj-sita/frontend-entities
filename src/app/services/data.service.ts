import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  email: string;
  description?: string;
}

export interface BudgetCategory {
  id: number;
  categoryType: string;
  budgetAmount: number;
  financialYear: string;
}

export interface Journey {
  id: number;
  currentPhase: string;
  startDate: string;
  status: string;
}

export interface Grade {
  id: number;
  gradeLevel: string;
  gradeCode: string;
  gradeEffectiveDate: string;
}

export interface Role {
  id: number;
  roleTitle: string;
  reportingManager: string;
  projectAssigned: string;
}

export interface Technology {
  id: number;
  stack: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private employees = new BehaviorSubject<Employee[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com' }
  ]);

  private budgetCategories = new BehaviorSubject<BudgetCategory[]>([
    { id: 1, categoryType: 'Operations', budgetAmount: 500000, financialYear: '2024-25' },
    { id: 2, categoryType: 'Marketing', budgetAmount: 200000, financialYear: '2024-25' },
    { id: 3, categoryType: 'Development', budgetAmount: 800000, financialYear: '2024-25' },
    { id: 4, categoryType: 'HR', budgetAmount: 150000, financialYear: '2024-25' }
  ]);

  private journeys = new BehaviorSubject<Journey[]>([
    { id: 1, currentPhase: 'Onboarding', startDate: '2024-01-15', status: 'Active' },
    { id: 2, currentPhase: 'Training', startDate: '2024-02-01', status: 'In Progress' },
    { id: 3, currentPhase: 'Performance Review', startDate: '2024-03-10', status: 'Completed' },
    { id: 4, currentPhase: 'Career Development', startDate: '2024-04-05', status: 'Active' }
  ]);

  private grades = new BehaviorSubject<Grade[]>([
    { id: 1, gradeLevel: 'Junior', gradeCode: 'JR01', gradeEffectiveDate: '2024-01-01' },
    { id: 2, gradeLevel: 'Senior', gradeCode: 'SR01', gradeEffectiveDate: '2024-01-01' },
    { id: 3, gradeLevel: 'Lead', gradeCode: 'LD01', gradeEffectiveDate: '2024-01-01' },
    { id: 4, gradeLevel: 'Manager', gradeCode: 'MG01', gradeEffectiveDate: '2024-01-01' }
  ]);

  private roles = new BehaviorSubject<Role[]>([
    { id: 1, roleTitle: 'Software Developer', reportingManager: 'John Smith', projectAssigned: 'E-commerce Platform' },
    { id: 2, roleTitle: 'UI/UX Designer', reportingManager: 'Sarah Johnson', projectAssigned: 'Mobile App Redesign' },
    { id: 3, roleTitle: 'Project Manager', reportingManager: 'Mike Wilson', projectAssigned: 'CRM Integration' },
    { id: 4, roleTitle: 'DevOps Engineer', reportingManager: 'Lisa Brown', projectAssigned: 'Infrastructure Upgrade' }
  ]);

  private technologies = new BehaviorSubject<Technology[]>([
    { id: 1, stack: 'Angular, TypeScript, RxJS' },
    { id: 2, stack: 'React, JavaScript, Redux' },
    { id: 3, stack: 'Node.js, Express, MongoDB' },
    { id: 4, stack: 'Python, Django, PostgreSQL' }
  ]);

  // Employee methods
  getEmployees(): Observable<Employee[]> {
    return this.employees.asObservable();
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const currentEmployees = this.employees.value;
    const newId = Math.max(...currentEmployees.map(e => e.id)) + 1;
    const newEmployee = { ...employee, id: newId };
    this.employees.next([...currentEmployees, newEmployee]);
  }

  updateEmployee(employee: Employee): void {
    const currentEmployees = this.employees.value;
    const index = currentEmployees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      currentEmployees[index] = employee;
      this.employees.next([...currentEmployees]);
    }
  }

  deleteEmployee(id: number): void {
    const currentEmployees = this.employees.value;
    this.employees.next(currentEmployees.filter(e => e.id !== id));
  }

  // Budget Category methods
  getBudgetCategories(): Observable<BudgetCategory[]> {
    return this.budgetCategories.asObservable();
  }

  addBudgetCategory(category: Omit<BudgetCategory, 'id'>): void {
    const currentCategories = this.budgetCategories.value;
    const newId = Math.max(...currentCategories.map(c => c.id)) + 1;
    const newCategory = { ...category, id: newId };
    this.budgetCategories.next([...currentCategories, newCategory]);
  }

  updateBudgetCategory(category: BudgetCategory): void {
    const currentCategories = this.budgetCategories.value;
    const index = currentCategories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      currentCategories[index] = category;
      this.budgetCategories.next([...currentCategories]);
    }
  }

  deleteBudgetCategory(id: number): void {
    const currentCategories = this.budgetCategories.value;
    this.budgetCategories.next(currentCategories.filter(c => c.id !== id));
  }

  // Journey methods
  getJourneys(): Observable<Journey[]> {
    return this.journeys.asObservable();
  }

  addJourney(journey: Omit<Journey, 'id'>): void {
    const currentJourneys = this.journeys.value;
    const newId = Math.max(...currentJourneys.map(j => j.id)) + 1;
    const newJourney = { ...journey, id: newId };
    this.journeys.next([...currentJourneys, newJourney]);
  }

  updateJourney(journey: Journey): void {
    const currentJourneys = this.journeys.value;
    const index = currentJourneys.findIndex(j => j.id === journey.id);
    if (index !== -1) {
      currentJourneys[index] = journey;
      this.journeys.next([...currentJourneys]);
    }
  }

  deleteJourney(id: number): void {
    const currentJourneys = this.journeys.value;
    this.journeys.next(currentJourneys.filter(j => j.id !== id));
  }

  // Grade methods
  getGrades(): Observable<Grade[]> {
    return this.grades.asObservable();
  }

  addGrade(grade: Omit<Grade, 'id'>): void {
    const currentGrades = this.grades.value;
    const newId = Math.max(...currentGrades.map(g => g.id)) + 1;
    const newGrade = { ...grade, id: newId };
    this.grades.next([...currentGrades, newGrade]);
  }

  updateGrade(grade: Grade): void {
    const currentGrades = this.grades.value;
    const index = currentGrades.findIndex(g => g.id === grade.id);
    if (index !== -1) {
      currentGrades[index] = grade;
      this.grades.next([...currentGrades]);
    }
  }

  deleteGrade(id: number): void {
    const currentGrades = this.grades.value;
    this.grades.next(currentGrades.filter(g => g.id !== id));
  }

  // Role methods
  getRoles(): Observable<Role[]> {
    return this.roles.asObservable();
  }

  addRole(role: Omit<Role, 'id'>): void {
    const currentRoles = this.roles.value;
    const newId = Math.max(...currentRoles.map(r => r.id)) + 1;
    const newRole = { ...role, id: newId };
    this.roles.next([...currentRoles, newRole]);
  }

  updateRole(role: Role): void {
    const currentRoles = this.roles.value;
    const index = currentRoles.findIndex(r => r.id === role.id);
    if (index !== -1) {
      currentRoles[index] = role;
      this.roles.next([...currentRoles]);
    }
  }

  deleteRole(id: number): void {
    const currentRoles = this.roles.value;
    this.roles.next(currentRoles.filter(r => r.id !== id));
  }

  // Technology methods
  getTechnologies(): Observable<Technology[]> {
    return this.technologies.asObservable();
  }

  addTechnology(technology: Omit<Technology, 'id'>): void {
    const currentTechnologies = this.technologies.value;
    const newId = Math.max(...currentTechnologies.map(t => t.id)) + 1;
    const newTechnology = { ...technology, id: newId };
    this.technologies.next([...currentTechnologies, newTechnology]);
  }

  updateTechnology(technology: Technology): void {
    const currentTechnologies = this.technologies.value;
    const index = currentTechnologies.findIndex(t => t.id === technology.id);
    if (index !== -1) {
      currentTechnologies[index] = technology;
      this.technologies.next([...currentTechnologies]);
    }
  }

  deleteTechnology(id: number): void {
    const currentTechnologies = this.technologies.value;
    this.technologies.next(currentTechnologies.filter(t => t.id !== id));
  }
}