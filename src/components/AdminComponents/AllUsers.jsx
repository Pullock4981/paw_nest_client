import React, { useEffect, useState } from 'react';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("https://pet-adoption-server-wheat.vercel.app/users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Make a user admin
    const handleMakeAdmin = async (email) => {
        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/users/${email}/make-admin`, {
                method: "PATCH",
            });
            if (res.ok) {
                // Update local state
                setUsers(prev =>
                    prev.map(user =>
                        user.email === email ? { ...user, role: "admin" } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error making admin:", error);
        }
    };

    // Optional: Ban a user
    const handleBanUser = async (email) => {
        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/users/${email}/ban`, {
                method: "PATCH",
            });
            if (res.ok) {
                // Optionally remove or mark banned in UI
                setUsers(prev =>
                    prev.map(user =>
                        user.email === email ? { ...user, banned: true } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };

    if (loading) return <div className="p-4">Loading users...</div>;

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">All Registered Users</h2>
            <table className="min-w-full border rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Photo</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id} className="border-t">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                                <img
                                    src={user.photoURL || "https://i.ibb.co/SJ8XPKj/user.png"}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </td>
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3 capitalize">{user.role}</td>
                            <td className="p-3 flex gap-2">
                                {user.role !== "admin" && (
                                    <button
                                        onClick={() => handleMakeAdmin(user.email)}
                                        className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                                    >
                                        Make Admin
                                    </button>
                                )}
                                {!user.banned ? (
                                    <button
                                        onClick={() => handleBanUser(user.email)}
                                        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                                    >
                                        Ban User
                                    </button>
                                ) : (
                                    <span className="text-xs text-red-600 font-semibold">Banned</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllUsers;
