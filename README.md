# 🔥 Sneaker Drop - Limited Edition Real-Time Inventory System

A high-performance, real-time inventory management system for limited edition sneaker drops with atomic reservation handling and WebSocket-powered live updates.

## 🎯 Project Overview

This application simulates a competitive sneaker drop environment where:
- Multiple users compete for limited stock items
- Stock updates happen **instantly** across all browser tabs via WebSocket
- Users can temporarily **reserve** items for 60 seconds
- **Atomic operations** prevent overselling (race condition handling)
- Auto-expiration returns stock to pool if users don't complete purchase

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with Vite
- Material-UI (MUI) for beautiful UI
- Context API for state management
- Socket.IO Client for real-time updates
- Axios for HTTP requests

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- Socket.IO for WebSocket communication
- Swagger for API documentation
- Winston for logging

**Database:**
- PostgreSQL (running in Docker)
- Prisma migrations for schema management

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Docker (for PostgreSQL)
- npm or yarn

### 1. Start PostgreSQL Database

```bash
docker run --name postgres-lite \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=myappdb \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run migrations
npm run migrate:dev -- --name init

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5001`
API Docs: `http://localhost:5001/api-docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📊 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- username (String, Unique)
- email (String, Unique, Nullable)
- createdAt, updatedAt
```

### Drops Table (Sneaker Products)
```sql
- id (UUID, Primary Key)
- name (String)
- description (String, Nullable)
- price (Decimal)
- totalStock (Integer) - Never changes
- availableStock (Integer) - Decreases with reservations
- imageUrl (String, Nullable)
- startTime (DateTime)
- createdAt, updatedAt
```

### Reservations Table
```sql
- id (UUID, Primary Key)
- userId (Foreign Key → users.id)
- dropId (Foreign Key → drops.id)
- expiresAt (DateTime) - createdAt + 60 seconds
- isActive (Boolean)
- createdAt, updatedAt

Indexes: (userId, dropId), (expiresAt), (isActive)
```

### Purchases Table
```sql
- id (UUID, Primary Key)
- userId (Foreign Key → users.id)
- dropId (Foreign Key → drops.id)
- quantity (Integer, Default: 1)
- price (Decimal) - Snapshot at purchase time
- createdAt

Indexes: (dropId, createdAt DESC)
```

## 🔄 Stock Flow & Lifecycle

### Reservation Created
```
availableStock: 100 → 99 (atomic decrement)
Reservation expires in 60 seconds
WebSocket broadcast: STOCK_UPDATE
```

### Reservation Expires (Background Job)
```
availableStock: 99 → 100 (stock returned)
Reservation marked as inactive
WebSocket broadcast: STOCK_UPDATE
```

### Purchase Completed
```
availableStock: 99 (no change - already decremented)
Reservation marked as inactive
Purchase record created
WebSocket broadcast: PURCHASE_COMPLETED
```

## 🔒 Concurrency & Race Condition Handling

### The Problem
```
100 users click "Reserve" simultaneously for the last 1 item
Only 1 should succeed, 99 should get "Out of stock"
```

### The Solution: Atomic Database Operations


**Why This Works:**
- PostgreSQL row-level locking
- `updateMany` with condition is atomic
- Only 1 transaction succeeds when stock = 1
- Transaction isolation prevents dirty reads

## ⏱️ 60-Second Expiration Mechanism

### Implementation: Background Cleanup Job

## 📡 Real-Time WebSocket Events

### Events Emitted by Server


## 🎨 Frontend Features

### Beautiful MUI Design
- Responsive grid layout for drop cards
- Real-time stock progress bars
- Color-coded stock levels (green → yellow → red)
- Loading states on all buttons
- Toast notifications for user feedback

### Key Components

**Dashboard**
- Displays all active drops
- Auto-refreshes every 30 seconds
- Shows user info and active reservations count

**DropCard**
- Product image, name, description
- Live stock count with progress bar
- Top 3 recent purchasers with avatars
- Reserve button with loading state
- 60-second countdown timer for active reservations
- Complete Purchase button

**LoginDialog**
- Simple username entry
- Validates against backend
- Stores user ID in localStorage

### Real-Time Features
- Stock updates across all tabs instantly
- Countdown timer updates every second
- Recent purchasers update in real-time
- Auto-refresh reservations every 5 seconds

## 🔌 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details

### Drops
- `POST /api/drops` - Create new drop
- `GET /api/drops` - Get all drops with top 3 purchasers
- `GET /api/drops/:id` - Get single drop

### Reservations
- `POST /api/reservations` - Create reservation (atomic, rate-limited)
- `GET /api/reservations/my-reservations?userId=:id` - Get user reservations
- `DELETE /api/reservations/:id` - Cancel reservation

### Purchases
- `POST /api/purchases` - Complete purchase (requires active reservation)

### System
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/myappdb
FRONTEND_URL=http://localhost:3000
APP_NAME=Sneaker Drop API
RESERVATION_TIMEOUT_SECONDS=60
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
VITE_WS_URL=http://localhost:5001
```

## 🧪 Testing the Application

### Test Scenario 1: Basic Flow
1. Open `http://localhost:3000`
2. Enter username to login
3. Click "Reserve Now" on any drop
4. Watch stock decrease instantly
5. See 60-second countdown timer
6. Click "Complete Purchase" before timer expires
7. See your username in recent purchasers

### Test Scenario 2: Real-Time Sync
1. Open two browser windows side-by-side
2. Login with different usernames
3. Reserve the same item from one window
4. Watch stock update instantly in both windows
5. Wait for reservation to expire
6. Watch stock return to pool in both windows

### Test Scenario 3: Race Condition
1. Create a drop with `totalStock: 1`
2. Open multiple tabs
3. Click reserve simultaneously
4. Only one should succeed
5. Others get "Out of stock" error

## 🚢 Deployment Recommendations

### Vercel (Frontend + Backend)
```bash
# Frontend
vercel --prod

# Backend in /api directory
# Configure vercel.json for API routes
```

### Neon (PostgreSQL Database)
- Create database at neon.tech
- Copy connection string
- Update DATABASE_URL in environment variables

### Environment Variables in Vercel
```
DATABASE_URL=postgresql://user:pass@neon.tech/db
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

## 📈 Performance Optimizations

- Database indexes on frequently queried fields
- Connection pooling with Prisma
- Rate limiting (10 reservations/min per IP)
- Compression middleware
- Efficient WebSocket broadcasts
- Background job runs every 10s (tunable)

## 🔐 Security Features

- Helmet.js for security headers
- CORS configured for frontend origin
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- Rate limiting on critical endpoints
- UUID instead of sequential IDs

## 📚 Project Structure

```
sneaker-drop-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── docs/
│   │   ├── app.ts
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   ├── theme/
│   │   └── App.jsx
│   └── package.json
└── README.md
```
