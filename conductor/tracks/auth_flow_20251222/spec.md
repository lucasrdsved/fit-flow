# Specification: User Authentication Flow

## 1. Overview
Implement a secure and user-friendly authentication flow using Supabase Auth. This includes a sign-in page, sign-up page, and handling authentication state across the application.

## 2. User Stories
- As a user, I want to sign up for an account so I can access the platform.
- As a user, I want to sign in to my account so I can view my data.
- As a user, I want to be redirected to the appropriate dashboard (Student or Trainer) upon login.
- As a user, I want to be able to sign out.

## 3. Functional Requirements
- **Sign Up:**
    - Fields: Email, Password, Name, Role (Student/Trainer - initially selectable or invite-only, let's start with selectable for MVP).
    - Validation: Valid email, password strength (min 6 chars).
- **Sign In:**
    - Fields: Email, Password.
    - Error handling: Invalid credentials, user not found.
- **Auth State:**
    - Persist session using Supabase client.
    - Protected routes: Redirect unauthenticated users to login.
    - Public routes: Login, Signup, Landing page.
- **Redirects:**
    - Trainer -> `/trainer/dashboard`
    - Student -> `/student/home`

## 4. Non-Functional Requirements
- **Security:** Use Supabase built-in auth security.
- **Performance:** Fast load times for auth pages.
- **UX:** Clear error messages, loading states.

## 5. Technical Design
- **Frontend:** React with React Hook Form + Zod for validation.
- **Backend:** Supabase Auth.
- **Components:**
    - `LoginForm`
    - `SignUpForm`
    - `AuthLayout`
    - `ProtectedRoute` (update existing)
- **Context:** `AuthContext` (or use Supabase `onAuthStateChange` listener directly/via hook).
