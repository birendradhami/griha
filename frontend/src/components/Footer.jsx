import React from "react";
import { Link } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { FaFacebookSquare, FaDiscord } from "react-icons/fa";
import GrihaLogo from '../../assets/Griha.png';


const Footer = () => {
  return (
    <footer>
      <div className="mx-auto space-y-8 py-6 border-t-[1.5px] lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 px-10 sm:!pl-[7rem] sm:gap-x-[8rem] md:px-20  pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16">
          <div className=" text-black">
            <Link
              to={"/home"}
              className="flex items-center justify-start cursor-pointer"
            >
              <img src={GrihaLogo} alt='Griha Logo' className="w-[25%] md:w-[35%] text-[35px] mr-2 sm:mr-4">
                
              </img>
              <span className="text-3xl  sm:text-4xl"> Griha</span>
            </Link>
            <p className="mt-6 text-base text-black  w-52">
              Room Finder 101 - Discover a cozy and spacious room for your stay.
            </p>
          </div>

          <div>
            <p className="font-bold uppercase font-oswald text-black">
              Our Profile
            </p>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <RouterLink
                  to="/home#about"
                  className="text-black duration-300 font-heading"
                >
                  About
                </RouterLink>
              </li>

              <li>
                <RouterLink
                  to="/home#testimonials"
                  className="text-black duration-300 font-heading"
                >
                  Testimonials
                </RouterLink>
              </li>

              <li>
                <Link className="text-black duration-300  font-heading"></Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold uppercase font-oswald text-black">
              Helpful Links
            </p>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <Link
                  to={"tel:9810639243"}
                  className="text-black duration-300  font-heading"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to={"/message"}
                  className="text-black duration-300  font-heading"
                >
                  Chat
                </Link>
              </li>

              <li>
                <Link
                  to={"/saved_listing"}
                  className="text-black duration-300  font-heading"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold uppercase font-oswald text-black">
              Contact Us
            </p>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <Link
                  to={"https://facebook.com"}
                  className="text-black flex items-center gap-2 duration-300  font-heading"
                >
                  <i>
                    <FaFacebookSquare />
                  </i>
                  Facebook
                </Link>
              </li>

              <li>
                <Link
                  to={"https://discord.com"}
                  className="text-black flex items-center gap-2 duration-300  font-heading"
                >
                  <i>
                    <FaDiscord />
                  </i>
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className=" text-sm text-center text-black font-heading">
          &copy; 2023. Griha. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
