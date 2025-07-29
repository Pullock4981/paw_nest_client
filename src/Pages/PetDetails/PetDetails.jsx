import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [pet, setPet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/pets/${id}`);
                const data = await res.json();
                setPet(data);

                if (user?.email && data?._id) {
                    const reqRes = await fetch(
                        `https://pet-adoption-server-wheat.vercel.app/adoptionRequests/check?petId=${data._id}&email=${user.email}`
                    );
                    const reqData = await reqRes.json();
                    setHasRequested(reqData.exists);
                }
            } catch (err) {
                console.error("Failed to fetch pet:", err);
            }
        };

        fetchPet();
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone || !address) {
            Swal.fire("Error", "Phone and address are required.", "error");
            return;
        }

        const confirm = await Swal.fire({
            title: `Adopt ${pet.name}?`,
            text: "Do you want to send this request?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
        });

        if (!confirm.isConfirmed) return;

        const adoptionData = {
            petId: pet._id,
            petName: pet.name,
            petImage: pet.image,
            userName: user?.displayName,
            email: user?.email,
            phone,
            address,
            ownerEmail: pet.userEmail,
        };

        setLoading(true);
        try {
            const res = await fetch("https://pet-adoption-server-wheat.vercel.app/adoptionRequests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adoptionData),
            });

            if (res.ok) {
                Swal.fire("Success", "Adoption request sent!", "success");
                setIsModalOpen(false);
                setPhone("");
                setAddress("");
                setHasRequested(true);
            } else {
                Swal.fire("Error", "Request failed. Try again.", "error");
            }
        } catch (err) {
            console.error("Adoption error:", err);
            Swal.fire("Error", "Network error.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!pet) return <div className="text-center py-8">Loading...</div>;

    const isOwner = pet.userEmail === user?.email;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto p-6 sm:p-8"
        >
            <h2 className="text-3xl font-bold mb-4 text-center">{pet.name}</h2>

            <img
                src={pet.image || "https://via.placeholder.com/400x300"}
                alt={pet.name}
                className="w-full h-72 sm:h-96 object-cover rounded-lg shadow-md mb-6"
            />

            <div className="space-y-2 ">
                <p><strong>Age:</strong> {pet.age}</p>
                <p><strong>Category:</strong> {pet.category}</p>
                <p><strong>Location:</strong> {pet.location}</p>
                <p><strong>Description:</strong> {pet.description}</p>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50 transition"
                    disabled={isOwner || hasRequested}
                >
                    {isOwner ? "You own this pet" : hasRequested ? "Already Requested" : "Adopt"}
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="max-w-lg w-[90%] border mx-auto mt-12 p-6 rounded-lg shadow-xl shadow-amber-200 outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start overflow-y-auto"
                ariaHideApp={false}
            >
                <h2 className="text-xl font-bold mb-4">Adopt {pet.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Your Name</label>
                        <input value={user?.displayName} disabled className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input value={user?.email} disabled className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#865B97] hover:bg-[#EFCD5C] text-white hover:text-black font-semibold px-4 py-2 rounded transition"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default PetDetails;
