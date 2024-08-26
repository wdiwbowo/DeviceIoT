import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem('appToken'); // atau gunakan logika lain untuk memeriksa apakah pengguna sudah login

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
