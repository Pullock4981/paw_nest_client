import React from 'react';

const AboutUs = () => {
    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-[#865B97] mb-6">
                    About Us
                </h2>
                <p className="text-gray-700 text-lg mb-4">
                    PetConnect was created to bridge the gap between animals in need and loving families ready to adopt.
                    We believe every pet deserves a second chance at life, and every person deserves the joy of companionship.
                </p>
                <p className="text-gray-700 text-lg">
                    Our platform allows individuals to list pets for adoption, while giving adopters the ability to find their perfect companion easily.
                    From submitting adoption requests to tracking campaigns — everything is made simple, safe, and heartfelt.
                </p>
            </div>
        </section>
    );
};

export default AboutUs;
