import React, {FC, useContext} from 'react';
import {TokenContext} from '../../App';
import {Outlet, useLocation} from 'react-router-dom';
import Login from './Login';


interface ProtectedRouteProps {
}

const ProtectedRoute: FC<ProtectedRouteProps> = () => {
    const {token} = useContext(TokenContext);
    const location = useLocation();

    if (!token) {
        return <Login redirectTo={location.pathname}/>;
    }

    return (<Outlet/>);
};

export default ProtectedRoute;