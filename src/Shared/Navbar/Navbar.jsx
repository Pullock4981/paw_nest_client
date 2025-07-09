
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Link, NavLink } from "react-router";
import Logo from "../../components/Logo/Logo";
import './Navbar.css'


const Navbar = () => {
    const { user, SignOutUser } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = () => {
        SignOutUser()
            .then(() => {
                // Swal.fire({
                //     icon: "success",
                //     title: "Logged out successfully",
                //     showConfirmButton: false,
                //     timer: 1500,
                // });
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    const navLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/petList">Pet Listing</NavLink></li>
            <li><NavLink to="/donationCampain">Donation Campaigns</NavLink></li>
            <li><NavLink to='/donationDetails'>Donation Details</NavLink></li>
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm lg:px-16 px-4">
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
                    <Logo></Logo>
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
                    <div className="relative flex items-center gap-3" ref={dropdownRef}>
                        <img
                            src={user.photoURL}
                            alt="User"
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 bg-base-100 shadow-md rounded w-40 z-50">
                                <ul className="text-sm">
                                    <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-base-200" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link></li>
                                    <li><button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-base-200">Logout</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to='/login'><button className="btn btn-outline bg-[#EFCD5C] hover:bg-[#865B97] hover:text-white btn-sm">Login</button></Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
