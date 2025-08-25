# Defect Management System — Full Routing (React + Node.js)

## Run
### Server
```
cd server
npm i
npm run dev
```
API on `http://localhost:4000/api`:
- `/projects`
- `/testers`
- `/test-cases` (+ `/import/bank`, `/import/external`, `/import/project`)
- `/test-cycles`
- `/executions`
- `/defects`
- `/reports` (`/client-status`, `/sg-status`, `/issue-type`)
- `/parameters`
- `/auth` (`POST /login`, `POST /logout`)

### Client
```
cd client
npm i
npm start
```
Login saves a demo token to `localStorage` and redirects to `/dashboard` (replace with real API call).

## Notes
- Protected routes require `Authorization: Bearer <token>`.
- Replace controller stubs with real DB + validation (e.g., Joi/Zod).
- Status enums and report endpoints match your requirements document.
