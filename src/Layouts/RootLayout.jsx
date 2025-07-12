import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Shared/Navbar/NAvbar';
import Footer from '../Shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-[calc(100vh-130px)]">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;