import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

const AdoptionReq = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch adoption requests where ownerEmail === logged-in user's email
    const fetchRequests = async () => {
        if (!user?.email) return;

        try {
            const res = await fetch(
                `http://localhost:5000/adoptionRequests?ownerEmail=${user.email}`
            );
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch adoption requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    // Update status (accept or reject)
    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5000/adoptionRequests/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Refresh requests
            fetchRequests();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) return <p className="p-4">Loading adoption requests...</p>;

    if (!requests.length)
        return <p className="p-4 text-gray-600">No adoption requests found.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Adoption Requests</h2>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Pet</th>
                            <th className="p-2 border">Requester Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Location</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td className="p-2 border flex items-center gap-2">
                                    <img
                                        src={req.petImage}
                                        alt={req.petName}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <span>{req.petName}</span>
                                </td>
                                <td className="p-2 border">{req.userName}</td>
                                <td className="p-2 border">{req.email}</td>
                                <td className="p-2 border">{req.phone}</td>
                                <td className="p-2 border">{req.address}</td>
                                <td className="p-2 border capitalize">{req.status}</td>
                                <td className="p-2 border">
                                    {req.status === "pending" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(req._id, "accepted")}
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(req._id, "rejected")}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdoptionReq;
