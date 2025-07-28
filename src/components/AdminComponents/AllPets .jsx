import React, { useEffect, useState } from 'react';

const AllPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/pets') // Replace with your actual backend route
            .then(res => res.json())
            .then(data => {
                setPets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching pets:', err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this pet?");
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:5000/pets/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPets(prev => prev.filter(pet => pet._id !== id));
            }
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/pets/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adopted: !currentStatus }),
            });
            if (res.ok) {
                setPets(prev =>
                    prev.map(pet =>
                        pet._id === id ? { ...pet, adopted: !currentStatus } : pet
                    )
                );
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleUpdate = (id) => {
        // You can navigate to an edit form if needed
        alert("Redirect to edit form or open modal for pet ID: " + id);
    };

    if (loading) return <div className="p-6">Loading pets...</div>;

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">All Pets</h2>
            <table className="min-w-full border rounded">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Species</th>
                        <th className="p-3 text-left">Owner Email</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map((pet, index) => (
                        <tr key={pet._id} className="border-t">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                                <img src={pet.image} alt="pet" className="w-12 h-12 rounded" />
                            </td>
                            <td className="p-3">{pet.name}</td>
                            <td className="p-3 capitalize">{pet.species}</td>
                            <td className="p-3">{pet.ownerEmail}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-sm ${pet.adopted ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                    {pet.adopted ? 'Adopted' : 'Not Adopted'}
                                </span>
                            </td>
                            <td className="p-3 flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleStatusToggle(pet._id, pet.adopted)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    {pet.adopted ? 'Mark Not Adopted' : 'Mark Adopted'}
                                </button>
                                <button
                                    onClick={() => handleUpdate(pet._id)}
                                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(pet._id)}
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

export default AllPets;
