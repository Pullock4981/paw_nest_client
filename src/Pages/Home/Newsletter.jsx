import React from "react";

const Newsletter = () => {
    return (
        <section className="py-12 text-white">
            <div className="max-w-3xl mx-auto text-center px-4">
                <h2 className="text-2xl font-bold mb-4">📩 Subscribe to Our Newsletter</h2>
                <p className="mb-6">Stay updated with new pets, adoption events, and donation campaigns.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="input input-bordered w-full sm:w-2/3 text-black"
                    />
                    <button className="btn bg-[#EFCD5C] hover:bg-[#fff] hover:text-[#865B97]">
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
