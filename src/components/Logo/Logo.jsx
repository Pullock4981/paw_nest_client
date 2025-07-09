import React from 'react';
import logoImg from "../../../public/Logo.png"

const Logo = () => {
    return (
        <div className="flex flex-row-reverse items-center gap-2">
            <h1 className="font-bold text-xl lg:block hidden">
                PawsNest
            </h1>
            <img className='h-8'
                src={logoImg} alt="" />
        </div>
    );
};

export default Logo;