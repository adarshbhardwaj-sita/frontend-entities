import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService, Employee, BudgetCategory, Journey, Grade, Role, Technology, PaginatedResponse } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Employees (paginated)
  it('should fetch employees (paginated)', () => {
    const mockResponse: PaginatedResponse<Employee> = {
      items: [
        { employee_Id: 1, name: 'John', email: 'john@example.com', department: 'IT', designation: 'Dev' },
        { employee_Id: 2, name: 'Jane', email: 'jane@example.com', department: 'HR', designation: 'HR Exec' }
      ],
      totalCount: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1
    };

    service.getEmployees({ page: 1, pageSize: 10 }).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.items.length).toBe(2);
    });

    const req = httpMock.expectOne(r => r.urlWithParams === `${(service as any)['apiUrl']}/employee/paged?page=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should add an employee', () => {
    const payload: Employee = { employee_Id: 3, name: 'Alice', email: 'alice@example.com', department: 'Ops', designation: 'Analyst' };
    service.addEmployee(payload).subscribe(employee => {
      expect(employee).toEqual(payload);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Employee`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('should update an employee', () => {
    const updated: Employee = { employee_Id: 1, name: 'John Updated', email: 'john.updated@example.com', department: 'IT', designation: 'Senior Dev' };
    service.updateEmployee(updated).subscribe(employee => {
      expect(employee).toEqual(updated);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Employee/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete an employee', () => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Employee/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // BudgetCategory
  it('should fetch budget categories', () => {
    const mockCategories: BudgetCategory[] = [
      { id: 1, categoryType: 'Travel', budgetAmount: 1000, financialYear: '2025' },
      { id: 2, categoryType: 'Training', budgetAmount: 2000, financialYear: '2025' }
    ];
    service.getBudgetCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/BudgetCategory`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should add a budget category', () => {
    const newCategory = { categoryType: 'Equipment', budgetAmount: 3000, financialYear: '2025' };
    const mockCategory: BudgetCategory = { id: 3, ...newCategory };
    service.addBudgetCategory(newCategory).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/BudgetCategory`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCategory);
  });

  it('should update a budget category', () => {
    const updatedCategory: BudgetCategory = { id: 1, categoryType: 'Travel Updated', budgetAmount: 1500, financialYear: '2025' };
    service.updateBudgetCategory(updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/BudgetCategory/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCategory);
  });

  it('should delete a budget category', () => {
    service.deleteBudgetCategory(1).subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/BudgetCategory/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Journey
  it('should fetch journeys', () => {
    const mockJourneys: Journey[] = [
      { journeyId: 1, journeyName: 'Onboarding', journeyDescription: 'Welcome process', destination: 'Dept A', durationInDays: 30, budget: 1000 },
      { journeyId: 2, journeyName: 'Training', journeyDescription: 'Skill upgrade', destination: 'Dept B', durationInDays: 60, budget: 2000 }
    ];
    service.getJourneys().subscribe(journeys => {
      expect(journeys).toEqual(mockJourneys);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Journey`);
    expect(req.request.method).toBe('GET');
    req.flush(mockJourneys);
  });

  it('should add a journey', () => {
    const payload: Omit<Journey, 'journeyId'> = { journeyName: 'New J', journeyDescription: 'Description of journey', destination: 'X', durationInDays: 10, budget: 100 };
    const mockJourney: Journey = { journeyId: 3, ...payload } as Journey;
    service.addJourney(payload).subscribe(journey => {
      expect(journey).toEqual(mockJourney);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Journey`);
    expect(req.request.method).toBe('POST');
    req.flush(mockJourney);
  });

  it('should update a journey', () => {
    const updated: Journey = { journeyId: 1, journeyName: 'Updated', journeyDescription: 'Updated desc', destination: 'Y', durationInDays: 15, budget: 150 };
    service.updateJourney(updated).subscribe(journey => {
      expect(journey).toEqual(updated);
    });
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Journey/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete a journey', () => {
    service.deleteJourney(1).subscribe(res => expect(res).toEqual({}));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Journey/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Grade
  it('should fetch grades', () => {
    const mockGrades: Grade[] = [
      { gradeId: 1, gradeLevel: 'L1', gradeDescription: 'Junior' },
      { gradeId: 2, gradeLevel: 'L2', gradeDescription: 'Mid' }
    ];
    service.getGrades().subscribe(grades => expect(grades).toEqual(mockGrades));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Grade`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGrades);
  });

  it('should add a grade', () => {
    const payload: Omit<Grade, 'gradeId'> = { gradeLevel: 'L3', gradeDescription: 'Senior' };
    const mockGrade: Grade = { gradeId: 3, ...payload } as Grade;
    service.addGrade(payload).subscribe(grade => expect(grade).toEqual(mockGrade));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Grade`);
    expect(req.request.method).toBe('POST');
    req.flush(mockGrade);
  });

  it('should update a grade', () => {
    const updated: Grade = { gradeId: 1, gradeLevel: 'L1+', gradeDescription: 'Junior plus' };
    service.updateGrade(updated).subscribe(grade => expect(grade).toEqual(updated));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Grade/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete a grade', () => {
    service.deleteGrade(1).subscribe(res => expect(res).toEqual({}));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Grade/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Role
  it('should fetch roles', () => {
    const mockRoles: Role[] = [
      { role_Id: 1, role_Title: 'Engineer', project_Name: 'Alpha' },
      { role_Id: 2, role_Title: 'Manager', project_Name: 'Beta' }
    ];
    service.getRoles().subscribe(roles => expect(roles).toEqual(mockRoles));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Role`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should add a role', () => {
    const payload: Omit<Role, 'role_Id'> = { role_Title: 'Designer', project_Name: 'Gamma' } as any;
    const mockRole: Role = { role_Id: 3, ...payload } as Role;
    service.addRole(payload).subscribe(role => expect(role).toEqual(mockRole));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Role`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRole);
  });

  it('should update a role', () => {
    const updated: Role = { role_Id: 1, role_Title: 'Lead Engineer', project_Name: 'Alpha' };
    service.updateRole(updated).subscribe(role => expect(role).toEqual(updated));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Role/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete a role', () => {
    service.deleteRole(1).subscribe(res => expect(res).toEqual({}));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Role/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Technology
  it('should fetch technologies', () => {
    const mockTechs: Technology[] = [
      { id: 1, technologyStack: 'Angular, TS' },
      { id: 2, technologyStack: 'React, JS' }
    ];
    service.getTechnologies().subscribe(techs => expect(techs).toEqual(mockTechs));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Technologies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTechs);
  });

  it('should add a technology', () => {
    const payload: Omit<Technology, 'id'> = { technologyStack: 'Node, Express' } as any;
    const mockTech: Technology = { id: 3, technologyStack: 'Node, Express' };
    service.addTechnology(payload).subscribe(t => expect(t).toEqual(mockTech));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Technology`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTech);
  });

  it('should update a technology', () => {
    const updated: Technology = { id: 1, technologyStack: 'Angular, TS, RxJS' };
    service.updateTechnology(updated).subscribe(t => expect(t).toEqual(updated));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Technology/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('should delete a technology', () => {
    service.deleteTechnology(1).subscribe(res => expect(res).toEqual({}));
    const req = httpMock.expectOne(`${(service as any)['apiUrl']}/Technology/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
