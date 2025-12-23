# FitCoach Application

A comprehensive fitness tracking application designed for Personal Trainers and Students. This platform facilitates the management of workout plans, progress tracking, and communication between trainers and their clients.

## Features

### For Personal Trainers
- **Dashboard**: Overview of active students and recent activities.
- **Student Management**: Manage student profiles, assign workout plans.
- **Workout Planning**: Create and assign custom workout routines.
- **Progress Monitoring**: Track student progress through charts and logs.

### For Students
- **Workout Access**: View assigned daily workouts.
- **Progress Tracking**: Log completed exercises and view progress history.
- **Profile Management**: Manage personal details and goals.

## Technology Stack

- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context, TanStack Query
- **Authentication & Backend**: Supabase
- **Routing**: React Router DOM
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials (if connecting to a live backend):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Authentication
The application supports two user roles:
- **Personal Trainer**: Access to the trainer dashboard and student management tools.
- **Student**: Access to personal workout plans and progress tracking.

*Note: For development purposes, a mock login feature is available to simulate these roles without a backend connection.*

### Project Structure

- `src/components`: Reusable UI components.
  - `auth`: Authentication related components.
  - `layout`: Layout components for different roles.
  - `ui`: Generic UI components (shadcn/ui).
- `src/contexts`: React Context providers (e.g., AuthContext).
- `src/hooks`: Custom React hooks.
- `src/pages`: Application pages/views.
- `src/lib`: Utility functions.
- `src/integrations`: External service integrations (Supabase).

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## License

This project is proprietary and confidential.
