# TaskFlow Frontend

TaskFlow is a modern project and task management application designed for clarity, speed, and simplicity.  
This repository contains the frontend client built with React, TypeScript, and Vite.

## Features

- User authentication and role-based access control (Owner and User)
- Project creation, editing, and management
- Task tracking with subtasks and progress indicators
- User administration (Owner only)
- Pending user approval workflow (Owner only)
- First-time password reset flow
- Responsive, clean UI built with CSS and utility classes
- API communication via Axios with secure token handling

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand (state management)
- React Router
- Axios
- React Hot Toast
- CSS modules and custom styling

## Project Structure

src/
api/               API request helpers
components/        Reusable UI components
pages/             Application pages
store/             Zustand stores
utils/             Utility functions (JWT decoding, helpers)
App.tsx            Application routes
main.tsx           Entry point

Code

## Environment Variables

Create a `.env` file in the project root:

VITE_API_URL=https://your-backend-url/api

Code

## Running the Project

Install dependencies:

npm install

Code

Start the development server:

npm run dev

Code

Build for production:

npm run build

Code

Preview production build:

npm run preview

Code

## Authentication Flow

- Users log in with email and password.
- If the backend indicates `requiresPasswordReset`, the user is redirected to the first-time password page.
- JWT tokens are decoded client-side to extract userId, email, and role.
- Role-based routing ensures Owner-only pages remain restricted.

## Owner-Only Pages

- Pending Users
- Users List
- User Detail

These routes are protected both in the UI and via backend authorization.

## License

This project is open source and available for review, learning, and extension.
