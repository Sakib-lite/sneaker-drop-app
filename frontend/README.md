# Sneaker Drop - Frontend

React frontend for the Limited Edition Sneaker Drop application.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client
- **Notistack** - Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/    # API and WebSocket services
│   ├── store/       # State management
│   ├── theme/       # MUI theme configuration
│   ├── App.jsx      # Main App component
│   └── main.jsx     # Application entry point
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
└── package.json     # Dependencies
```
