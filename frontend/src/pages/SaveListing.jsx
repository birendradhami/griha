import React from "react";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import WhishlistCard from "../components/WishlistCard";

const SaveListing = () => {
  const { saveListings } = useSelector((state) => state.savedListing);
  const navigate = useNavigate();
  return (
    <>
      <section>
        <div className="container py-7 ">
          <div className="heading_cotainer w-[92%] lg:w-[57%] mx-auto border-b-2 pb-3 border-black flex items-center justify-center sm:justify-between flex-col sm:flex-row">
            <h1 className="text-black font-semibold text-2xl text-left mb-4 sm:mb-0 ">
              Your Wishlist: {saveListings.length} {saveListings.length === 1}
            </h1>
            <button
              className="group relative inline-flex items-center overflow-hidden rounded bg-black px-6 py-3 text-white "
              onClick={() => navigate("/search")}
            >
              

              <span className="text-base font-medium">
                Explore More
              </span>
            </button>
          </div>
          <div className="listings pt-5">
            {saveListings.length === 0 ? (
              <div className="py-20">
                <p className="bg-white text-center text-lg sm:text-2xl font-heading font-bold flex flex-col items-center justify-center max-w-3xl mx-auto py-10 text-black px-5 rounded shadow-md">
                  <span>Empty Wishlist!</span>
                </p>
              </div>
            ) : (
              <div className="w-full lg:w-[73%] mx-auto lg:px-5 gap-y-8 pb-20">
                {saveListings &&
                  saveListings.map((listing) => (
                    <WhishlistCard key={listing._id} listing={listing} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <></>
    </>
  );
};

export default SaveListing;
