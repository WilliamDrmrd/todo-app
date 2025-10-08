# Todo List Application

A full-stack todo list application built for a software engineering internship assignment. Features a REST API backend with NestJS and TypeScript, a React frontend with responsive design, and PostgreSQL database for data persistence.

## Technology Stack

**Backend:**
- Node.js with NestJS framework
- TypeScript
- PostgreSQL database
- Prisma ORM
- Class-validator for input validation
- Swagger for API documentation

**Frontend:**
- React 18 with TypeScript
- Custom CSS with responsive design for mobile and desktop

**Testing:**
- Jest with Supertest for end-to-end API testing
- Test coverage for all CRUD operations and validation

## Installation and Setup

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- npm

### Installation Steps

1. Clone the repository and set up environment:
```bash
git clone <repository-url>
cd todo-app
cp backend/.env.example backend/.env
```

2. Start the application:
```bash
docker compose up -d
```

The application is now running:
- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:5173`
- Database migrations run automatically on startup

### Running without Docker (optional)

If you prefer to run locally without Docker:
```bash
# Start PostgreSQL separately, then:
npm run dev
```

## Running Tests

```bash
# Set up the environment
docker compose up db -d
cp backend/.env.example backend/.env

cd backend
npm install
npx prisma generate
npm run test:e2e
```

The test suite includes:
- Creating a todo successfully
- Validating that missing title returns an error (400)
- Verifying 404 response for non-existent todos
- All CRUD operations with proper status codes

## API Documentation

### Base URL
`http://localhost:3001`

### Endpoints

**POST /todos**
- Create a new todo item
- Request body: `{ "title": "Task description", "completed": false, "priority": "MEDIUM" }`
  - `priority` field is optional, defaults to "MEDIUM". Valid values: "LOW", "MEDIUM", "HIGH"
- Response: `{ "id": 1, "title": "Task description", "completed": false, "priority": "MEDIUM", "createdAt": "2024-01-01T00:00:00Z", "updatedAt": "..." }`
- Status codes: 201 (created), 400 (bad request)

**GET /todos**
- Get all todo items
- Query parameters (optional):
  - `filter`: Filter todos by completion status. Valid values: "all", "completed", "pending"
- Response: Array of todo objects
- Status code: 200

**GET /todos/stats**
- Get statistics about todos
- Response: `{ "total": 10, "completed": 3, "pending": 7 }`
- Status code: 200

**GET /todos/:id**
- Get a specific todo item by ID
- Response: Todo object
- Status codes: 200 (success), 404 (not found)

**PUT /todos/:id**
- Update a todo item
- Request body: `{ "title": "Updated title", "completed": true, "priority": "HIGH" }` (all fields optional)
- Response: Updated todo object
- Status codes: 200 (success), 404 (not found)

**DELETE /todos/:id**
- Delete a todo item
- Response: Deleted todo object
- Status codes: 200 (success), 404 (not found)

### Interactive API Documentation

View the Swagger API documentation at: `http://localhost:3001/api`

### Example Requests

```bash
# Create a todo with priority
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete assignment", "completed": false, "priority": "HIGH"}'

# Get all todos
curl http://localhost:3001/todos

# Get only completed todos
curl http://localhost:3001/todos?filter=completed

# Get only pending todos
curl http://localhost:3001/todos?filter=pending

# Get todo statistics
curl http://localhost:3001/todos/stats

# Update a todo's priority
curl -X PUT http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"priority": "LOW", "completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3001/todos/1
```

## Design Decisions and Assumptions

**Database Choice:**
- Used PostgreSQL instead of in-memory storage for data persistence between restarts, making the application more practical for real-world use and deployment

**Additional Features:**
- Added a description field to todos for more detailed task information
- Implemented Swagger documentation for easier API testing and exploration during development

## Challenges and Solutions

**Mobile and Desktop Design Consistency**
- Ensuring the UI works well on both mobile devices and desktop screens with different interaction patterns

## Future Improvements

Given more time, I would add:

- User authentication and multi-user support with separate todo lists per user
- Real-time collaboration features using WebSockets for live updates across multiple clients

## Project Structure

```
todo-app/
├── backend/              # NestJS backend API
│   ├── src/
│   │   ├── todos/       # Todo module (controller, service, DTOs)
│   │   ├── prisma/      # Prisma service
│   │   └── main.ts      # Application entry
│   ├── prisma/          # Database schema and migrations
│   └── test/            # Test files
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets
└── docker-compose.yml   # PostgreSQL configuration
```

## License

This project was created for educational purposes as part of a take-home assignment.
