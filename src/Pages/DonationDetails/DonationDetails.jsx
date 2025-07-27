import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const DonationDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [donateModalOpen, setDonateModalOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/campaigns/${id}`);
                setCampaign(res.data);

                // Fetch other campaigns and show 3 excluding current
                const allRes = await axios.get("http://localhost:5000/campaigns");
                const filtered = allRes.data
                    .filter((c) => c._id !== id && !c.paused)
                    .slice(0, 3);
                setRecommended(filtered);
            } catch (err) {
                console.error("Error fetching campaign:", err);
            }
        };

        fetchDetails();
    }, [id]);

    const handleDonateSubmit = () => {
        if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        alert(`Pretending to donate $${donationAmount}...`);
        setDonateModalOpen(false);
        setDonationAmount("");
    };

    if (!campaign) return <div className="text-center mt-10">Loading donation details...</div>;

    const donated = campaign.donatedAmount || 0;
    const progress = Math.min((donated / campaign.maxDonation) * 100, 100).toFixed(1);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-4 text-center">{campaign.petName}</h1>
            <img
                src={campaign.petImage || "https://via.placeholder.com/500"}
                alt={campaign.petName}
                className="w-full h-96 object-cover rounded mb-6"
            />
            <p className="text-gray-700 mb-4">
                <strong>Max Donation:</strong> ${campaign.maxDonation}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Donated So Far:</strong> ${donated}
            </p>

            <div className="bg-gray-200 h-4 rounded-full mb-4">
                <div
                    className="bg-purple-600 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sm text-right text-gray-500 mb-6">{progress}% funded</p>

            <div className="text-center">
                <button
                    onClick={() => setDonateModalOpen(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                >
                    Donate Now
                </button>
            </div>

            {/* Donation Modal */}
            {donateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4 text-center">Make a Donation</h2>
                        <label className="block mb-2 text-sm">Donation Amount ($)</label>
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <div className="bg-gray-100 p-4 rounded text-sm text-gray-500 mb-4 text-center">
                            Stripe Payment Element will go here
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDonateModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDonateSubmit}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Submit Donation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommended Campaigns */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recommended Campaigns</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recommended.map((rec) => {
                        const recProgress = Math.min((rec.donatedAmount || 0) / rec.maxDonation, 1) * 100;

                        return (
                            <div
                                key={rec._id}
                                className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white flex flex-col"
                            >
                                <img
                                    src={rec.petImage || "https://via.placeholder.com/300"}
                                    alt={rec.petName}
                                    className="w-full h-40 object-cover rounded mb-3"
                                />
                                <h3 className="text-lg font-semibold mb-1">{rec.petName}</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    Max: ${rec.maxDonation}
                                </p>
                                <div className="bg-gray-200 h-3 rounded-full mb-2 overflow-hidden">
                                    <div
                                        className="bg-purple-600 h-3 rounded-full"
                                        style={{ width: `${recProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-sm text-gray-500 mb-3">
                                    {recProgress.toFixed(1)}% funded
                                </p>
                                <button
                                    onClick={() => window.location.href = `/donationDetails/${rec._id}`}
                                    className="mt-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    View Details
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;
