# .NET Backend Integration for Employee Pagination

This guide shows how to implement the backend pagination API to work with the Angular frontend.

## Backend Data Structure

Your .NET backend should return data in this format:

```json
{
  "items": [
    {
      "employee_Id": 9,
      "name": "vyom",
      "email": "string",
      "department": "string",
      "designation": "string"
    }
  ],
  "totalCount": 16,
  "page": 1,
  "pageSize": 10
}
```

## Required .NET Models

### 1. Employee Model

```csharp
public class Employee
{
    public int Employee_Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
}
```

### 2. Pagination Request

```csharp
public class PaginationRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public bool IsValid => Page > 0 && PageSize > 0 && PageSize <= 100;
}
```

### 3. Paginated Response

```csharp
public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }

    // Optional: Calculate total pages on the frontend
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
```

## API Endpoints

### GET /api/Employee/paged

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Example Requests:**

```
GET /api/Employee/paged?page=1&pageSize=10
GET /api/Employee/paged?page=2&pageSize=5
GET /api/Employee/paged
```

**Response:**

```json
{
  "items": [...],
  "totalCount": 16,
  "page": 1,
  "pageSize": 10
}
```

## Implementation Steps

### 1. Create Extension Method

```csharp
public static class PaginationExtensions
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> query, PaginationRequest request)
    {
        return query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);
    }

    public static async Task<PaginatedResponse<T>> ToPaginatedResponseAsync<T>(
        this IQueryable<T> query,
        PaginationRequest request)
    {
        var total = await query.CountAsync();
        var data = await query.Paginate(request).ToListAsync();

        return new PaginatedResponse<T>(data, total, request.Page, request.PageSize);
    }
}
```

### 2. Update Employee Service

```csharp
public async Task<PaginatedResponse<Employee>> GetEmployeesAsync(PaginationRequest request)
{
    if (!request.IsValid)
    {
        throw new ArgumentException("Invalid pagination parameters");
    }

    var query = _context.Employees
        .AsNoTracking()
        .OrderBy(e => e.Name);

    var totalCount = await query.CountAsync();
    var items = await query
        .Skip((request.Page - 1) * request.PageSize)
        .Take(request.PageSize)
        .ToListAsync();

    return new PaginatedResponse<Employee>
    {
        Items = items,
        TotalCount = totalCount,
        Page = request.Page,
        PageSize = request.PageSize
    };
}
```

### 3. Update Controller

```csharp
[HttpGet("paged")]
public async Task<ActionResult<PaginatedResponse<Employee>>> GetEmployeesPaged(
    [FromQuery] PaginationRequest request)
{
    try
    {
        if (!request.IsValid)
        {
            return BadRequest("Invalid pagination parameters");
        }

        var result = await _employeeService.GetEmployeesAsync(request);
        return Ok(result);
    }
    catch (Exception ex)
    {
        return StatusCode(500, "An error occurred while retrieving employees");
    }
}
```

## Testing

### Test with Mock Data

The Angular frontend currently uses mock data. To test with your .NET backend:

1. Update the `apiUrl` in `src/app/services/data.service.ts`
2. Ensure your .NET API is running
3. The frontend will automatically switch from mock data to real API calls

### Test API Endpoints

```bash
# Test pagination
curl "http://localhost:5145/api/Employee/paged?page=1&pageSize=5"

# Test without parameters (should use defaults)
curl "http://localhost:5145/api/Employee/paged"

# Test invalid parameters
curl "http://localhost:5145/api/Employee/paged?page=0&pageSize=5"
```

## Error Handling

### Validation Errors

- Return `400 Bad Request` for invalid pagination parameters
- Include error message in response body

### Server Errors

- Return `500 Internal Server Error` for unexpected exceptions
- Log detailed errors on server side
- Return generic error message to client

## Performance Considerations

1. **Database Indexing**: Add indexes on frequently queried fields
2. **Query Optimization**: Use `AsNoTracking()` for read-only operations
3. **Caching**: Consider caching paginated results for frequently accessed pages
4. **Connection Pooling**: Ensure proper database connection management

## Security

1. **Input Validation**: Validate all pagination parameters
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Authentication**: Add proper authentication/authorization
4. **SQL Injection**: Use parameterized queries (Entity Framework handles this)

## Monitoring

1. **Logging**: Log pagination requests and performance metrics
2. **Metrics**: Track response times and error rates
3. **Health Checks**: Implement health check endpoints
4. **Alerting**: Set up alerts for high error rates or slow responses
