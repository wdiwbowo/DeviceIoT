import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Device from "./pages/Device";
import Rules from "./pages/Rules";

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/device', element: <Device /> },
    { path: '/rules', element: <Rules /> },
])