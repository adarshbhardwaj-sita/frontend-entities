import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  email: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
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
  getEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    // For development/testing, return mock data if API is not available
    // if (!this.apiUrl || this.apiUrl === 'https://your-api-url.com/api') {
    //   return this.getMockEmployees(params);
    // }
    
    let url = `${this.apiUrl}/employees`;
    if (params) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        pageSize: params.pageSize.toString()
      });
      url += `?${queryParams.toString()}`;
    }
    return this.http.get<PaginatedResponse<Employee>>(url);
  }

  // Mock data for development/testing
  private getMockEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    // Generate mock employee data
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John Doe', email: 'john.doe@company.com', description: 'Senior Software Engineer' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', description: 'Product Manager' },
      { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', description: 'UI/UX Designer' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', description: 'Data Analyst' },
      { id: 5, name: 'David Brown', email: 'david.brown@company.com', description: 'DevOps Engineer' },
      { id: 6, name: 'Lisa Davis', email: 'lisa.davis@company.com', description: 'Frontend Developer' },
      { id: 7, name: 'Tom Miller', email: 'tom.miller@company.com', description: 'Backend Developer' },
      { id: 8, name: 'Emily Garcia', email: 'emily.garcia@company.com', description: 'QA Engineer' },
      { id: 9, name: 'Chris Lee', email: 'chris.lee@company.com', description: 'System Administrator' },
      { id: 10, name: 'Amanda Taylor', email: 'amanda.taylor@company.com', description: 'Business Analyst' },
      { id: 11, name: 'Robert Anderson', email: 'robert.anderson@company.com', description: 'Project Manager' },
      { id: 12, name: 'Jennifer Martinez', email: 'jennifer.martinez@company.com', description: 'Scrum Master' },
      { id: 13, name: 'Michael Thompson', email: 'michael.thompson@company.com', description: 'Technical Lead' },
      { id: 14, name: 'Jessica White', email: 'jessica.white@company.com', description: 'UX Researcher' },
      { id: 15, name: 'Daniel Clark', email: 'daniel.clark@company.com', description: 'Mobile Developer' },
      { id: 16, name: 'Ashley Rodriguez', email: 'ashley.rodriguez@company.com', description: 'Data Scientist' },
      { id: 17, name: 'Kevin Lewis', email: 'kevin.lewis@company.com', description: 'Network Engineer' },
      { id: 18, name: 'Stephanie Hall', email: 'stephanie.hall@company.com', description: 'Security Analyst' },
      { id: 19, name: 'Ryan Young', email: 'ryan.young@company.com', description: 'Cloud Architect' },
      { id: 20, name: 'Nicole King', email: 'nicole.king@company.com', description: 'Product Owner' }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = mockEmployees.slice(startIndex, endIndex);
        
        const response: PaginatedResponse<Employee> = {
          data: paginatedData,
          total: mockEmployees.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(mockEmployees.length / pageSize)
        };
        
        observer.next(response);
        observer.complete();
      }, 500); // Simulate API delay
    });
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