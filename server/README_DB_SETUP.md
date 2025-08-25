# API Endpoints for Postman

Base URL: `http://localhost:4000/api`

- Auth
  - POST `/auth/login`
    - Headers: `Content-Type: application/json`
    - Body:
    ```json
    { "email": "admin@example.com", "password": "admin123" }
    ```
    - Response: `{ token, user }`
  - GET `/auth/me`
    - Headers: `Authorization: Bearer <token>`
  - POST `/auth/logout`

- Projects
  - GET `/projects?limit=10&offset=0` (Bearer token)
  - GET `/projects/:id` (Bearer token)

- Test Cases
  - GET `/test-cases?projectId=:id` (Bearer token)
  - GET `/test-cases/:testCaseId/steps` (Bearer token)

- Test Cycles
  - GET `/test-cycles?projectId=:id` (Bearer token)

- Executions
  - GET `/executions?projectId=:id` (Bearer token)

- Defects
  - GET `/defects?projectId=:id` (Bearer token)

- Reports
  - GET `/reports/kpis` (Bearer token)
  - GET `/reports/weekly-activity` (Bearer token)
  - GET `/reports/bug-distribution` (Bearer token)
