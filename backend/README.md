# Admin Panel Backend

Express.js backend API for the admin panel with MySQL integration and Swagger UI documentation.

## Features

- 🚀 Express.js server with modern middleware
- 🗄️ MySQL database integration with connection pooling
- 📚 Swagger UI API documentation
- 🔒 Security middleware (Helmet, CORS, Rate Limiting)
- 📊 Request logging with Morgan
- 🏥 Health check endpoint
- 🎯 RESTful API endpoints for products and categories

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   ```

4. **Configure your .env file:**
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # MySQL Database Configuration
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=your_database
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3002` (or the port specified in your .env file).

## API Documentation

Once the server is running, you can access:

- **Swagger UI Documentation:** http://localhost:3002/api-docs
- **Health Check:** http://localhost:3002/health
- **API Base URL:** http://localhost:3002/api

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products with pagination |
| GET | `/api/products/:id` | Get product by ID |
| PATCH | `/api/products/:id` | Update product status |
| DELETE | `/api/products/:id` | Delete product |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all main categories |
| GET | `/api/categories/:id` | Get category by ID |
| GET | `/api/categories/:id/subcategories` | Get subcategories for a category |

## Database Schema

The backend expects the following MySQL tables:

### `classified` table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `main_category_name` - Main category name
- `main_subcategory_name` - Subcategory name
- `images` - Product images (JSON array)
- `main_image` - Main product image
- `created_at` - Creation timestamp
- `modified_at` - Last modification timestamp
- `is_active` - Active status (0/1)
- `is_enabled` - Enabled status (0/1)
- `parent_id` - Parent product ID
- `user_id` - User ID

### `category` table
- `id` - Primary key
- `name` - Category name
- `parent_id` - Parent category ID (0 for main categories)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── swagger.js       # Swagger documentation config
│   ├── middleware/
│   │   ├── cors.js          # CORS middleware
│   │   └── rateLimit.js     # Rate limiting middleware
│   ├── routes/
│   │   ├── products.js      # Product routes
│   │   └── categories.js    # Category routes
│   └── server.js            # Main server file
├── package.json
├── env.example
└── README.md
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - API request rate limiting
- **Input Validation** - Request data validation
- **SQL Injection Protection** - Parameterized queries

## Error Handling

The API includes comprehensive error handling:

- Database connection errors
- Invalid request data
- Missing resources (404)
- Server errors (500)
- Rate limiting exceeded

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Add Swagger documentation comments
3. Import and register the route in `src/server.js`

### Database Queries

Use the connection pool from `src/config/database.js`:

```javascript
const { pool } = require('../config/database');

// Example query
const [rows] = await pool.execute('SELECT * FROM table WHERE id = ?', [id]);
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your MySQL credentials in `.env`
   - Ensure MySQL server is running
   - Verify database exists

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port

3. **CORS Errors**
   - Update CORS_ORIGIN in `.env` to match your frontend URL

## License

ISC 