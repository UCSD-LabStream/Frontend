import { Outlet, Navigate } from "react-router-dom";
import { useUser } from './UserContext';

const ProfessorRoute = () => {
    const profs = ["professor1@ucsd.edu", "professor2@ucsd.edu", "rsrikanth@ucsd.edu"];
    const { user } = useUser();
    console.log(user.email);
    if (profs.includes(user.email)) {
        return <Outlet />;
    } else{
        return <Navigate to="/"/>
    }

}

export default ProfessorRoute
