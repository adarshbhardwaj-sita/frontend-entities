import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService, Employee, BudgetCategory } from './data.service';

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

  // Employee tests
  it('should fetch employees', () => {
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];
    service.getEmployees().subscribe(employees => {
      expect(employees).toEqual(mockEmployees);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should add an employee', () => {
    const newEmployee = { name: 'Alice', email: 'alice@example.com' };
    const mockEmployee: Employee = { id: 3, ...newEmployee };
    service.addEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/employees`);
    expect(req.request.method).toBe('POST');
    req.flush(mockEmployee);
  });

  it('should update an employee', () => {
    const updatedEmployee: Employee = { id: 1, name: 'John Updated', email: 'john.updated@example.com' };
    service.updateEmployee(updatedEmployee).subscribe(employee => {
      expect(employee).toEqual(updatedEmployee);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/employees/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEmployee);
  });

  it('should delete an employee', () => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/employees/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // BudgetCategory tests
  it('should fetch budget categories', () => {
    const mockCategories: BudgetCategory[] = [
      { id: 1, categoryType: 'Travel', budgetAmount: 1000, financialYear: '2025' },
      { id: 2, categoryType: 'Training', budgetAmount: 2000, financialYear: '2025' }
    ];
    service.getBudgetCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/budget-categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should add a budget category', () => {
    const newCategory = { categoryType: 'Equipment', budgetAmount: 3000, financialYear: '2025' };
    const mockCategory: BudgetCategory = { id: 3, ...newCategory };
    service.addBudgetCategory(newCategory).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/budget-categories`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCategory);
  });

  it('should update a budget category', () => {
    const updatedCategory: BudgetCategory = { id: 1, categoryType: 'Travel Updated', budgetAmount: 1500, financialYear: '2025' };
    service.updateBudgetCategory(updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/budget-categories/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCategory);
  });

  it('should delete a budget category', () => {
    service.deleteBudgetCategory(1).subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/budget-categories/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
