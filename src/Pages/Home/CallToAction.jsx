import React from 'react';
import { Link } from 'react-router';

const CallToAction = () => {
    return (
        <section className=" py-16 px-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                {/* Image */}
                <div className="w-full lg:w-1/2">
                    <img
                        src="https://i.ibb.co/JFvrpBT6/gp3.webp" // you can change this image link if needed
                        alt="Adopt a pet"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h2 className="md:text-4xl text-3xl font-bold text-[var(--heading-color)] mb-4">
                        Give Them a Second Chance
                    </h2>
                    <p className="mb-6 text-lg">
                        Every pet deserves a loving home. By adopting, you’re giving them a second chance at life and gaining a loyal companion.
                        Join us in changing lives — one paw at a time.
                    </p>
                    <Link to="/petList">
                        <button className="bg-[var(--heading-color)] cursor-pointer text-white px-6 py-3 rounded-md font-semibold hover:bg-[#EFCD5C] hover:text-black transition-colors duration-300">
                            Browse Pets for Adoption
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
