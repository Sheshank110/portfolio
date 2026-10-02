# Developer Portfolio — MERN Stack

A premium, editorial-style personal developer portfolio built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Dark-mode editorial design** with chartreuse accent
- **Fully data-driven** — edit one file to customize everything
- **Contact form** with MongoDB persistence
- **Responsive** across all devices (375px–1440px+)
- **Framer Motion animations** with reduced-motion support
- **Accessible** — semantic HTML, keyboard navigation, ARIA labels
- **SEO ready** — meta tags, Open Graph, Twitter cards
- **Clean architecture** — separated client/server, reusable components

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite, Tailwind CSS v4        |
| Backend  | Node.js, Express                    |
| Database | MongoDB, Mongoose                   |
| Anim.    | Framer Motion                       |
| Routing  | React Router                        |

## Folder Structure

```
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Button, Footer...)
│   │   ├── sections/            # Page sections (Hero, About, Skills...)
│   │   ├── data/portfolio.js    # ← Edit this to customize content
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # API helpers
│   │   ├── pages/               # Home + 404
│   │   └── App.jsx
│   └── index.html
├── server/                      # Express + MongoDB backend
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # Request handlers
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   ├── middleware/               # Error handling
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone <repo-url>
cd my-portfolio-2
```

### 2. Set up the client

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/portfolio
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run in development

**From root folder (Recommended - runs both frontend & backend concurrently):**
```bash
npm run dev
```

**Or run individually:**
```bash
# Frontend only
npm run dev:client
# or: cd client && npm run dev

# Backend only
npm run dev:server
# or: cd server && npm run dev
```

The client runs on `http://localhost:5173` (or next available port) and proxies API requests to the server on port 5000.

## Customization

### Editing Content

All portfolio content lives in a single file:

```
client/src/data/portfolio.js
```

Edit this file to change:
- Personal info (name, role, email)
- Hero section text
- About section
- Skills
- Projects
- Timeline / journey items
- Achievements
- Contact info
- SEO metadata

### Adding Projects

Add a new object to the `projects` array in `portfolio.js`:

```js
{
  id: 5,
  title: 'My New Project',
  description: '...',
  problem: '...',
  solution: '...',
  technologies: ['React', 'Node.js'],
  features: ['Feature 1', 'Feature 2'],
  image: '/projects/my-project.webp',
  github: 'https://github.com/...',
  live: 'https://...',
  featured: false,
}
```

Set `featured: true` to make it the hero project.

### Adding Project Images

Place images in `client/public/projects/` and reference them as `/projects/filename.webp`.

## MongoDB Setup

1. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
2. Create a database user
3. Add your IP to the access list (or use `0.0.0.0/0` for development)
4. Get the connection string and add it to `server/.env` as `MONGO_URI`

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Create a new Web Service on [Render](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGO_URI`
   - `PORT=5000`
   - `CLIENT_URL=https://your-portfolio.vercel.app`

## Environment Variables

### Client (`client/.env`)

| Variable       | Description                    |
|---------------|--------------------------------|
| `VITE_API_URL` | Backend API URL               |

### Server (`server/.env`)

| Variable      | Description                    |
|--------------|--------------------------------|
| `MONGO_URI`  | MongoDB connection string      |
| `PORT`       | Server port (default: 5000)    |
| `CLIENT_URL` | Frontend URL (for CORS)        |

## API Endpoints

| Method | Endpoint       | Description            |
|--------|---------------|------------------------|
| POST   | `/api/contact` | Submit contact message |
| GET    | `/api/health`  | Health check           |

## Production Build

```bash
cd client
npm run build
```

Output goes to `client/dist/`.

## License

MIT
