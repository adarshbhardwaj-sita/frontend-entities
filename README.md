# Frontend Entities - Employee Management with Pagination

This Angular application demonstrates a comprehensive employee management system with advanced pagination features.

## Features

### Employee Management

- View, add, edit, and delete employees
- Responsive table design with modern UI
- Modal forms for employee operations

### Advanced Pagination

- **Page Navigation**: First, Previous, Next, Last page buttons
- **Page Numbers**: Direct navigation to specific pages
- **Page Size Control**: Choose from 5, 10, 20, or 50 items per page
- **Pagination Info**: Shows current range and total count
- **Responsive Design**: Mobile-friendly pagination controls

### Technical Implementation

- **Service Layer**: RESTful API integration with fallback to mock data
- **Type Safety**: Full TypeScript interfaces for pagination
- **State Management**: Reactive pagination state handling
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Graceful error management

## Pagination API

The pagination system expects the following API response format:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### API Endpoint

```
GET /api/employees?page={page}&pageSize={pageSize}
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:4200`

### Mock Data

For development and testing, the application includes mock employee data (20 employees) that automatically enables pagination when no real API is configured.

## File Structure

```
src/app/components/employee/
├── employee.component.ts      # Main component with pagination logic
├── employee.component.html    # Template with pagination controls
└── employee.component.scss    # Styles for pagination and UI

src/app/services/
└── data.service.ts           # Service with pagination API methods
```

## Pagination Methods

- `goToPage(page: number)`: Navigate to specific page
- `nextPage()`: Go to next page
- `prevPage()`: Go to previous page
- `onPageSizeChange(event)`: Change items per page
- `getPageNumbers()`: Get visible page numbers for navigation

## Responsive Design

The pagination controls automatically adapt to different screen sizes:

- Desktop: Horizontal layout with all controls visible
- Mobile: Vertical layout for better touch interaction
- Tablet: Optimized spacing and sizing

## Future Enhancements

- Search and filtering with pagination
- Sorting with pagination
- Export functionality
- Bulk operations
- Advanced filtering options
