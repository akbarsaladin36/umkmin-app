import { Navigate, Outlet } from "react-router-dom"
import useAuthStore from "../stores/auth"

const ProtectedRoute = () => {
    const user = useAuthStore((state) => state.user)
    const authChecked = useAuthStore((state) => state.authChecked)

    if(!authChecked) {
        return null
    }

    if(!user) {
        return <Navigate to="/" replace />
    }

    return <Outlet/>
}

export default ProtectedRoute