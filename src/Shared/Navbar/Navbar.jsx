import { useContext, useState } from 'react';
import './Navbar.css';
import { AuthContext } from '../../Context/AuthContext';
import { Link, NavLink } from 'react-router';
import Logo from '../../components/Logo/Logo';

const Navbar = () => {
    const { user, SignOutUser, role } = useContext(AuthContext);
    const [theme, setTheme] = useState("light");

    const handleSignOut = () => {
        SignOutUser().catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const navLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/petList">Pet Listing</NavLink></li>
            <li><NavLink to="/donationCampain">Donation Campaigns</NavLink></li>
            {user && (
                <li>
                    <NavLink
                        to={role === "admin" ? "/adminDashboard" : "/userDashboard"}
                    >
                        Dashboard
                    </NavLink>
                </li>
            )}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-lg lg:px-16 px-4 sticky top-0 z-50">
            {/* Left Section */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100 text-base-content">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            {/* Center Section */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold gap-2">
                    {navLinks}
                </ul>
            </div>

            {/* Right Section */}
            <div className="navbar-end gap-3">
                {user ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={user.photoURL}
                            alt="User"
                            className="w-8 h-8 rounded-full border"
                        />
                        <button
                            onClick={handleSignOut}
                            className="btn btn-outline bg-[#865B97] text-white btn-sm"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to='/login'>
                        <button className="btn btn-outline bg-[#EFCD5C] hover:bg-[] hover:text-white btn-sm">
                            Login
                        </button>
                    </Link>
                )}

                {/* 🌙 Theme toggle */}
                <label className="swap swap-rotate ml-3 md:p-2 p-1 rounded-full text-[var(--heading-color)] hover:bg-primary-focus cursor-pointer transition duration-200">
                    <input
                        type="checkbox"
                        onChange={toggleTheme}
                        checked={theme === "dark"}
                    />
                    {/* Sun icon (Light mode) */}
                    <svg
                        className="swap-off w-6 h-6 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64 17.66L4.22 19.07a1 1 0 001.42 1.42l1.41-1.41a1 1 0 10-1.41-1.42zM1 13h2a1 1 0 100-2H1a1 1 0 000 2zm10-9a1 1 0 00-1 1v2a1 1 0 102 0V5a1 1 0 00-1-1zm9 9h2a1 1 0 100-2h-2a1 1 0 100 2zm-2.05-7.36a1 1 0 00-1.42-1.42L17.66 5.64a1 1 0 001.42 1.42l-1.41-1.42zM12 7a5 5 0 100 10 5 5 0 000-10zm0 16a1 1 0 001-1v-2a1 1 0 10-2 0v2a1 1 0 001 1zm5.66-3.66l1.41 1.41a1 1 0 001.42-1.42l-1.41-1.41a1 1 0 00-1.42 1.42z" />
                    </svg>
                    {/* Moon icon (Dark mode) */}
                    <svg
                        className="swap-on w-6 h-6 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-8.14-8.1 8.59 8.59 0 01.25-2 1 1 0 00-1.33-1.13A10.14 10.14 0 1022 14.05a1 1 0 00-.36-1.05z" />
                    </svg>
                </label>
            </div>
        </div>
    );
};

export default Navbar;