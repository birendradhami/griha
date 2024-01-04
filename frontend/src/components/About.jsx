import React from 'react';
import { Link } from 'react-router-dom';
import GrihaLogo from '../../assets/Griha.png';

const AboutSection = () => {
  return (
    <section id='about' className="bg-white py-6 sm:py-16 pt-0 sm:pt-24">
      <div className="container mx-auto flex items-center justify-center flex-col sm:flex-row">
        <div className="flex items-center justify-center mb-8 sm:mr-8">
          <Link to="/home" className="flex items-center justify-start">
            {/* Circular container for the room logo and text */}
            <div className="w-[15rem] h-[15rem] rounded-full object-cover sm:mr-11 mx-auto mb-2 shadow-md bg-cover bg-center flex items-center justify-center text-4xl">
              <img src={GrihaLogo} alt='Griha Logo' className="text-black text-8xl">
                
              </img>
              {/* <span className="text-4xl font-bold ml-4">Griha</span> */}
            </div>
          </Link>
        </div>
        <div className="text-black leading-relaxed max-w-lg text-center sm:pl-3 sm:text-start">
          <h2 className="text-4xl font-bold mb-8">About Us</h2>
          <p>
            Welcome to Griha, your ultimate destination for finding the perfect room. We understand
            that finding the right living space is crucial, and Griha is here to simplify that
            process for you.
          </p>
          <p className="mt-4">
            At Griha, we provide a user-friendly platform that connects seekers with their ideal
            rooms. Whether you are a student looking for a cozy space near your university or a
            professional searching for a convenient apartment, Griha has you covered.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
