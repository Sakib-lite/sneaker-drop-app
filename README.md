# Sneaker Drop App

A real-time limited edition sneaker drop application with inventory management, reservations, and live stock updates.

## Features

- Real-time stock updates using WebSocket (Socket.IO)
- Atomic reservation system with race condition prevention
- 60-second reservation timeout with automatic cleanup
- Real-time purchase notifications
- Recent purchasers display
- Swagger API documentation
- Rate limiting for reservation endpoints

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Socket.IO for WebSockets
- Swagger/OpenAPI documentation

### Frontend
- React + TypeScript
- Vite
- Material-UI (MUI)
- Axios for API calls
- Socket.IO client

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sakib-lite/sneaker-drop-app
   cd sneaker-drop-app
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   
   cp .env.example .env
   npm run seed 
   
   
   ```

   Your `.env` should look like:
   ```env
   NODE_ENV=development
   PORT=5001
   SERVER_URL=http://localhost:5001
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=postgresql://user:password@host:5432/database
   RESERVATION_TIMEOUT_SECONDS=60
   FRONTEND_URL=http://localhost:5173
   ```

   ```bash
   # Run database migrations
   npm run migrate
   
   # Generate Prisma client
   npm run generate
   
   # Seed the database with sample data
   npm run seed
   
   # Start development server
   npm run dev
   ```

   Backend will run on `http://localhost:5001`

3. **Setup Frontend**

   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Edit .env if needed (default values should work)
   ```

   Your `.env` should look like:
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_WS_URL=http://localhost:5001
   ```

   ```bash
   # Start development server
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - API Documentation: http://localhost:5001/api-docs

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID

### Drops
- `POST /api/drops` - Create a new drop
- `GET /api/drops` - Get all drops
- `GET /api/drops/:id` - Get drop by ID

### Reservations
- `POST /api/reservations` - Create a reservation (rate limited)
- `GET /api/reservations/my-reservations` - Get user's active reservations
- `DELETE /api/reservations/:id` - Cancel a reservation

### Purchases
- `POST /api/purchases` - Complete a purchase

## WebSocket Events

### Client → Server
- `connection` - Client connects
- `disconnect` - Client disconnects

### Server → Client
- `STOCK_UPDATE` - Stock level changed
- `PURCHASE_COMPLETED` - Purchase was completed
- `NEW_DROP` - New drop added

## Database Schema

### User
- id (UUID)
- username (unique)
- email (unique, optional)
- createdAt
- updatedAt

### Drop
- id (UUID)
- name
- description
- price
- totalStock
- availableStock
- imageUrl
- startTime
- createdAt
- updatedAt

### Reservation
- id (UUID)
- userId (FK → User)
- dropId (FK → Drop)
- expiresAt
- isActive
- createdAt
- updatedAt

### Purchase
- id (UUID)
- userId (FK → User)
- dropId (FK → Drop)
- reservationId (FK → Reservation, optional)
- price
- createdAt
- updatedAt

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:dev` - Run migrations in development
- `npm run generate` - Generate Prisma client
- `npm run seed` - Seed database with sample data
- `npm run studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Backend
The backend requires persistent server support for WebSocket connections and background jobs. **Not compatible with Vercel serverless functions.**

Recommended platforms:
- **Railway** (recommended)
- Render
- Fly.io
- AWS EC2/ECS
- DigitalOcean

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages

## Environment Variables

### Backend Production
```env
NODE_ENV=production
DATABASE_URL=<your-production-database-url>
SERVER_URL=<your-backend-url>
CLIENT_URL=<your-frontend-url>
FRONTEND_URL=<your-frontend-url>
RESERVATION_TIMEOUT_SECONDS=60
```

### Frontend Production
```env
VITE_API_URL=<your-backend-url>
VITE_WS_URL=<your-backend-url>
```

## Architecture

### Race Condition Prevention
The app uses Prisma's `$transaction` with `updateMany` to prevent race conditions when multiple users try to reserve the same item simultaneously.

### Reservation System
- Reservations expire after 60 seconds
- Background cleanup service runs every 10 seconds
- Expired reservations automatically restore stock

### Real-time Updates
- Socket.IO broadcasts stock changes to all connected clients
- Recent purchasers are displayed in real-time
- Stock counter updates immediately
