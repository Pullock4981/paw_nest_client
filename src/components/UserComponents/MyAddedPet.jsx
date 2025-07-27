import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const MyAddedPet = () => {
    const { user } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await fetch(`http://localhost:5000/pets?email=${user.email}`);
                const data = await res.json();
                setPets(data);
            } catch (err) {
                console.error("Failed to load pets:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchPets();
    }, [user]);

    if (loading) return <div className="text-center mt-6">Loading pets...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">My Added Pets</h2>
            {pets.length === 0 ? (
                <p>You haven't added any pets yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                        <div key={pet._id} className="border p-4 rounded shadow">
                            <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded" />
                            <h3 className="text-lg font-bold mt-2">{pet.name}</h3>
                            <p><strong>Age:</strong> {pet.age}</p>
                            <p><strong>Category:</strong> {pet.category.label}</p>
                            <p><strong>Location:</strong> {pet.location}</p>
                            <p className="text-sm mt-2">{pet.shortDescription}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAddedPet;
