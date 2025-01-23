import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";
import Home from "../home/Home";

export default function ProtectedRoutes() {
    const { isAuthenticated, isLoading } = useAuth();
    console.log("🚀 ~ file: protected-routes.tsx:6 ~ ProtectedRoutes ~ isLoading:", isLoading)
    console.log("🚀 ~ file: protected-routes.tsx:6 ~ ProtectedRoutes ~ isAuthenticated:", isAuthenticated)

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const loginStatus = queryParams.get("status");

    if (!isLoading) {
        const loginEndpoint = loginStatus == 'logging' ? '/login?status=logging' : '/login';
        return isAuthenticated ? <Home /> : <Navigate to={loginEndpoint} />;

        //return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
    }
}
