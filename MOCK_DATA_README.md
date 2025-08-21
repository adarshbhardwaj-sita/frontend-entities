# Mock Data Setup for E2E Testing

This document explains how to use the mock data service for testing your E2E functionality without needing a backend server.

## Overview

I've created a comprehensive mock data service that provides realistic test data for all 6 entities:

- **Employee** - 12 sample employees with realistic data
- **Budget Category** - 6 budget categories with financial data
- **Journey** - 5 project journeys with detailed descriptions
- **Grade** - 6 grade levels with descriptions
- **Role** - 8 roles with project assignments
- **Technology** - 8 technology stacks

## How to Use

### 1. **Enable Mock Data**

The mock data is controlled by a configuration flag in `src/app/config/app.config.ts`:

```typescript
export const AppConfig = {
  // Set this to true to use mock data, false to use real backend
  useMockData: true,

  // ... other config
};
```

**To use mock data**: Set `useMockData: true`
**To use real backend**: Set `useMockData: false`

### 2. **Mock Data Features**

The mock service provides:

- ✅ **Realistic data** that matches your backend format
- ✅ **Pagination support** for employee data
- ✅ **Search functionality** by ID for all entities
- ✅ **CRUD operations** (Create, Read, Update, Delete)
- ✅ **Network delay simulation** to mimic real API calls
- ✅ **Error handling** for invalid IDs

### 3. **Sample Data**

#### **Employees** (12 records)

- John Doe (Engineering - Senior Software Engineer)
- Jane Smith (Product - Product Manager)
- Mike Johnson (Design - UI/UX Designer)
- Sarah Wilson (Analytics - Data Analyst)
- David Brown (Engineering - DevOps Engineer)
- Lisa Davis (Engineering - Frontend Developer)
- Tom Miller (Engineering - Backend Developer)
- Emily Garcia (Engineering - QA Engineer)
- Chris Lee (IT - System Administrator)
- Alex Turner (Marketing - Digital Marketing Specialist)
- Rachel Green (HR - HR Manager)
- Kevin White (Finance - Financial Analyst)

#### **Budget Categories** (6 records)

- IT Infrastructure: $500,000
- Software Licenses: $150,000
- Training & Development: $75,000
- Marketing & Advertising: $200,000
- Office Supplies: $25,000
- Travel & Entertainment: $100,000

#### **Journeys** (5 records)

- Digital Transformation Initiative (365 days, $2M budget)
- Cloud Migration Project (180 days, $800K budget)
- Customer Experience Enhancement (240 days, $500K budget)
- Data Analytics Platform (120 days, $400K budget)
- Security Infrastructure Upgrade (90 days, $300K budget)

#### **Grades** (6 records)

- Junior, Intermediate, Senior, Lead, Principal, Director

#### **Roles** (8 records)

- Software Engineer, Product Manager, Data Scientist, DevOps Engineer, Security Specialist, UI/UX Designer, QA Engineer, Project Manager

#### **Technologies** (8 records)

- Angular/TypeScript/RxJS/NgRx
- React/Node.js/Express/MongoDB
- Vue.js/Python/Django/PostgreSQL
- Java/Spring Boot/Hibernate/MySQL
- C#/.NET Core/Entity Framework/SQL Server
- Python/Flask/SQLAlchemy/Redis
- JavaScript/Node.js/Express/MongoDB
- Go/Gin/GORM/PostgreSQL

## Testing Scenarios

### **Employee Management**

- ✅ View paginated employee list (12 employees, 10 per page)
- ✅ Search by employee ID (1-12)
- ✅ Add new employee (auto-generates ID 13+)
- ✅ Edit existing employee
- ✅ Delete employee with confirmation

### **Search Functionality**

- ✅ Search by ID across all entities
- ✅ Error handling for invalid IDs
- ✅ Clear search and reload data

### **Form Validation**

- ✅ All required fields validation
- ✅ Field constraints (min length, positive numbers, email format)
- ✅ Real-time validation feedback
- ✅ Pre-submission error checks

### **CRUD Operations**

- ✅ Create new records with auto-generated IDs
- ✅ Read existing data with pagination
- ✅ Update existing records
- ✅ Delete records with confirmation

## Running E2E Tests

### **1. Start Your Application**

```bash
npm start
```

### **2. Run Cypress Tests**

```bash
# Interactive mode (recommended for development)
npm run cypress:open

# Headless mode (for CI/CD)
npm run cypress:run
```

### **3. Test Specific Features**

```bash
# Test only employee functionality
npx cypress run --spec "cypress/e2e/02-employee-management.cy.ts"

# Test only UI/notifications
npx cypress run --spec "cypress/e2e/05-ui-notifications.cy.ts"
```

## Switching Between Mock and Real Data

### **To Use Mock Data (Current Setting)**

```typescript
// src/app/config/app.config.ts
export const AppConfig = {
  useMockData: true, // ✅ Mock data enabled
  // ... rest of config
};
```

### **To Use Real Backend**

```typescript
// src/app/config/app.config.ts
export const AppConfig = {
  useMockData: false, // ❌ Mock data disabled
  apiUrl: "http://localhost:5145/api", // Your backend URL
  // ... rest of config
};
```

## Benefits of This Setup

1. **No Backend Required** - Test E2E functionality immediately
2. **Realistic Data** - Test with data that matches your backend format
3. **Consistent Behavior** - Same data every time you run tests
4. **Easy Switching** - Toggle between mock and real data with one config change
5. **Comprehensive Coverage** - All entities and operations supported
6. **Network Simulation** - Realistic API delays for better testing

## Troubleshooting

### **Common Issues**

1. **Mock data not loading**

   - Check `AppConfig.useMockData` is set to `true`
   - Ensure `MockDataService` is properly imported

2. **Tests failing with element not found**

   - Verify CSS selectors match your actual HTML
   - Check if components are properly rendered

3. **Validation errors not showing**
   - Ensure form validation is enabled in `AppConfig.features.enableValidation`
   - Check if error message CSS classes exist

### **Reset Mock Data**

If you need to reset mock data to its original state:

```typescript
// In your component or service
constructor(private mockDataService: MockDataService) {}

resetData() {
  this.mockDataService.resetMockData();
}
```

## Next Steps

1. **Run the E2E tests** to verify everything works
2. **Customize mock data** if you need different test scenarios
3. **Add more test cases** for specific business logic
4. **Switch to real backend** when ready by changing `useMockData` to `false`

The mock data service provides a solid foundation for testing your application's functionality without external dependencies. You can now run comprehensive E2E tests that validate all your CRUD operations, search functionality, and form validations.
