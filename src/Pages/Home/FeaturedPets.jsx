import React from "react";

const FeaturedPets = () => {
    const featured = [
        { id: 1, name: "Golden Retriever", img: "/pets/dog1.jpg", desc: "Friendly and loyal companion." },
        { id: 2, name: "Siamese Cat", img: "/pets/cat1.jpg", desc: "Elegant cat with striking blue eyes." },
        { id: 3, name: "Parrot", img: "/pets/parrot.jpg", desc: "Colorful and intelligent bird." },
    ];

    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold text-center mb-8">🐾 Featured Pets</h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto px-4">
                {featured.map(pet => (
                    <div key={pet.id} className="card bg-white shadow-md rounded-lg overflow-hidden">
                        <img src={pet.img} alt={pet.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{pet.name}</h3>
                            <p className="text-sm text-gray-600">{pet.desc}</p>
                            <button className="btn btn-sm mt-3 bg-[#865B97] text-white hover:bg-[#EFCD5C]">
                                See More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedPets;
