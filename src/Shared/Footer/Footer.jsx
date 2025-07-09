import React from 'react';

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-[#865B97] text-white p-6">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by PawsNest</p>
            </aside>
        </footer>
    );
};

export default Footer;