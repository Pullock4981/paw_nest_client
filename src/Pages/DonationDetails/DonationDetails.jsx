import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const DonationDetails = () => {
    const { id } = useParams(); // Assuming you use /donationDetails/:id
    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [recommended, setRecommended] = useState([]);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        axios.get(`http://localhost:5000/campaigns/${id}`).then(res => {
            setCampaign(res.data);
        });

        // Load other campaigns
        axios.get('http://localhost:5000/campaigns').then(res => {
            const others = res.data.filter(c => c._id !== id && !c.paused).slice(0, 3);
            setRecommended(others);
        });
    }, [id]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
                amount: Number(amount),
            });

            const clientSecret = data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                setMessage('🎉 Donation successful!');
                setAmount('');
                setModalOpen(false);
            }
        } catch (err) {
            setMessage('Error processing payment.');
        }

        setLoading(false);
    };

    if (!campaign) return <p>Loading campaign details...</p>;

    const progress = Math.min((campaign.donatedAmount || 0) / campaign.maxDonation * 100, 100).toFixed(1);

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
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
                Donate Now
            </button>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Enter Donation Details</h2>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount in USD"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <div className="border p-3 rounded">
                                <CardElement
                                    options={{
                                        style: { base: { fontSize: '16px' } },
                                        hidePostalCode: true // 👈 hides ZIP
                                    }}
                                />
                            </div>
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
                                    disabled={!stripe || loading}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    {loading ? 'Processing...' : 'Donate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Recommended Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Recommended Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommended.map(c => (
                        <div key={c._id} className="border rounded p-4 shadow">
                            <img src={c.petImage} className="h-40 w-full object-cover rounded mb-2" />
                            <h3 className="text-lg font-bold">{c.petName}</h3>
                            <p className="text-sm text-gray-600 mb-2">${c.maxDonation}</p>
                            <button
                                className="text-purple-600 underline"
                                onClick={() => window.location.href = `/donationCampain/${c._id}`}
                            >
                                View Campaign
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;
