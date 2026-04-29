import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import CreateProject from "./pages/CreateProject";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Register from "./pages/Register/Register";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import PendingUsersPage from "./pages/PendingUsers";
import FirstTimePasswordPage from "./pages/Login/first-time-password";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UsersPage/UserDetailPage";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage";
import SplashPage from "./pages/SplashPage/SplashPage";
import OwnerRoute from "./components/OwnerRoute/OwnerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/** Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Login/first-time-password" element={<FirstTimePasswordPage />} />

        {/** Protected */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<SplashPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/pending-users" element={<OwnerRoute><PendingUsersPage /></OwnerRoute>} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/users" element={<OwnerRoute><UsersPage /></OwnerRoute>} />
          <Route path="/users/:id" element={<OwnerRoute><UserDetailPage /></OwnerRoute>} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/projects/:id/edit" element={<CreateProject />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
