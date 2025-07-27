import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";


const DonationCampaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const navigate = useNavigate();

    const limit = 6;

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/campaigns");
            const sorted = res.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, (page + 1) * limit);
            setCampaigns(sorted);
            setHasMore(res.data.length > (page + 1) * limit);
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [page]);

    const lastCampaignRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Donation Campaigns</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {campaigns.map((campaign, index) => {
                    const isLast = index === campaigns.length - 1;
                    const donated = campaign.donatedAmount || 0;
                    const max = campaign.maxDonation || 1;
                    const progress = Math.min((donated / max) * 100, 100).toFixed(1);

                    return (
                        <div
                            key={campaign._id}
                            ref={isLast ? lastCampaignRef : null}
                            className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white flex flex-col"
                        >
                            <img
                                src={campaign.petImage || "https://via.placeholder.com/300"}
                                alt={campaign.petName}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">{campaign.petName}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Max Donation:</strong> ${campaign.maxDonation}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                <strong>Donated:</strong> ${donated}
                            </p>
                            <div className="bg-gray-200 h-3 rounded-full mb-2 overflow-hidden">
                                <div
                                    className="bg-purple-600 h-3 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-right text-sm text-gray-500 mb-4">
                                {progress}% funded
                            </p>
                            <button
                                onClick={() => navigate(`/donationCampain/${campaign._id}`)}
                                className="mt-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                            >
                                View Details
                            </button>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="text-center mt-6 text-purple-600 font-semibold">
                    Loading more campaigns...
                </div>
            )}
            {!hasMore && !loading && (
                <div className="text-center mt-6 text-gray-500">
                    You have reached the end.
                </div>
            )}
        </div>
    );
};

export default DonationCampaign;
