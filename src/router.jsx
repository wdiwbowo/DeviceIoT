import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Device from "./pages/Device";
import Rules from "./pages/Rules";
import Login from "./pages/Login";
import Projects from "./pages/Projects";

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/device', element: <Device /> },
    { path: '/rules', element: <Rules /> },
    { path: '/login', element: <Login /> },
    { path: '/projects', element: <Projects /> },
])