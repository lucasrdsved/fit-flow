import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PWAInstallPrompt, PWAInstallBanner } from '@/components/PWAInstallPrompt';

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
const TrainerAnalytics = lazy(() => import('./pages/trainer/Analytics'));
const TrainerMessages = lazy(() => import('./pages/trainer/Messages'));

// Student pages
const StudentLayout = lazy(() => import('./components/layout/StudentLayout').then(module => ({ default: module.StudentLayout })));
const StudentHome = lazy(() => import('./pages/student/Home'));
const StudentWorkout = lazy(() => import('./pages/student/Workout'));
const StudentProgress = lazy(() => import('./pages/student/Progress'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));

const queryClient = new QueryClient();

// PWA Service Worker Registration Component
const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered with scope:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (window.confirm('A new version of FitFlow is available. Would you like to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });
    }

    // Handle PWA install prompt for iOS
    const handleIOSInstall = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      if (isIOS && !isInStandaloneMode) {
        // Show iOS install instructions after some user interaction
        const hasShownIOSPrompt = localStorage.getItem('ios-install-prompt-shown');
        if (!hasShownIOSPrompt) {
          setTimeout(() => {
            if (confirm('Install FitFlow on your iOS device:\n\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install\n\nWould you like to see these instructions again?')) {
              localStorage.setItem('ios-install-prompt-shown', 'true');
            }
          }, 10000); // Show after 10 seconds
        }
      }
    };

    handleIOSInstall();

    // Handle online/offline status
    const handleOnline = () => {
      console.log('[App] Back online');
      // Trigger any pending sync operations
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('workout-sync');
        });
      }
    };

    const handleOffline = () => {
      console.log('[App] Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

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
        <div className="dark min-h-screen">
          <ServiceWorkerRegister />
          <PWAInstallBanner />
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
                    <Route path="analytics" element={<TrainerAnalytics />} />
                    <Route path="messages" element={<TrainerMessages />} />
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
          <PWAInstallPrompt />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
