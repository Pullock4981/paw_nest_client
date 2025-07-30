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
import UserDashBoardLayout from '../Layouts/UserDashBoardLayout';
import AddPet from '../components/UserComponents/AddPet';
import MyAddedPet from '../components/UserComponents/MyAddedPet';
import AdoptionReq from '../components/UserComponents/AdoptionReq';
import CreateCampaign from '../components/UserComponents/CreateCampaign';
import MyCampaign from '../components/UserComponents/MyCampaign';
import MyDonation from '../components/UserComponents/MyDonation';
import UserDashboardHome from '../components/UserComponents/UserDashboardHome';
import UpdatePet from '../components/UserComponents/UpdatePet';
import EditCampaign from '../components/UserComponents/EditCampaign';
import AdminDashboardLayout from '../Layouts/AdminDashboardLayout';
import AdminDashboardHome from '../components/AdminComponents/AdminDashboardHome';
import AllUsers from '../components/AdminComponents/AllUsers';
import AllPets from '../components/AdminComponents/AllPets ';
import AllDonations from '../components/AdminComponents/AllDonations';
import ViewDonators from '../components/UserComponents/ViewDonators';
import PrivateRoute from '../Shared/PrivateRoute/PrivateRoute';
import ErrorPage from '../Pages/ErrorPage/ErrorPage';
import AdminRoute from '../Shared/AdminRoute/AdminRoute';

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage></ErrorPage>,
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
                path: "/petDetails/:id",
                element: <PrivateRoute><PetDetails /></PrivateRoute>
            },
            {
                path: "/donationCampain",
                Component: DonationCampaign
            },
            {
                path: "/donationDetails/:id",
                element: <PrivateRoute><DonationDetails></DonationDetails></PrivateRoute>
                
            },
        ]
    },
    {
        path: "/userDashboard",
        element: <PrivateRoute><UserDashBoardLayout></UserDashBoardLayout></PrivateRoute>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            { index: true, Component: UserDashboardHome },
            { path: "addPet", Component: AddPet },
            { path: "myPets", Component: MyAddedPet },
            { path: "adoptionRequests", Component: AdoptionReq },
            { path: "createCampaign", Component: CreateCampaign },
            { path: "editCampaign/:id", Component: EditCampaign },
            { path: "myCampaigns", Component: MyCampaign },
            { path: "viewDonators/:campaignId", Component: ViewDonators },
            { path: "myDonations", Component: MyDonation },
            { path: "updatePet/:id", Component: UpdatePet },
        ]
    },
    {
        path: "/adminDashboard",
        element: <AdminRoute><AdminDashboardLayout></AdminDashboardLayout></AdminRoute>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            { index: true, Component: AdminDashboardHome },
            { path: "allUsers", Component: AllUsers },
            { path: "allPets", Component: AllPets },
            { path: "allDonations", Component: AllDonations },
        ]
    }
]);

export default router;