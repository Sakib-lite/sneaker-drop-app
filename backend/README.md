# Sneaker Drop - Backend

Express.js backend for the Limited Edition Sneaker Drop real-time inventory system.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **Socket.IO** - Real-time WebSocket communication
- **Swagger** - API documentation
- **Winston** - Logging
- **Helmet** - Security headers
- **Zod** - Environment validation

## Features

- ✅ Real-time WebSocket updates with Socket.IO
- ✅ Atomic reservation system with race condition handling
- ✅ 60-second reservation expiration mechanism
- ✅ PostgreSQL database with Prisma ORM
- ✅ Comprehensive API documentation with Swagger
- ✅ Rate limiting and security middleware
- ✅ Structured logging with Winston
- ✅ TypeScript with path aliases

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory (see `.env.example`):

```env
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000
DATABASE_URL=postgresql://user:password@localhost:5432/sneaker_drop
FRONTEND_URL=http://localhost:3000
APP_NAME=Sneaker Drop API
RESERVATION_TIMEOUT_SECONDS=60
```

### Database Setup

```bash
# Generate Prisma Client
npm run generate

# Run migrations
npm run migrate:dev

# (Optional) Seed database
npm run seed
```

### Development

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.ts    # Prisma client
│   │   ├── env.ts         # Environment validation
│   │   └── logger.ts      # Winston logger
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── notFound.ts
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── docs/              # Swagger configuration
│   ├── app.ts             # Express app setup
│   └── index.ts           # Server entry point
└── package.json
```

## Architecture Decisions

### Concurrency Control
- Uses Prisma transactions with proper isolation levels
- Atomic updates for stock management to prevent overselling

### Reservation Expiration
- Background job checks for expired reservations
- Automatic stock recovery when reservations expire
- Real-time WebSocket notifications to all connected clients

### Real-Time Updates
- Socket.IO for bi-directional communication
- Events broadcast to all connected clients on stock changes
