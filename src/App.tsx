import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load all pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Trainer pages
const TrainerLayout = lazy(() => import('./components/layout/TrainerLayout').then(module => ({ default: module.TrainerLayout })));
const TrainerDashboard = lazy(() => import('./pages/trainer/Dashboard'));
const TrainerStudents = lazy(() => import('./pages/trainer/Students'));
const TrainerStudentDetails = lazy(() => import('./pages/trainer/StudentDetails'));
const TrainerNewStudent = lazy(() => import('./pages/trainer/NewStudent'));
const TrainerPlans = lazy(() => import('./pages/trainer/Plans'));
const TrainerPlanEditor = lazy(() => import('./pages/trainer/PlanEditor'));

// Student pages
const StudentLayout = lazy(() => import('./components/layout/StudentLayout').then(module => ({ default: module.StudentLayout })));
const StudentHome = lazy(() => import('./pages/student/Home'));
const StudentWorkout = lazy(() => import('./pages/student/Workout'));
const StudentProgress = lazy(() => import('./pages/student/Progress'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Log error for debugging
      console.error('Global error caught:', error, errorInfo);
      // TODO: Send to error tracking service in production
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <LoadingSpinner size="lg" text="Carregando..." />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/auth/login" element={<Login />} />

                  {/* Trainer Routes - Protected */}
                  <Route
                    path="/trainer"
                    element={
                      <ProtectedRoute allowedTypes={['personal']}>
                        <TrainerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<TrainerDashboard />} />
                    <Route path="students" element={<TrainerStudents />} />
                    <Route path="students/:id" element={<TrainerStudentDetails />} />
                    <Route path="students/new" element={<TrainerNewStudent />} />
                    <Route path="plans" element={<TrainerPlans />} />
                    <Route path="plans/new" element={<TrainerPlanEditor />} />
                    <Route path="plans/:id" element={<TrainerPlanEditor />} />
                    <Route path="calendar" element={<TrainerDashboard />} />
                    <Route path="exercises" element={<TrainerDashboard />} />
                    <Route path="settings" element={<TrainerDashboard />} />
                  </Route>

                  {/* Student Routes - Protected */}
                  <Route
                    path="/student"
                    element={
                      <ProtectedRoute allowedTypes={['student']}>
                        <StudentLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<StudentHome />} />
                    <Route path="workout" element={<StudentWorkout />} />
                    <Route path="progress" element={<StudentProgress />} />
                    <Route path="profile" element={<StudentProfile />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
