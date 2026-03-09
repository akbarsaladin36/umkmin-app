import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";

const RoleRoute = ({ allowedRoles }) => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(Number(user?.role_id))) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
