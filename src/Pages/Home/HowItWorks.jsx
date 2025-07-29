import React from 'react';
import { FaSearch, FaHeart, FaHome } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch className="text-3xl text-[var(--heading-color)]" />,
            title: "Browse Pets",
            desc: "Explore listed pets based on categories and locations.",
        },
        {
            icon: <FaHeart className="text-3xl text-[var(--heading-color)]" />,
            title: "Submit Request",
            desc: "Send a request to adopt a pet you connect with.",
        },
        {
            icon: <FaHome className="text-3xl text-[var(--heading-color)]" />,
            title: "Bring Them Home",
            desc: "Once approved, welcome your new friend home!",
        },
    ];

    return (
        <section className=" py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="md:text-4xl text-3xl font-bold text-[var(--heading-color)] mb-12">How It Works</h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="p-6 rounded-lg border shadow hover:shadow-lg transition">
                            <div className="mb-4 flex justify-center">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
