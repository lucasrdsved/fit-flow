import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TrainerLayout } from "./components/layout/TrainerLayout";
import { StudentLayout } from "./components/layout/StudentLayout";
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerStudents from "./pages/trainer/Students";
import StudentHome from "./pages/student/Home";
import StudentWorkout from "./pages/student/Workout";
import StudentProgress from "./pages/student/Progress";
import StudentProfile from "./pages/student/Profile";

const queryClient = new QueryClient();

/**
 * The root component of the application.
 *
 * It sets up the following global providers:
 * - `QueryClientProvider`: For managing server state with TanStack Query.
 * - `TooltipProvider`: For managing tooltip state.
 * - `BrowserRouter`: For client-side routing.
 * - `AuthProvider`: For managing authentication state.
 *
 * It defines the application's route structure, including protected routes for trainers and students.
 *
 * @returns {JSX.Element} The rendered application.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
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
                <Route path="plans" element={<TrainerDashboard />} />
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
          </AuthProvider>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
