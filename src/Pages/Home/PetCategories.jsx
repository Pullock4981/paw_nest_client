import React from 'react';
import { FaCat, FaDog, FaFish, FaPaw } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import { Link } from 'react-router';

const petCategories = [
    { name: "Cats", icon: <FaCat /> },
    { name: "Dogs", icon: <FaDog /> },
    { name: "Rabbits", icon: <GiRabbit /> },
    { name: "Fish", icon: <FaFish /> },
    { name: "Others", icon: <FaPaw /> },
];

const PetCategories = () => {
    return (
        <section className="bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#865B97] mb-8">
                    Explore Pet Categories
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
                    {petCategories.map((category, index) => (
                        <Link
                            to="/petList"
                            key={index}
                            className="flex flex-col items-center bg-[#f9f9f9] p-5 rounded-lg shadow hover:bg-[#EFCD5C] transition duration-300"
                        >
                            <div className="text-3xl text-[#865B97] mb-2">{category.icon}</div>
                            <span className="font-semibold text-gray-700">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PetCategories;
