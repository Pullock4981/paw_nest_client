import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const DashboardOverview = () => {
    const { role } = useContext(AuthContext);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("https://pet-adoption-server-wheat.vercel.app/stats")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error("Error fetching stats:", err));
    }, []);

    if (!stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Example colors
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {role === "admin" ? "Admin Dashboard Overview" : "User Dashboard Overview"}
            </h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-xl p-4 text-center">
                    <h2 className="text-lg font-semibold">Total Pets</h2>
                    <p className="text-2xl font-bold text-primary">{stats.totalPets}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-4 text-center">
                    <h2 className="text-lg font-semibold">Adopted Pets</h2>
                    <p className="text-2xl font-bold text-green-600">{stats.adoptedPets}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-4 text-center">
                    <h2 className="text-lg font-semibold">Donations</h2>
                    <p className="text-2xl font-bold text-purple-600">${stats.totalDonations}</p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-4 text-center">
                    <h2 className="text-lg font-semibold">Users</h2>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pie Chart: Pet Status */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Pet Adoption Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Adopted", value: stats.adoptedPets },
                                    { name: "Available", value: stats.totalPets - stats.adoptedPets }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={index} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart: Donations per Campaign */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Donations per Campaign</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.donationsByCampaign}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="campaign" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
