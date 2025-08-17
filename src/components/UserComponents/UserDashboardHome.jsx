import React from 'react';
import ProfilePage from '../../Shared/ProfilePage/ProfilePage';

const UserDashboardHome = () => {
    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold text-[var(--heading-color)]">Welcome to Your Dashboard 🐾</h1>
            <ProfilePage></ProfilePage>
        </div>
    );
};

export default UserDashboardHome;