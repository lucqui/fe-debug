import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useUserUtility from "./utils/useUserUtility";
import GoalDashboardUser from "./pages/User/GoalDashboard";
import GoalDashboardAdmin from "./pages/Admin/GoalDashboard";

import { Toaster } from "react-hot-toast";
import Review from "./pages/User/Review";
import ReviewResponse from "./pages/User/ReviewResponse";
import CreateReview from "./pages/User/CreateReview";
import Performance from "./pages/User/Performance";
import AdminPerformance from "./pages/Admin/AdminPerformance";
import Project from "./pages/User/Project";
import AdminPay from "./pages/Admin/AdminPay";
import UserPay from "./pages/User/UserPay";
import AdminUserView from "./pages/Admin/AdminUserView";
import AdminReview from "./pages/Admin/AdminReview";
import AdminProject from "./pages/Admin/AdminProject";
import ResetPassword from './pages/ResetPassword';

function App() {
  const userRole = useSelector((state) => state.user.user?.role || 'Guest');
  useUserUtility();

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-view"
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminUserView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/review"
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminReview />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/project"
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminProject />
            </ProtectedRoute>
          }
        />

        <Route
          path={`/${userRole}/dashboard`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/admin/goal`}
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <GoalDashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/goal`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <GoalDashboardUser />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/project`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <Project />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/review`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <Review />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/review/response`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <ReviewResponse />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/review/write`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <CreateReview />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/admin/performance`}
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/performance`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <Performance />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/admin/pay`}
          element={
            <ProtectedRoute userRole={userRole} requiredRoles={["Admin"]}>
              <AdminPay />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/${userRole}/pay`}
          element={
            <ProtectedRoute
              userRole={userRole}
              requiredRoles={["Employee", "Manager"]}
            >
              <UserPay />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
