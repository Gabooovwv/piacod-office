# Environment Variables Configuration

## Frontend (Next.js)

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend URL configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002

# API Mode (nextjs or backend)
NEXT_PUBLIC_API_MODE=nextjs
```

### Variables Explained:

- `NEXT_PUBLIC_BACKEND_URL`: The URL of the Express backend server
- `NEXT_PUBLIC_API_MODE`: 
  - `nextjs`: Use Next.js API routes (default)
  - `backend`: Use Express backend directly

## Backend (Express.js)

Copy `backend/env.example` to `backend/.env` and configure:

```env
# Server Configuration
PORT=3002
NODE_ENV=development
BACKEND_URL=http://localhost:3002

# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3316
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=booha

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Variables Explained:

- `PORT`: Backend server port
- `BACKEND_URL`: Backend server URL (used in Swagger documentation)
- `MYSQL_*`: Database connection settings
- `CORS_ORIGIN`: Allowed origin for CORS
- `RATE_LIMIT_*`: Rate limiting configuration
- `JWT_SECRET`: Secret key for JWT token signing

## Production Deployment

For production, update the following variables:

### Frontend:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXT_PUBLIC_API_MODE=backend
```

### Backend:
```env
PORT=3002
NODE_ENV=production
BACKEND_URL=https://your-backend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=your-production-jwt-secret
``` 