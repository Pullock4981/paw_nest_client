// import React from 'react';
// import Banner from './Banner';
// import PetCategories from './PetCategories';
// import CallToAction from './CallToAction';
// import AboutUs from './AboutUs';
// import Testimonials from './Testimonials';
// import HowItWorks from './HowItWorks';
// import FeaturedPets from './FeaturedPets';
// import RecentPets from './RecentPets';
// import AdoptionStories from './AdoptionStories';
// import Newsletter from './Newsletter';
// import Footer from '../../components/Footer/Footer';

import AboutUs from "./AboutUs";
import Banner from "./Banner";
import CallToAction from "./CallToAction";
import FeaturedPets from "./FeaturedPets";
import HowItWorks from "./HowItWorks";
import Newsletter from "./Newsletter";
import PetCategories from "./PetCategories";
import RecentPets from "./RecentPets";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <Banner></Banner>
            {/* Category Highlights */}
            <PetCategories />

            {/* Featured Section */}
            <FeaturedPets />

            {/* Recent Listings */}
            <RecentPets />

            {/* Call To Action */}
            <CallToAction />

            {/* About Section */}
            <AboutUs />

            {/* Success / Adoption Stories */}
            {/* <AdoptionStories /> */}

            {/* Testimonials / Reviews */}
            <Testimonials />

            {/* How It Works */}
            <HowItWorks />

            {/* Newsletter / Updates */}
            <Newsletter />

            {/* Footer */}
            {/* <Footer /> */}
        </div>
    );
};

export default Home;
