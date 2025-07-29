import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const AdoptionReq = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/adoptionRequests?ownerEmail=${user.email}`);
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

    const handleStatusChange = async (requestId, status, petId) => {
        try {
            if (status === "accepted") {
                const confirm = await Swal.fire({
                    title: "Confirm Adoption",
                    text: "Are you sure you want to accept this request? The pet will be removed.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, accept",
                });

                if (!confirm.isConfirmed) return;

                const res = await fetch(
                    `https://pet-adoption-server-wheat.vercel.app/adoptionRequests/${requestId}/accept`,
                    { method: "DELETE" }
                );

                if (!res.ok) throw new Error("Failed to accept request and remove pet");

                Swal.fire("Adopted!", "The pet has been adopted and removed.", "success");
            } else {
                const res = await fetch(
                    `https://pet-adoption-server-wheat.vercel.app/adoptionRequests/${requestId}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "rejected" }),
                    }
                );

                if (!res.ok) throw new Error("Failed to reject request");
                Swal.fire("Rejected", "The request has been rejected.", "info");
            }

            fetchRequests();
        } catch (err) {
            console.error("Error updating status:", err);
            Swal.fire("Error", "Something went wrong. Try again.", "error");
        }
    };

    if (loading) return <p className="p-4">Loading adoption requests...</p>;

    if (!requests.length)
        return (
            <div className="w-full flex justify-center mt-10">
                <div className="text-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold">No adoption requests found</h2>
                    <p className="text-sm mt-1">You currently have no pending adoption requests.</p>
                </div>
            </div>
        );


    return (
        <div className="p-4 max-w-full">
            <h2 className="text-2xl font-semibold mb-4">Adoption Requests</h2>

            <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full bg-white border border-gray-300 shadow-md rounded-md text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border text-left">Pet</th>
                            <th className="p-3 border text-left">Requester Name</th>
                            <th className="p-3 border text-left">Email</th>
                            <th className="p-3 border text-left">Phone</th>
                            <th className="p-3 border text-left">Location</th>
                            <th className="p-3 border text-left">Status</th>
                            <th className="p-3 border text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr
                                key={req._id}
                                className="hover:bg-purple-50 transition duration-300 ease-in-out"
                            >
                                <td className="p-3 border flex flex-col items-center gap-2">
                                    <img
                                        src={req.petImage}
                                        alt={req.petName}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                    <span>{req.petName}</span>
                                </td>
                                <td className="p-3 border">{req.userName}</td>
                                <td className="p-3 border">{req.email}</td>
                                <td className="p-3 border">{req.phone}</td>
                                <td className="p-3 border">{req.address}</td>
                                <td className="p-3 border capitalize">{req.status}</td>
                                <td className="p-3 border">
                                    {req.status === "pending" ? (
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(req._id, "accepted", req.petId)
                                                }
                                                className="bg-green-500 hover:bg-green-600 transition px-3 py-1 text-white rounded"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(req._id, "rejected", req.petId)
                                                }
                                                className="bg-red-500 hover:bg-red-600 transition px-3 py-1 text-white rounded"
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
