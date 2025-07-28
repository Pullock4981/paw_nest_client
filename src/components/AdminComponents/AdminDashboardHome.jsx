import React from 'react';

const AdminDashboardHome = () => {
    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold text-[#865B97] mb-4">
                Welcome, Admin! 🎉
            </h1>
            <p className="text-lg text-gray-600">
                You have full access to manage users, pets, donations, and more. Use the sidebar or menu to navigate the dashboard.
            </p>
        </div>
    );
};

export default AdminDashboardHome;
