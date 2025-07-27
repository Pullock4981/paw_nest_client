import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";


const MyCampaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get("http://localhost:5000/campaigns", {
                    params: { email: user.email },
                });
                setCampaigns(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchCampaigns();
    }, [user]);

    const handlePauseToggle = async (id, paused) => {
        try {
            await axios.patch(`http://localhost:5000/campaigns/${id}`, { paused: !paused });
            setCampaigns(prev =>
                prev.map(c => (c._id === id ? { ...c, paused: !paused } : c))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (id) => {
        navigate(`/userDashboard/editCampaign/${id}`); // ✅ fixed route path
    };

    const handleViewDonators = (donators = []) => {
        const list = donators.length
            ? donators.map(d => `👤 ${d.name} - $${d.amount}`).join("\n")
            : "No donations yet.";
        alert(list);
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">My Donation Campaigns</h2>
            {campaigns.length === 0 ? (
                <div className="text-center text-gray-600">You haven't created any donation campaigns.</div>
            ) : (
                <table className="w-full border rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Pet Name</th>
                            <th className="p-3 text-left">Max Donation</th>
                            <th className="p-3">Progress</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => {
                            const progress =
                                Math.min((campaign.donatedAmount || 0) / campaign.maxDonation, 1) * 100;

                            return (
                                <tr key={campaign._id} className="border-t">
                                    <td className="p-3">{campaign.petName}</td>
                                    <td className="p-3">${campaign.maxDonation}</td>
                                    <td className="p-3 w-1/3">
                                        <div className="w-full bg-gray-300 rounded-full h-4">
                                            <div
                                                className="bg-purple-600 h-4 rounded-full"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-sm text-right mt-1">{progress.toFixed(1)}%</div>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => handlePauseToggle(campaign._id, campaign.paused)}
                                            className={`px-3 py-1 rounded text-white ${campaign.paused ? "bg-yellow-500" : "bg-red-500"}`}
                                        >
                                            {campaign.paused ? "Unpause" : "Pause"}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(campaign._id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleViewDonators(campaign.donators || [])}
                                            className="bg-gray-700 text-white px-3 py-1 rounded"
                                        >
                                            View Donators
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyCampaign;
