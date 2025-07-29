import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const PetListing = () => {
    const [pets, setPets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const limit = 9;
    const navigate = useNavigate();

    const fetchPets = useCallback(async () => {
        setLoading(true);
        try {
            let url = `https://pet-adoption-server-wheat.vercel.app/pets?adopted=false&page=${page}&limit=${limit}`;
            if (searchTerm.trim()) url += `&search=${encodeURIComponent(searchTerm.trim())}`;
            if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch pets");
            const data = await response.json();

            setPets(prev => (page === 1 ? data : [...prev, ...data]));
            setHasMore(data.length === limit);

            if (page === 1) {
                const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, selectedCategory]);

    useEffect(() => { fetchPets(); }, [fetchPets]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
                !loading &&
                hasMore
            ) setPage(prev => prev + 1);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    useEffect(() => {
        setPage(1);
        setPets([]);
        fetchPets();
    }, [searchTerm, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
            <h1 className="text-3xl text-[#865B97] font-bold text-center mb-8">🐾 Available Pets for Adoption</h1>

            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name"
                    className="px-4 py-2 border rounded w-64"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border rounded w-64"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet, index) => (
                    <motion.div
                        key={pet._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                    >
                        <img
                            src={pet.image || "https://via.placeholder.com/400x300?text=No+Image"}
                            alt={pet.name}
                            className="h-40 w-full object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">{pet.name}</h2>
                                <p className="text-gray-700"><strong>Age:</strong> {pet.age || "Unknown"}</p>
                                <p className="text-gray-700"><strong>Location:</strong> {pet.location || "Unknown"}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/petDetails/${pet._id}`)}
                                className="bg-[#865B97] text-white px-4 py-2 hover:bg-[#EFCD5C] hover:text-black rounded-lg transition"
                            >
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {loading && (
                <div className="text-center mt-6 text-gray-500">Loading more pets...</div>
            )}

            {!hasMore && !loading && pets.length > 0 && (
                <div className="text-center mt-6 text-gray-500">No more pets to show.</div>
            )}
        </div>
    );
};

export default PetListing;
