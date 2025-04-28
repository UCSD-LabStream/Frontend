import { Outlet, Navigate } from "react-router-dom";
import { useUser } from './UserContext';

const HostRoute = () => {
    const hosts = ["rsrikanth@ucsd.edu", "wal009@ucsd.edu", "sabaghda@ucsd.edu", "hlonsdale@ucsd.edu", "prashk135@gmail.com"];
    const { user } = useUser();
    console.log(user.email);
    if (hosts.includes(user.email)) {
        return <Outlet />;
    } else{
        return <Navigate to="/"/>
    }

}

export default HostRoute
