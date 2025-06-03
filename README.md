# Permalist API

A RESTful API for managing tasks and to-do lists with user authentication and authorization.

## Features

-   User authentication (Local and Google OAuth)
-   Task management (CRUD operations)
-   Role-based access control
-   PostgreSQL database
-   Express.js backend
-   Passport.js authentication

## Prerequisites

-   Node.js (v14 or higher)
-   PostgreSQL
-   Google OAuth credentials (for Google login)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/permalist-api.git
cd permalist-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
SESSION_SECRET=your_session_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CLIENT_CALLBACKURL=http://localhost:3000/auth/google/callback
```

4. Set up the database:

-   Create a PostgreSQL database
-   Run the migrations in the `migrations` folder

5. Start the server:

```bash
npm start
```

## API Endpoints

### Authentication

-   POST `/register` - Register a new user
-   POST `/login` - Login with email and password
-   GET `/auth/google` - Login with Google
-   GET `/logout` - Logout user

### Tasks

-   GET `/items` - Get all tasks
-   POST `/items` - Create a new task
-   GET `/items/:id` - Get a specific task
-   PUT `/items/:id` - Update a task
-   DELETE `/items/:id` - Delete a task

## Technologies Used

-   Node.js
-   Express.js
-   PostgreSQL
-   Passport.js
-   JWT
-   bcrypt
-   dotenv

## License

MIT
