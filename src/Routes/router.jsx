import React from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '../Layouts/RootLayout';
import Home from '../Pages/Home/Home';
import LogIn from '../Shared/LogIn/LogIn';
import Register from '../Shared/Register/Register';
import PetListing from '../Pages/PetListing/PetListing';
import PetDetails from '../Pages/PetDetails/PetDetails';
import DonationCampaign from '../Pages/DonationCampaign/DonationCampaign';
import DonationDetails from '../Pages/DonationDetails/DonationDetails';

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/logIn",
                Component: LogIn
            },
            {
                path: "/register",
                Component: Register
            },
            {
                path: "/petList",
                Component: PetListing
            },
            {
                path: "/petDetails",
                Component: PetDetails
            },
            {
                path: "/donationCampain",
                Component: DonationCampaign
            },
            {
                path: "/donationDetails",
                Component: DonationDetails
            },
        ]
    },
]);

export default router;