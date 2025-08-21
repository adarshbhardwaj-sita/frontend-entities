import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  employee_Id: number; // Changed back to number as requested
  name: string;
  email: string;
  department: string;
  designation: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages?: number; // Optional since backend doesn't provide it
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface BudgetCategory {
  id: number;
  categoryType: string;
  budgetAmount: number;
  financialYear: number; // Changed from string to number (e.g., 2025)
}

export interface Journey {
  journeyId: number;
  journeyName: string;
  journeyDescription: string;
  destination: string;
  durationInDays: number;
  budget: number;
}

export interface Grade {
  gradeId: number;
  gradeLevel: string;
  gradeDescription: string;
}

export interface Role {
  role_Id: number;
  role_Title: string;
  project_Name: string;
}

export interface Technology {
  id: number;
  technologyStack: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:5145/api';

  constructor(private http: HttpClient) { }

  // Employee methods using HttpClient
  getEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    // Use real backend API
    let url = `${this.apiUrl}/employee/paged`;
    if (params) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        pageSize: params.pageSize.toString()
      });
      url += `?${queryParams.toString()}`;
    }
    return this.http.get<PaginatedResponse<Employee>>(url);
  }

  // Search employee by ID
  searchEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/Employee/${id}`);
  }

  // Mock data for development/testing
  private getMockEmployees(params?: PaginationParams): Observable<PaginatedResponse<Employee>> {
    console.log('getMockEmployees called with params:', params);
    
    // Generate mock employee data matching backend format
    const mockEmployees: Employee[] = [
      { employee_Id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering', designation: 'Senior Software Engineer' },
      { employee_Id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Product', designation: 'Product Manager' },
      { employee_Id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Design', designation: 'UI/UX Designer' },
      { employee_Id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Analytics', designation: 'Data Analyst' },
      { employee_Id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Engineering', designation: 'DevOps Engineer' },
      { employee_Id: 6, name: 'Lisa Davis', email: 'lisa.davis@company.com', department: 'Engineering', designation: 'Frontend Developer' },
      { employee_Id: 7, name: 'Tom Miller', email: 'tom.miller@company.com', department: 'Engineering', designation: 'Backend Developer' },
      { employee_Id: 8, name: 'Emily Garcia', email: 'emily.garcia@company.com', department: 'Engineering', designation: 'QA Engineer' },
      { employee_Id: 9, name: 'Chris Lee', email: 'chris.lee@company.com', department: 'IT', designation: 'System Administrator' },
      { employee_Id: 10, name: 'Amanda Taylor', email: 'amanda.taylor@company.com', department: 'Business', designation: 'Business Analyst' },
      { employee_Id: 11, name: 'Robert Anderson', email: 'robert.anderson@company.com', department: 'Project Management', designation: 'Project Manager' },
      { employee_Id: 12, name: 'Jennifer Martinez', email: 'jennifer.martinez@company.com', department: 'Agile', designation: 'Scrum Master' },
      { employee_Id: 13, name: 'Michael Thompson', email: 'michael.thompson@company.com', department: 'Engineering', designation: 'Technical Lead' },
      { employee_Id: 14, name: 'Jessica White', email: 'jessica.white@company.com', department: 'Design', designation: 'UX Researcher' },
      { employee_Id: 15, name: 'Daniel Clark', email: 'daniel.clark@company.com', department: 'Engineering', designation: 'Mobile Developer' },
      { employee_Id: 16, name: 'Ashley Rodriguez', email: 'ashley.rodriguez@company.com', department: 'Analytics', designation: 'Data Scientist' },
      { employee_Id: 17, name: 'Kevin Lewis', email: 'kevin.lewis@company.com', department: 'IT', designation: 'Network Engineer' },
      { employee_Id: 18, name: 'Stephanie Hall', email: 'stephanie.hall@company.com', department: 'Security', designation: 'Security Analyst' },
      { employee_Id: 19, name: 'Ryan Young', email: 'ryan.young@company.com', department: 'Engineering', designation: 'Cloud Architect' },
      { employee_Id: 20, name: 'Nicole King', email: 'nicole.king@company.com', department: 'Product', designation: 'Product Owner' }
    ];

    return new Observable(observer => {
      console.log('Mock data observable created');
      setTimeout(() => {
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = mockEmployees.slice(startIndex, endIndex);
        
        const response: PaginatedResponse<Employee> = {
          items: paginatedData,
          totalCount: mockEmployees.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(mockEmployees.length / pageSize)
        };
        
        console.log('Mock response created:', response);
        observer.next(response);
        observer.complete();
      }, 500); // Simulate API delay
    });
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/Employee`, employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/Employee/${employee.employee_Id}`, employee);
  }

  deleteEmployee(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/Employee/${id}`);
  }

  // BudgetCategory CRUD
  getBudgetCategories(): Observable<BudgetCategory[]> {
    return this.http.get<BudgetCategory[]>(`${this.apiUrl}/BudgetCategory`);
  }

  // Search budget category by ID
  searchBudgetCategoryById(id: number): Observable<BudgetCategory> {
    return this.http.get<BudgetCategory>(`${this.apiUrl}/BudgetCategory/${id}`);
  }

  addBudgetCategory(category: Omit<BudgetCategory, 'id'>): Observable<BudgetCategory> {
    return this.http.post<BudgetCategory>(`${this.apiUrl}/BudgetCategory`, category);
  }

  updateBudgetCategory(category: BudgetCategory): Observable<BudgetCategory> {
    return this.http.put<BudgetCategory>(`${this.apiUrl}/BudgetCategory/${category.id}`, category);
  }

  deleteBudgetCategory(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/BudgetCategory/${id}`);
  }

  // Journey CRUD
  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.apiUrl}/Journey`);
  }

  // Search journey by ID
  searchJourneyById(id: number): Observable<Journey> {
    return this.http.get<Journey>(`${this.apiUrl}/Journey/${id}`);
  }

  addJourney(journey: Omit<Journey, 'journeyId'>): Observable<Journey> {
    return this.http.post<Journey>(`${this.apiUrl}/Journey`, journey);
  }

  updateJourney(journey: Journey): Observable<Journey> {
    return this.http.put<Journey>(`${this.apiUrl}/Journey/${journey.journeyId}`, journey);
  }

  deleteJourney(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/Journey/${id}`);
  }

  // Grade CRUD
  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/Grade`);
  }

  // Search grade by ID
  searchGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/Grade/${id}`);
  }

  addGrade(grade: Omit<Grade, 'gradeId'>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/Grade`, grade);
  }

  updateGrade(grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/Grade/${grade.gradeId}`, grade);
  }

  deleteGrade(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/Grade/${id}`);
  }

  // Role CRUD
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/Role`);
  }

  // Search role by ID
  searchRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/Role/${id}`);
  }

  addRole(role: Omit<Role, 'role_Id'>): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/Role`, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/Role/${role.role_Id}`, role);
  }

  deleteRole(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/Role/${id}`);
  }

  // Technology CRUD
  getTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.apiUrl}/Technologies`);
  }

  // Search technology by ID
  searchTechnologyById(id: number): Observable<Technology> {
    return this.http.get<Technology>(`${this.apiUrl}/Technologies/${id}`);
  }

  addTechnology(technology: Omit<Technology, 'id'>): Observable<Technology> {
    return this.http.post<Technology>(`${this.apiUrl}/Technologies`, technology);
  }

  updateTechnology(technology: Technology): Observable<Technology> {
    return this.http.put<Technology>(`${this.apiUrl}/Technologies/${technology.id}`, technology);
  }

  deleteTechnology(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/Technologies/${id}`);
  }
}