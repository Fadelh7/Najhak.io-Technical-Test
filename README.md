# Najhak.io Technical Test - Full Stack Application

## Project Overview
This project is a Full Stack application built as a technical test submission. It consists of a React frontend and a Node.js/Express backend with MongoDB. The application manages client requests, allowing a "manager" to create new requests, view them in a paginated dashboard, and update their statuses.

## Current Setup & Architecture

### Backend (Server)
The backend is built using **Node.js** and **Express.js**, following the **MVC (Model-View-Controller)** pattern:
- **Models** (`server/models`): We use Mongoose schemas to define the shape of our MongoDB data (e.g., `ClientRequest` and `User`).
- **Controllers** (`server/controllers`): This is where the business logic lives. When a route is hit, it calls a controller function (e.g., `getRequests`, `updateRequestStatus`) which interacts with the Model and sends a JSON response.
- **Routes** (`server/routes`): Maps HTTP methods and URLs (e.g., `GET /api/requests`) to the appropriate Controller functions.
- **Pagination**: The `GET /api/requests` endpoint uses backend pagination (`?page=1&limit=10`). 
  - *What does this serve?* Instead of sending thousands of records to the frontend at once, backend pagination only fetches a small chunk of data per query (`.skip().limit()`). This drastically reduces memory consumption on the server, decreases network payload size, and speeds up initial load times for the client, resulting in a much more scalable application.

### Frontend (Client)
The frontend is a single-page application (SPA) built using **React** and initialized with **Vite** (for fast builds and hot module replacement).
- **Routing**: We use `react-router-dom` to handle client-side routing between the `/login` page and the `/dashboard` page. The routes are protected by a simple check against `localStorage`.
- **Components & Layout**: We use functional components and hooks (`useState`, `useEffect`). We utilize standard CSS modules (e.g., `Dashboard.module.css`) to scope our styling locally to each component, preventing CSS clashes.
- **Modals & UI**: We built a custom Modal for adding requests to keep the UI clean and uncluttered, rather than injecting the form directly into the page layout.

## How the Workflow Connects
1. **Frontend Request**: When a user performs an action (e.g., logging in, submitting a form, or clicking "Next Page"), a React function is triggered.
2. **Axios Intermediary**: The frontend uses `Axios` (configured in `api.js`) to send an asynchronous HTTP request (`GET`, `POST`, `PATCH`) over the network to the backend API (`http://localhost:5001/api`).
3. **Backend Processing**: The Express router intercepts this request and forwards it to a Controller. The Controller parses the data (from `req.body` or `req.query`), uses Mongoose to interact with the local MongoDB database, and retrieves or modifies the data.
4. **Response & UI Update**: The backend sends a JSON response back to Axios. The React component awaits this response and uses `setState` to update the UI (e.g., populating the table, closing the modal, or showing an error).

## Limitations of Current Implementation
As per the technical test requirements, this application focuses on simplicity, readability, and clean basic architecture. 
- **No Real Security**: Authentication is mocked using a hardcoded username/password check and a `localStorage` boolean. There is no actual session management, password hashing (bcrypt), or token verification.
- **No Advanced Architecture**: We are not using state management libraries (like Redux or Zustand), microservices, or complex design patterns (like Repository/Service layers).
- **Basic UI/UX**: The styling relies on custom CSS without a comprehensive component library (like Material-UI or Tailwind CSS).

## Scaling to an Advanced Architecture
If this application were intended for a massive production environment requiring advanced architecture, UI/UX, and strict security, here are the steps and additions I would implement:

### 1. Robust Security & Identity Management
- **JWT / OAuth2**: Implement JSON Web Tokens (JWT) for stateless authentication, with short-lived access tokens and HttpOnly secure refresh tokens to prevent XSS attacks. 
- **Bcrypt & Validation**: Hash passwords using bcrypt before saving them to the DB. Use libraries like `Joi` or `Zod` to strictly validate all incoming API payloads.

### 2. Advanced Backend Architecture
- **Clean / Hexagonal Architecture**: Separate the business logic completely from the Express framework. Introduce a **Service Layer** to handle business logic and a **Repository Layer** for database transactions, making the codebase highly testable and database-agnostic.
- **Microservices & Message Brokers**: Break the monolith down. For example, have an `Auth Service` and a `Request Service`. Use RabbitMQ or Apache Kafka for asynchronous communication between them (e.g., sending an email when a request status changes to 'Done').
- **Caching**: Implement **Redis** to cache frequent queries (like the first page of requests) to reduce MongoDB load and speed up read times.

### 3. State-of-the-Art Frontend (UI/UX)
- **Frameworks & State**: Use **Next.js** for server-side rendering (SSR) and improved SEO. Integrate **Zustand** or **Redux Toolkit** for global state management. Use **React Query** for intelligent data fetching, caching, and optimistic UI updates (so status updates feel instant).
- **Design Systems**: Adopt a robust design system like **Tailwind CSS** combined with **Radix UI** or **Shadcn** to build highly accessible, animated, and modern interfaces.
- **Micro-interactions & UX**: Add skeleton loaders instead of generic loading text, subtle framer-motion animations when opening modals or updating rows, and toast notifications (e.g., React Hot Toast) for success/error feedback.

### 4. DevOps & CI/CD
- **Docker & Kubernetes**: Containerize both the Node app and the frontend. Use Kubernetes for orchestration to auto-scale pods based on traffic.
- **Automated Pipelines**: Setup GitHub Actions for Continuous Integration (running Jest unit/integration tests and ESLint on every PR) and Continuous Deployment (auto-deploying to AWS/Vercel).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on default port 27017)

### 1. Database Setup
Ensure MongoDB is running locally. The app connects to `mongodb://localhost:27017/najahak`.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
*(The backend runs on port 5001. A seeder runs automatically on startup to populate a mock user).*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*(The frontend runs via Vite, usually on port 5173).*

### Login Credentials
- **Username:** `admin`
- **Password:** `admin`
