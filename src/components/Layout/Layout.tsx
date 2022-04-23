import React, {FC, ReactNode} from 'react';
import MyNavbar from '../MyNavbar/MyNavbar';


interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => (
    <div className="d-flex flex-column min-vh-100">
        <MyNavbar/>
        <>{children}</>
    </div>
);

export default Layout;