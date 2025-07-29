import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const DonationDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/campaigns/${id}`)
            .then(res => setCampaign(res.data))
            .catch(err => toast.error("Failed to load campaign"));
    }, [id]);

    const handleDonation = async () => {
        if (!amount || !accountNumber) {
            toast.error("Please enter amount and account number");
            return;
        }

        if (user?.email === campaign?.userEmail) {
            toast.error("You cannot donate to your own campaign.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/campaigns/${id}/donate`, {
                amount: parseFloat(amount),
                accountNumber,
                donorEmail: user.email
            });

            if (res.status === 200) {
                toast.success("Donation successful!");
                // Update local state to reflect new donated amount
                setCampaign(prev => ({
                    ...prev,
                    donatedAmount: (prev.donatedAmount || 0) + parseFloat(amount)
                }));
                setAmount("");
                setAccountNumber("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Donation failed");
        }
    };

    if (!campaign) return <div>Loading...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-2">{campaign.petName}</h2>
            <img src={campaign.image} alt={campaign.petName} className="w-full h-60 object-cover rounded mb-4" />
            <p><strong>Short Description:</strong> {campaign.shortDescription}</p>
            <p><strong>Goal:</strong> ${campaign.maxDonation}</p>
            <p><strong>Donated:</strong> ${campaign.donatedAmount || 0}</p>
            <p><strong>Deadline:</strong> {new Date(campaign.lastDate).toLocaleDateString()}</p>

            {user?.email === campaign.userEmail ? (
                <p className="mt-4 text-red-600 font-semibold">You cannot donate to your own campaign.</p>
            ) : (
                <div className="mt-4 space-y-2">
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleDonation}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Donate Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default DonationDetails;
