import React from 'react';
import Banner from './Banner';
import PetCategories from './PetCategories';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PetCategories></PetCategories>
            <CallToAction></CallToAction>
            <AboutUs></AboutUs>
            <Testimonials></Testimonials>
            <HowItWorks></HowItWorks>
        </div>
    );
};

export default Home;