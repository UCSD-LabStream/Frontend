import { Outlet, Navigate } from "react-router-dom";
import { useUser } from './UserContext';

const ProtectedRoutes = () => {
    const { user } = useUser();
    return user ? <Outlet/> : <Navigate to="/"/>

}

export default ProtectedRoutes
