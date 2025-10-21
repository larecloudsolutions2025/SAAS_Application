import Signup from "./Signup";
import Home from "./Home";
import Logout from "./Logout";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Profile";
import Syllabus from "./Syllabus";
import FullMockTests from "./FullMockTests";
import TakeTest from "./TakeTest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PreviewResult from "./PreviewResult";
import Instructions from "./Instructions";
import SubjectMockTests from "./SubjectMockTests";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes (only for logged-in users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/syllabus"
          element={
            <ProtectedRoute>
              <Syllabus />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/subject-mocktests" 
          element={
          <ProtectedRoute>
            <SubjectMockTests />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/full-mock-tests"
          element={
            <ProtectedRoute>
              <FullMockTests />
            </ProtectedRoute>
          }
        />
        <Route path="/instructions" element={<Instructions />} />
        <Route
          path="/take-test/"
          element={
            <ProtectedRoute>
              <TakeTest />
            </ProtectedRoute>
          }
        />
        <Route path="/preview-test" element={<PreviewResult />} />
      </Routes>
      
      {/* Toast container (notification styling) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#FB923C", // orange background
            color: "#000",        // black text
            fontWeight: "bold",
          },
        }}
      />
    </BrowserRouter>
  );
}
