import React from "react";
import { Link } from "react-router";

const RecentPets = () => {
    const recent = [
        { id: 1, name: "Bulldog", img: "https://i.ibb.co/cX6Y6S9Q/d2.jpg", desc: "Strong and calm companion." },
        { id: 2, name: "Persian Cat", img: "https://i.ibb.co/sprxBzD2/c3.jpg", desc: "Fluffy and affectionate." },
        { id: 3, name: "Rabbit", img: "https://i.ibb.co/MDkmv8zt/r1.jpg", desc: "Cute and cuddly friend." },
    ];

    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold text-center mb-8">✨ Recently Added Pets</h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto px-4">
                {recent.map(pet => (
                    <div key={pet.id} className="card bg-white shadow-md rounded-lg overflow-hidden">
                        <img src={pet.img} alt={pet.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{pet.name}</h3>
                            <p className="text-sm text-gray-600">{pet.desc}</p>
                            <Link to='/petList'>
                                <button className="btn btn-sm mt-3 bg-[#865B97] text-white hover:bg-[#EFCD5C]">
                                    See More
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentPets;
