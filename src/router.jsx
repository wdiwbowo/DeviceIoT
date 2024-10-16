import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Device from "./pages/Device";
import Rules from "./pages/Rules";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import DeviceType from "./pages/DeviceType";
import Company from "./pages/Company";
import ProtectedRoute from "./components/ProtectedRoute";

//Admin
import DeviceAdmin from "./pages/DeviceAdmin";
import Pengguna from "./pages/Pengguna";
import LaporanPetugas from "./pages/LaporanPetugas";
import ManajemanKonflik from "./pages/ManajemanKonflik";

export const router = createBrowserRouter([
    // { path: '/', element: <ProtectedRoute element={<App />} /> },
    { path: '/device', element: <ProtectedRoute element={<Device />} /> },
    { path: '/rules', element: <ProtectedRoute element={<Rules />} /> },
    { path: '/projects', element: <ProtectedRoute element={<Projects />} /> },
    { path: '/deviceType', element: <ProtectedRoute element={<DeviceType />} /> },
    { path: '/company', element: <ProtectedRoute element={<Company />} /> },
    { path: '/login', element: </> },

//Admin
{ path: '/deviceAdmin', element: <ProtectedRoute element={<DeviceAdmin />} /> },
{ path: '/pengguna', element: <ProtectedRoute element={<Pengguna />} /> },
{ path: '/laporanPetugas', element: <ProtectedRoute element={<LaporanPetugas />} /> },
{ path: '/manajemanKonflik', element: <ProtectedRoute element={<ManajemanKonflik />} /> },
]);
