import React from 'react';

import errorImg from '../../assets/errorPhoto.jfif'
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <img src={errorImg} alt="Error 404" className='md:w-80' />
            <p className='flex flex-col justify-center items-center gap-5'>
                <span className='md:text-3xl text-2xl font-bold text-red-500'>Page Not Found</span>
                <Link to='/' className='btn bg-amber-400 font-bold'>Back to Home</Link>
            </p>
        </div>
    );
};

export default ErrorPage;