import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const MyDonation = () => {
    const { user } = useContext(AuthContext);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("https://pet-adoption-server-wheat.vercel.app/donations", {
                    params: { email: user.email }
                });
                setDonations(res.data || []);
            } catch (err) {
                console.error("Error fetching donations:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchDonations();
    }, [user]);

    const handleRefund = async (donationId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will remove your donation from the campaign.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, refund it!",
            cancelButtonText: "Cancel"
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`https://pet-adoption-server-wheat.vercel.app/donations/${donationId}`);
                setDonations(prev => prev.filter(d => d._id !== donationId));
                Swal.fire("Refunded!", "Your donation has been removed.", "success");
            } catch (err) {
                console.error("Refund error:", err);
                Swal.fire("Error", "Failed to refund donation.", "error");
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading donations...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4">
            <h2 className="text-2xl text-[var(--heading-color)] font-bold mb-6 text-center">My Donations</h2>
            {donations.length === 0 ? (
                <div className="text-center">You haven't made any donations yet.</div>
            ) : (
                <table className="w-full border rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Pet Image</th>
                            <th className="p-3 text-left">Pet Name</th>
                            <th className="p-3 text-left">Donated Amount</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => (
                            <tr key={donation._id} className="border-t">
                                <td className="p-3">
                                    <img
                                        src={donation.petImage}
                                        alt={donation.petName}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="p-3">{donation.petName}</td>
                                <td className="p-3">${donation.amount.toFixed(2)}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleRefund(donation._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Ask for Refund
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyDonation;
