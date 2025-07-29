import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const DonationDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [recommended, setRecommended] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/campaigns/${id}`).then(res => {
            setCampaign(res.data);
        });

        axios.get('http://localhost:5000/campaigns').then(res => {
            const others = res.data.filter(c => c._id !== id && !c.paused).slice(0, 3);
            setRecommended(others);
        });
    }, [id]);

    const handleDonation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!accountNumber || accountNumber.length < 6) {
            setMessage('Please enter a valid account number');
            setLoading(false);
            return;
        }

        try {
            // You handle "mock payment" or store data on backend
            const response = await axios.post(`http://localhost:5000/campaigns/${id}/donate`, {
                amount: Number(amount),
                accountNumber,
                donorEmail: user?.email,
            });

            setMessage('🎉 Donation successful!');
            setCampaign(prev => ({
                ...prev,
                donatedAmount: (prev.donatedAmount || 0) + Number(amount),
            }));
            setAmount('');
            setAccountNumber('');
            setModalOpen(false);
        } catch (err) {
            setMessage('Error processing donation.');
        }

        setLoading(false);
    };

    if (!campaign) return <p>Loading campaign details...</p>;

    const progress = Math.min((campaign.donatedAmount || 0) / campaign.maxDonation * 100, 100).toFixed(1);
    const isCreator = user?.email === campaign.creatorEmail;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{campaign.petName}'s Donation Campaign</h1>

            <img src={campaign.image} className="w-full h-64 object-cover rounded mb-4" alt="Pet" />

            <p className="mb-2"><strong>Goal:</strong> ${campaign.maxDonation}</p>
            <p className="mb-2"><strong>Donated:</strong> ${campaign.donatedAmount || 0}</p>

            <div className="bg-gray-200 h-4 rounded-full overflow-hidden mb-4">
                <div className="bg-purple-600 h-4" style={{ width: `${progress}%` }}></div>
            </div>

            <p className="mb-4 text-sm text-gray-600">{progress}% funded</p>

            <p className="mb-6">{campaign.longDescription}</p>

            <button
                onClick={() => setModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                disabled={isCreator}
                title={isCreator ? "Campaign creators cannot donate" : ""}
            >
                Donate Now
            </button>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Enter Donation Details</h2>
                        <form onSubmit={handleDonation} className="space-y-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount in USD"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="Account Number"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            {message && <p className="text-red-500">{message}</p>}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    {loading ? 'Processing...' : 'Donate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationDetails;
