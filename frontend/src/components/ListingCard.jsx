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

const ListingCard = ({ listing }) => {
  const [heart, setHeart] = useState(false);
  const [savedListing, setSavedListing] = useState(false);

  const { saveListings } = useSelector((state) => state.savedListing);
  const { currentUser } = useSelector((state) => state.user);
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

  // useEffect(() => {
  //   if (currentUser) {
  //     const isSaved = saveListings.some(
  //       (saveListing) => saveListing._id === _id
  //     );
  //     if (isSaved) {
  //       setHeart(true);
  //     } else {
  //       setHeart(false);
  //     }
  //   } else {
  //     dispatch(clearSavedListing());
  //   }
  // }, []);

  return (
    <div className="listing_card bg-white mb-5 shadow-lg shadow-black/10  hover:shadow-black/20 rounded-sm w-full hover:shadow-lg group sm:mr-auto sm:ml-0 mx-auto">
      <div className="card-container">
        <div
          className="image_container relative overflow-hidden cursor-pointer"
          onClick={() => navigate(`/listing/${_id}`)}
        >
          <img
            className="max-h-[150px] min-h-[150px] w-full object-cover rounded-t-sm hover:scale-105 duration-300"
            src={imgUrl[0]}
            alt="property image"
          />
          {/* <div className="absolute bottom-2 left-2 bg-gray-500 rounded-sm py-1 px-2 ">
            <p className="text-sm text-white  font-heading uppercase rounded-sm shadow-sm">
              {type}
            </p>
          </div> */}
          {offer && (
            <div className="absolute top-2 right-0 bg-amber-400 py-1 px-2 ">
              <p className="text-xs capitalize text-black font-heading">
                Discount!
              </p>
            </div>
          )}
        </div>

        <div className="card_body text-black group-hover:bg-black/5 duration-500  border-x border-b border-black/20 ">
          <div
            className="content-container p-3 pb-0 cursor-pointer"
            onClick={() => navigate(`/listing/${_id}`)}
          >
            <h2 className="text-lg font-heading truncate duration-300 group-hover:text-black ">
              {title}
            </h2>
            <p className="font-content text-xs font-bold truncate flex items-center justify-start mt-1">
              <IoLocationSharp className="mr-1 text-black" />
              {address}
            </p>
          </div>

          {/* PRICE CONTAINER SECTION  */}
          <div className="listing_footer grid grid-cols-2 align-middle border-t border-brand-blue/40 mt-5 p-3 pb-4">
            <div className="price_container truncate">
              {offer ? (
                <p className="text-base font-content text-black font-bold  flex items-center justify-start truncate">
                  NPR. {discountPrice}{" "}
                  <s className="text-black  text-xs mt-1 ml-1">NPR. {price}</s>{" "}
                </p>
              ) : (
                <p className="text-base font-content text-black font-bold  flex items-center justify-start truncate">
                  NPR. {price}
                </p>
              )}
            </div>
            <div className="footer_btn flex items-center justify-end mr-1">
              <button
                onClick={handleSaveListing}
                className={`text-lg drop-shadow-sm duration-300  ${
                  savedListing ? "text-black" : "text-gray-400"
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

export default ListingCard;
