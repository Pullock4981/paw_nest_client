import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

const PetListing = () => {
    const [pets, setPets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const limit = 9; // number of pets per page
    const navigate = useNavigate();

    // Fetch pets from server with filters, pagination
    const fetchPets = useCallback(async () => {
        setLoading(true);
        try {
            // Build query params
            let url = `http://localhost:5000/pets?adopted=false&page=${page}&limit=${limit}`;

            if (searchTerm.trim() !== "") {
                url += `&search=${encodeURIComponent(searchTerm.trim())}`;
            }
            if (selectedCategory) {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch pets");

            const data = await response.json();

            // Append new data or replace
            setPets((prev) => (page === 1 ? data : [...prev, ...data]));

            // If less than limit, no more data
            setHasMore(data.length === limit);

            // Extract unique categories from the fetched pets, only strings
            const uniqueCategories = [
                ...new Set(
                    data
                        .map((p) => p.category)
                        .filter((cat) => typeof cat === "string" && cat.trim() !== "")
                ),
            ];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, selectedCategory]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 300 &&
                !loading &&
                hasMore
            ) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    // When searchTerm or category changes, reset page & pets
    useEffect(() => {
        setPage(1);
        setPets([]);
    }, [searchTerm, selectedCategory]);

    return (
        <div style={{ padding: "1rem", maxWidth: "1200px", margin: "auto" }}>
            <h1>Available Pets</h1>

            {/* Search and category filter */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <input
                    type="text"
                    placeholder="Search by pet name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: "1 1 250px",
                        padding: "0.5rem",
                        fontSize: "1rem",
                    }}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: "0.5rem", fontSize: "1rem" }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {typeof cat === "string"
                                ? cat.charAt(0).toUpperCase() + cat.slice(1)
                                : cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pets grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                }}
            >
                {pets.map((pet) => (
                    <div
                        key={pet._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 2px 5px rgb(0 0 0 / 0.1)",
                            display: "flex",
                            flexDirection: "column",
                            background: "#fff",
                        }}
                    >
                        <img
                            src={pet.image || "https://via.placeholder.com/300x200?text=No+Image"}
                            alt={pet.name}
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                        <div style={{ padding: "1rem", flexGrow: 1 }}>
                            <h3 style={{ margin: "0 0 0.5rem 0" }}>{pet.name}</h3>
                            <p style={{ margin: "0.25rem 0" }}>
                                <strong>Age:</strong> {pet.age || "Unknown"}
                            </p>
                            <p style={{ margin: "0.25rem 0" }}>
                                <strong>Location:</strong> {pet.location || "Unknown"}
                            </p>
                        </div>
                        <div style={{ padding: "0 1rem 1rem" }}>
                            <button
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    backgroundColor: "#4caf50",
                                    border: "none",
                                    color: "white",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                }}
                                onClick={() => navigate(`/petDetails/${pet._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p style={{ textAlign: "center", marginTop: "1rem" }}>Loading...</p>}
            {!hasMore && !loading && pets.length > 0 && (
                <p style={{ textAlign: "center", marginTop: "1rem" }}>No more pets to show</p>
            )}
        </div>
    );
};

export default PetListing;
