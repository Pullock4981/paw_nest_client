import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const Banner = () => {
    return (
        <div>
            {/* Banner Section */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center px-4 md:px-16 py-12 gap-10">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left lg:w-1/2"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold text-[#865B97] mb-6">
                            Find Your Forever Friend 🐾
                        </h1>
                        <p className="text-gray-700 mb-6 text-lg">
                            Join us in giving pets a second chance at life. Adopt, donate, and make a difference today!
                        </p>
                        {/* <a
                            href="/adopt"
                            className="inline-block bg-[#865B97] text-white px-6 py-3 rounded shadow hover:bg-[#EFCD5C] hover:text-black transition"
                        >
                            Explore Pets
                        </a> */}
                        <Link to='/petList'>
                            <button className="inline-block bg-[#865B97] text-white px-6 py-3 rounded shadow hover:bg-[#EFCD5C] hover:text-black transition">
                                Explore Pets
                            </button>
                        
                        </Link>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-1/2"
                    >
                        <img
                            src="https://i.ibb.co/HTJgTNQY/gp1.webp"
                            alt="Adopt Banner"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Banner;