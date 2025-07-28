import React from 'react';
import { FaUserShield, FaPaw, FaHandHoldingHeart, FaHome, FaListAlt } from 'react-icons/fa';
import Logo from '../components/Logo/Logo';
import { NavLink } from 'react-router';

const AdminDashboardLayout = () => {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="text-black border-r w-20 lg:w-72 p-4 lg:px-10 transition-all duration-300">
                <div className="flex flex-col items-center lg:items-start gap-8">
                    {/* Logo */}
                    <Link to="/">
                        <Logo />
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-7 w-full mt-8">
                        <NavLink
                            to="/adminDashboard"
                            className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]"
                            end
                        >
                            <FaHome />
                            <span className="hidden lg:inline">Dashboard Home</span>
                        </NavLink>

                        <NavLink
                            to="/adminDashboard/allUsers"
                            className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]"
                        >
                            <FaUserShield />
                            <span className="hidden lg:inline">Manage Users</span>
                        </NavLink>

                        <NavLink
                            to="/adminDashboard/allPets"
                            className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]"
                        >
                            <FaPaw />
                            <span className="hidden lg:inline">Manage Pets</span>
                        </NavLink>

                        <NavLink
                            to="/adminDashboard/allDonations"
                            className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]"
                        >
                            <FaHandHoldingHeart />
                            <span className="hidden lg:inline">Manage Donations</span>
                        </NavLink>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 bg-base-100">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
