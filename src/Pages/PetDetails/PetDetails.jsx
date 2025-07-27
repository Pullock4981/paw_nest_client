import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import Modal from 'react-modal';


const PetDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [pet, setPet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`http://localhost:5000/pets/${id}`);
                const data = await res.json();
                setPet(data);
            } catch (err) {
                console.error('Failed to fetch pet:', err);
            }
        };
        fetchPet();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone || !address) return alert('Phone and address are required.');

        const adoptionData = {
            petId: pet._id,
            petName: pet.name,
            petImage: pet.image,
            userName: user?.displayName,
            email: user?.email,
            phone,
            address,
        };

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/adoption-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adoptionData),
            });

            if (res.ok) {
                setSuccess(true);
                setIsModalOpen(false);
            } else {
                alert('Something went wrong!');
            }
        } catch (err) {
            console.error('Adoption error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!pet) return <p>Loading...</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h1>{pet.name}</h1>
            <img src={pet.image} alt={pet.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Category:</strong> {pet.category}</p>
            <p><strong>Location:</strong> {pet.location}</p>
            <p><strong>Description:</strong> {pet.description}</p>

            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Adopt
            </button>

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
                <h2>Adopt {pet.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Pet Name:</label>
                        <input type="text" value={pet.name} disabled />
                    </div>
                    <div>
                        <label>Your Name:</label>
                        <input type="text" value={user?.displayName} disabled />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={user?.email} disabled />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div>
                        <label>Address:</label>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </Modal>

            {success && <p style={{ color: 'green' }}>✅ Adoption request sent!</p>}
        </div>
    );
};

export default PetDetails;
