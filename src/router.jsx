import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Device from "./pages/Device";
import Rules from "./pages/Rules";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import DeviceType from "./pages/DeviceType";
import Company from "./pages/Company";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    { path: '/', element: <ProtectedRoute element={<App />} /> },
    { path: '/device', element: <ProtectedRoute element={<Device />} /> },
    { path: '/rules', element: <ProtectedRoute element={<Rules />} /> },
    { path: '/projects', element: <ProtectedRoute element={<Projects />} /> },
    { path: '/deviceType', element: <ProtectedRoute element={<DeviceType />} /> },
    { path: '/company', element: <ProtectedRoute element={<Company />} /> },
    { path: '/login', element: <Login /> },
]);
