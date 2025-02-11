# Event Scheduler

A full-stack event scheduling application built with **Next.js** for the frontend and **FastAPI** for the backend. This application allows users to create, read, update, and delete (CRUD) events efficiently.

## Features

- **Event Management**: Create, read, update, and delete events.
- **Responsive UI**: Clean and modern interface optimized for all devices.
- **API Integration**: Robust API endpoints powered by FastAPI.
- **Database Support**: Uses PostgreSQL, SQLAlchemy, and Alembic for managing event data.
- **Error Handling**: Comprehensive error handling on both frontend and backend.

## Tech Stack

### Frontend

- `Next.js` (React framework)
- `TypeScript` for enhanced code quality
- `React Hook Form` for form handling
- `React Query (Tanstack)` for data fetching and caching
- `Tailwind CSS` for styling
- `Shadcn UI` for customizable Radix UI components
- `Zustand` for handling global state
- `Zod` for type validation
- `Axios` for API requests

### Backend

- `FastAPI` for building APIs
- `Alembic` for database migrations
- `SQLAlchemy` for ORM (Object Relational Mapping)
- `Pydantic` for data validation

### Database

- `PostgreSQL 16` as relational database

### Others

- `Docker` for containerization

## Getting Started

### Prerequisites

- `Node.js v14+`
- `Python v3.8+`
- `PostgreSQL`

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/vnycorn/event-scheduler.git
   cd event-scheduler
   ```

2. **Set Up Frontend**

   ```bash
   npm install -g pnpm
   pnpm install

   # Run the development server
   npm run dev

   or

   # Run the production server
   pnpm run build
   pnpm run start
   ```

3. **Set Up Backend**

   ```bash
   cd api
   pip install poetry

   # Create a virtual environment
   poetry shell
   poetry install

   # Run the FastAPI server
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

4. **Access the Application**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api](http://localhost:8000/api)

## API Endpoints

### Event Endpoints

- **GET** `/events/` - Retrieve all events
- **POST** `/events/` - Create a new event
- **PUT** `/events/{id}` - Update an existing event
- **DELETE** `/events/{id}` - Delete an event

## Environment Variables

Create a `.env` file in both `backend/` and `frontend/` directories with the following variables:

### Backend (poetry)

```bash
DB_HOST = "your-db-host"
DB_PORT = "your-db-port"
DB_NAME = "your-db-name"
DB_USER = "your-db-user"
DB_PASSWORD = "your-db-password"
```

Frontend (pnpm)

```bash
# Local Environment
NEXT_PUBLIC_API_URL="http://localhost:8000"
API_STR="/api/v1"

# Production Environment
NEXT_PUBLIC_API_URL="https://your-production-api-url"
API_STR="/api"
```

## Deployment

### Docker (Optional)

1. **Build and Run Containers**

   ```bash
   docker-compose up --build
   ```

2. **Container Management**

   ```bash
   docker-compose ps
   docker-compose down
   docker-compose logs -f
   ```

3. **Access the App**

   For local development:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000/api](http://localhost:8000/api)

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please contact [danieldeparis112@gmail.com](mailto:danieldeparis112@gmail.com).
