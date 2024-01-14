import React, { useEffect, useState } from "react";
import {
  FaBath,
  FaBed,
  FaChartArea,
  FaBookmark,
  FaLocationArrow,
  FaHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearSavedListing,
  handleLisingRemove,
  handleSave,
} from "../redux/saveListing/saveListingSlice";
import { IoLocationSharp } from "react-icons/io5";

const WhishlistCard = ({ listing }) => {
  const [heart, setHeart] = useState(false);
  const { saveListings } = useSelector((state) => state.savedListing);
  const { currentUser } = useSelector((state) => state.user);
  const [savedListing, setSavedListing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    title,
    address,
    area,
    bath,
    bed,
    discountPrice,
    imgUrl,
    offer,
    price,
    type,
    _id,
  } = listing;

  const handleSaveListing = () => {
    const isSaved = saveListings.some((saveListing) => saveListing._id === _id);
    if (isSaved) {
      const restListings = saveListings.filter(
        (savedListing) => savedListing._id !== _id
      );
      dispatch(handleLisingRemove(restListings));
      setSavedListing(false);
    } else {
      const listingToAdd = listing;
      dispatch(handleSave(listingToAdd));
      setSavedListing(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const isSaved = saveListings.some(
        (saveListing) => saveListing._id === _id
      );
      if (isSaved) {
        setHeart(true);
      } else {
        setHeart(false);
      }
    } else {
      dispatch(clearSavedListing());
    }
  }, []);

  return (
    <div className="listing_card pb-6 p-3 sm:p-6 lg:mx-12 bg-white lg:mx-auto">
      <div className="card-container flex flex-col sm:flex-row w-full duration-500 border-2">
        <div
          className="image_container relative sm:border-r-2 overflow-hidden cursor-pointer w-full sm:w-[30%]"
          onClick={() => navigate(`/listing/${_id}`)}
        >
          <img
            className="max-h-[150px] min-h-[150px] w-full object-cover rounded-t-sm hover:scale-105 duration-300"
            src={imgUrl[0]}
            alt="property image"
          />
          {offer && (
            <div className="absolute top-2 right-0 bg-amber-400 py-1 px-2 ">
              <p className="text-xs capitalize text-black font-heading">
                Discount!
              </p>
            </div>
          )}
        </div>

        <div className="card_body w-full sm:w-[70%] text-black  ">
          <div
            className="content-container p-3 pb-0 cursor-pointer"
            onClick={() => navigate(`/listing/${_id}`)}
          >
            <h2 className="text-lg truncate duration-300 group-hover:text-black ">
              {title}
            </h2>
            <p className="font-content text-xs font-bold truncate flex items-center justify-start mt-1">
              <IoLocationSharp className="mr-1 text-black" />
              {address}
            </p>
          </div>

          {/* PRICE CONTAINER SECTION  */}
          <div className="listing_footer flex justify-between align-middle mt-5 p-3 pb-4">
            <div className="price_container truncate">
              {offer ? (
                <p className="text-base font-content text-black font-bold  flex items-center justify-start truncate">
                  NPR. {discountPrice}{" "} 
                  {/* /<span className=" ml-1 text-[14px]"> Month</span> */}
                  <s className="text-black  text-xs mt-1 ml-1">NPR. {price}</s>{" "}
                </p>
              ) : (
                <p className="text-base font-content text-black font-bold  flex items-center justify-start truncate">
                 {" "} NPR. {price}
                  {/* /<span className=" ml-1 text-[14px]"> Month</span> */}
                </p>
              )}
            </div>
            <div className="footer_btn w-2 mr-5 lg:mr-10">
            <button
                onClick={handleSaveListing}
                className={`text-lg w-1 drop-shadow-sm duration-300  ${
                  savedListing ? "text-black" : "text-black"
                } `}
              >
                <FaHeart className="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhishlistCard;
