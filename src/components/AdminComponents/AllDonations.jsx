import React, { useEffect, useState } from 'react';

const AllDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://pet-adoption-server-wheat.vercel.app/campaigns') // Replace with your backend URL
            .then(res => res.json())
            .then(data => {
                setDonations(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching donations:', err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this donation campaign?")) return;

        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/campaigns/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setDonations(prev => prev.filter(d => d._id !== id));
            }
        } catch (err) {
            console.error('Error deleting campaign:', err);
        }
    };

    const handlePauseToggle = async (id, isPaused) => {
        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/campaigns/${id}/pause`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paused: !isPaused }),
            });

            if (res.ok) {
                setDonations(prev =>
                    prev.map(d => d._id === id ? { ...d, paused: !isPaused } : d)
                );
            }
        } catch (err) {
            console.error('Error toggling pause:', err);
        }
    };

    const handleEdit = (id) => {
        // Redirect or open modal — implement as needed
        alert(`Redirecting to edit donation form for ID: ${id}`);
    };

    if (loading) return <div className="p-6">Loading donation campaigns...</div>;

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">All Donation Campaigns</h2>
            <table className="min-w-full border rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Goal</th>
                        <th className="p-3 text-left">Raised</th>
                        <th className="p-3 text-left">Owner</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((donation, index) => (
                        <tr key={donation._id} className="border-t">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                                <img src={donation.image} alt="donation" className="w-14 h-14 rounded object-cover" />
                            </td>
                            <td className="p-3">{donation.petName}</td>
                            <td className="p-3">${donation.maxDonation}</td>
                            <td className="p-3">${donation.donatedAmount || 0}</td>
                            <td className="p-3">{donation.userEmail}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-sm ${donation.paused ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                    {donation.paused ? 'Paused' : 'Active'}
                                </span>
                            </td>
                            <td className="p-3 flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handlePauseToggle(donation._id, donation.paused)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    {donation.paused ? 'Unpause' : 'Pause'}
                                </button>
                                <button
                                    onClick={() => handleEdit(donation._id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(donation._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllDonations;
