import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

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
            const res = await axios.get("https://pet-adoption-server-wheat.vercel.app/campaigns");
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
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center text-[#865B97] mb-10"
            >
                Donation Campaigns
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign, index) => {
                    const isLast = index === campaigns.length - 1;
                    const donated = campaign.donatedAmount || 0;
                    const max = campaign.maxDonation || 1;
                    const progress = Math.min((donated / max) * 100, 100).toFixed(1);

                    return (
                        <motion.div
                            key={campaign._id}
                            ref={isLast ? lastCampaignRef : null}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white border rounded-xl shadow-lg hover:shadow-2xl transition-all p-5 flex flex-col"
                        >
                            <img
                                src={campaign.image || "https://via.placeholder.com/300"}
                                alt={campaign.petName}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-1">{campaign.petName}</h3>
                            <p className="text-sm text-gray-600">
                                <strong>Max Donation:</strong> ${campaign.maxDonation}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Donated:</strong> ${donated}
                            </p>

                            <div className="relative w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-700"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-right text-sm text-gray-500 mb-4">
                                {progress}% funded
                            </p>

                            <button
                                onClick={() => navigate(`/donationDetails/${campaign._id}`)}
                                className="bg-[#865B97] text-white px-4 py-2 hover:bg-[#EFCD5C] hover:text-black rounded-lg transition"
                            >
                                View Details
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {loading && (
                <div className="text-center mt-8 text-purple-600 font-medium animate-pulse">
                    Loading more campaigns...
                </div>
            )}

            {!hasMore && !loading && (
                <div className="text-center mt-8 text-gray-500 font-medium">
                    🎉 You've reached the end.
                </div>
            )}
        </div>
    );
};

export default DonationCampaign;
