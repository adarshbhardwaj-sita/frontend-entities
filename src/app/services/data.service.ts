import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'https://your-api-url.com/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Employee methods using HttpClient
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employees/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`);
  }

 // BudgetCategory CRUD
getBudgetCategories(): Observable<BudgetCategory[]> {
  return this.http.get<BudgetCategory[]>(`${this.apiUrl}/budget-categories`);
}

addBudgetCategory(category: Omit<BudgetCategory, 'id'>): Observable<BudgetCategory> {
  return this.http.post<BudgetCategory>(`${this.apiUrl}/budget-categories`, category);
}

updateBudgetCategory(category: BudgetCategory): Observable<BudgetCategory> {
  return this.http.put<BudgetCategory>(`${this.apiUrl}/budget-categories/${category.id}`, category);
}

deleteBudgetCategory(id: number): Observable<{}> {
  return this.http.delete(`${this.apiUrl}/budget-categories/${id}`);
}

// Journey CRUD
getJourneys(): Observable<Journey[]> {
  return this.http.get<Journey[]>(`${this.apiUrl}/journeys`);
}

addJourney(journey: Omit<Journey, 'id'>): Observable<Journey> {
  return this.http.post<Journey>(`${this.apiUrl}/journeys`, journey);
}

updateJourney(journey: Journey): Observable<Journey> {
  return this.http.put<Journey>(`${this.apiUrl}/journeys/${journey.id}`, journey);
}

deleteJourney(id: number): Observable<{}> {
  return this.http.delete(`${this.apiUrl}/journeys/${id}`);
}

// Grade CRUD
getGrades(): Observable<Grade[]> {
  return this.http.get<Grade[]>(`${this.apiUrl}/grades`);
}

addGrade(grade: Omit<Grade, 'id'>): Observable<Grade> {
  return this.http.post<Grade>(`${this.apiUrl}/grades`, grade);
}

updateGrade(grade: Grade): Observable<Grade> {
  return this.http.put<Grade>(`${this.apiUrl}/grades/${grade.id}`, grade);
}

deleteGrade(id: number): Observable<{}> {
  return this.http.delete(`${this.apiUrl}/grades/${id}`);
}

// Role CRUD
getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>(`${this.apiUrl}/roles`);
}

addRole(role: Omit<Role, 'id'>): Observable<Role> {
  return this.http.post<Role>(`${this.apiUrl}/roles`, role);
}

updateRole(role: Role): Observable<Role> {
  return this.http.put<Role>(`${this.apiUrl}/roles/${role.id}`, role);
}

deleteRole(id: number): Observable<{}> {
  return this.http.delete(`${this.apiUrl}/roles/${id}`);
}

// Technology CRUD
getTechnologies(): Observable<Technology[]> {
  return this.http.get<Technology[]>(`${this.apiUrl}/technologies`);
}

addTechnology(technology: Omit<Technology, 'id'>): Observable<Technology> {
  return this.http.post<Technology>(`${this.apiUrl}/technologies`, technology);
}

updateTechnology(technology: Technology): Observable<Technology> {
  return this.http.put<Technology>(`${this.apiUrl}/technologies/${technology.id}`, technology);
}

deleteTechnology(id: number): Observable<{}> {
  return this.http.delete(`${this.apiUrl}/technologies/${id}`);
}
}