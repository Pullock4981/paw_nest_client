import React from 'react';

const AdminDashboardHome = () => {
    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold text-[var(--heading-color)]  mb-4">
                Welcome, Admin! 🎉
            </h1>
            <p className="text-lg">
                You have full access to manage users, pets, donations, and more. Use the sidebar or menu to navigate the dashboard.
            </p>
        </div>
    );
};

export default AdminDashboardHome;
