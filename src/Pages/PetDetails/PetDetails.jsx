import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Modal from "react-modal";
import Swal from "sweetalert2";

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [pet, setPet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`http://localhost:5000/pets/${id}`);
                const data = await res.json();
                setPet(data);
            } catch (err) {
                console.error("Failed to fetch pet:", err);
            }
        };
        fetchPet();
    }, [id]);

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
            ownerEmail: pet.userEmail, // ✅ Make sure pet.userEmail exists
        };

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/adoptionRequests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adoptionData),
            });

            if (res.ok) {
                Swal.fire("Success", "Adoption request sent!", "success");
                setIsModalOpen(false);
                setPhone("");
                setAddress("");
            } else {
                Swal.fire("Error", "Request failed. Please try again.", "error");
            }
        } catch (error) {
            console.error("Adoption error:", error);
            Swal.fire("Error", "Network or server error.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!pet) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold">{pet.name}</h2>
            <img src={pet.image || "https://via.placeholder.com/300"} alt={pet.name} className="w-full h-64 object-cover rounded mt-2" />
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Category:</strong> {pet.category}</p>
            <p><strong>Location:</strong> {pet.location}</p>
            <p>{pet.description}</p>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
                Adopt
            </button>

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
                <h2 className="text-xl font-bold mb-4">Adopt {pet.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Your Name</label>
                        <input value={user?.displayName} disabled className="block w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Email</label>
                        <input value={user?.email} disabled className="block w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="block w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label>Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="block w-full border p-2 rounded"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default PetDetails;
