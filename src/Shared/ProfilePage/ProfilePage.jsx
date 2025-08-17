import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [extraInfo, setExtraInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetch(`https://pet-adoption-server-wheat.vercel.app/users/${user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    setExtraInfo(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className=" shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                {/* Profile Image */}
                <img
                    src={user?.photoURL || "https://i.ibb.co/2q0j7rY/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                />

                {/* User Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[var(--heading-color)]">{user?.displayName || "Anonymous"}</h2>
                    <p className="text-[var(--heading-color)]">Role: {extraInfo?.role || "User"}</p>

                    <div className="mt-4 space-y-2">
                        <p><span className="font-semibold">📧 Email:</span> {user?.email}</p>
                        <p><span className="font-semibold">📞 Phone:</span> {extraInfo?.phone || "Not provided"}</p>
                        <p><span className="font-semibold">📍 Address:</span> {extraInfo?.address || "Not provided"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
