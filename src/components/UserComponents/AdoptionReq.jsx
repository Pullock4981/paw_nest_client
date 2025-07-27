import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

const AdoptionReq = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`http://localhost:5000/adoption-requests?ownerEmail=${user.email}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch adoption requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchRequests();
        }
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/adoption-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchRequests(); // Refresh list after status update
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating request status", err);
        }
    };

    if (loading) return <p>Loading requests...</p>;
    if (requests.length === 0) return <p>No adoption requests found.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Adoption Requests</h2>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Pet</th>
                            <th className="p-2 border">Requester</th>
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
                                    <img src={req.petImage} alt="pet" className="w-12 h-12 rounded object-cover" />
                                    {req.petName}
                                </td>
                                <td className="p-2 border">{req.userName}</td>
                                <td className="p-2 border">{req.email}</td>
                                <td className="p-2 border">{req.phone}</td>
                                <td className="p-2 border">{req.address}</td>
                                <td className="p-2 border capitalize">{req.status}</td>
                                <td className="p-2 border space-x-2">
                                    {req.status === "pending" && (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleStatusUpdate(req._id, "accepted")}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleStatusUpdate(req._id, "rejected")}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {req.status !== "pending" && <span className="text-gray-500">—</span>}
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
