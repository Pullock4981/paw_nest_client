import React from 'react';
import Slider from "react-slick";

const Testimonials = () => {
    const stories = [
        {
            name: "Emily & Max",
            feedback: "Adopting Max changed my life. He’s my best friend now!",
            image: "https://i.ibb.co/0FB0Kms/dog1.jpg"
        },
        {
            name: "Liam & Bella",
            feedback: "I found Bella through this platform, and I am very happy.",
            image: "https://i.ibb.co/tpftt1Y/cat1.jpg"
        },
        {
            name: "Ava & Coco",
            feedback: "Thanks to this site, Coco has a new home and I have a lifelong friend.",
            image: "https://i.ibb.co/3pHXHQ0/dog2.jpg"
        },
        {
            name: "Noah & Snow",
            feedback: "Snow came into our lives as a rescue and now she’s family.",
            image: "https://i.ibb.co/0jMhbM5/cat2.jpg"
        },
        {
            name: "Olivia & Bunny",
            feedback: "The adoption process was easy and Bunny is perfect!",
            image: "https://i.ibb.co/pKdYJ5d/rabbit1.jpg"
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="md:text-4xl text-3xl font-bold text-[#865B97] mb-10">Happy Tails</h2>

                <Slider {...settings}>
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className="p-4"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-xl h-full flex flex-col items-center">
                                <img
                                    src={story.image}
                                    alt={story.name}
                                    className="w-24 h-24 rounded-full object-cover mb-4"
                                />
                                <h3 className="text-xl font-semibold text-[#865B97]">{story.name}</h3>
                                <p className="text-gray-600 mt-2">{story.feedback}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Testimonials;
