import React from 'react';
import { FaPaw, FaPlusCircle, FaClipboardList, FaHandHoldingHeart, FaDonate, FaHeart } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../components/Logo/Logo';

const UserDashBoardLayout = () => {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className=" text-black border-r w-20 lg:w-72 p-4 lg:px-10 transition-all duration-300">
                <div className="flex flex-col items-center lg:items-start gap-8">
                    {/* Logo */}
                    <Link to="/">
                        <Logo></Logo>
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-7 w-full mt-8">
                        <NavLink to="/userDashboard/addPet" className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]">
                            <FaPlusCircle />
                            <span className="hidden lg:inline">Add a Pet</span>
                        </NavLink>
                        <NavLink to="/userDashboard/myPets" className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]">
                            <FaClipboardList />
                            <span className="hidden lg:inline">My Added Pets</span>
                        </NavLink>
                        <NavLink to="/userDashboard/adoptionRequests" className="flex items-center gap-3 p-2 text-lg font-semibold hover:text-[#865B97]">
                            <FaHeart />
                            <span className="hidden lg:inline">Adoption Request</span>
                        </NavLink>
                        <NavLink to="/userDashboard/createCampaign" className="flex items-center gap-3 p-2 text-lg font-semibold hover:text-[#865B97]">
                            <FaHandHoldingHeart />
                            <span className="hidden lg:inline">Create Campaign</span>
                        </NavLink>
                        <NavLink to="/userDashboard/myCampaigns" className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]">
                            <FaClipboardList />
                            <span className="hidden lg:inline">My Campaigns</span>
                        </NavLink>
                        <NavLink to="/userDashboard/myDonations" className="flex items-center gap-3 text-lg p-2 font-semibold hover:text-[#865B97]">
                            <FaDonate />
                            <span className="hidden lg:inline">My Donations</span>
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

export default UserDashBoardLayout;
