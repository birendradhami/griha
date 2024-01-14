import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaShareSquare, FaHeart, FaEdit, FaListAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import Contact from "../components/Contact";
import {
  handleLisingRemove,
  handleSave,
} from "../redux/saveListing/saveListingSlice";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const ListingPage = () => {
  const [listings, setListings] = useState({});
  const mainSliderRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [savedListing, setSavedListing] = useState(false);
  const thumbnailSliderRef = useRef(null);
  const {
    area,
    address,
    bath,
    bed,
    description,
    discountPrice,
    furnished,
    offer,
    parking,
    price,
    title,
    type,
    _id,
    userRef,
  } = listings;

  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const { saveListings } = useSelector((state) => state.savedListing);

  const dispatch = useDispatch();

  //   Load Posts

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/posts/${params.id}`);
      const json = await res.json();
      if (json.success === false) {
        toast.error(json.message, {
          autoClose: 2000,
        });
        setLoading(false);
      } else {
        setListings(json);
        setLoading(false);
        if (_id) {
          const isSaved = saveListings.some(
            (saveListing) => saveListing._id === _id
          );
          console.log(isSaved);
          isSaved && setSavedListing(true);
        }
      }
    })();
  }, []);

  // Slider

  // State for selected thumbnail index
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setThumbnailIndex(next),
  };

  const thumbnailSliderSettings = {
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    infinite:true,
    slidesToShow: Math.min(6, listings.imgUrl ? listings.imgUrl.length : 0),
    slidesToScroll: 1,
    beforeChange: (current, next) => mainSliderRef.current.slickGoTo(next),
    responsive: [
      {
        breakpoint: 660, 
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {});
  }, []);

  //   Delete

  const handlePostDelete = async (postId) => {
    try {
      const res = await fetch(`/api/posts/delete/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 2000,
        });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  const handleUrlShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      console.log("success");
      toast.success("URL coppied !", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("URL coppied failed!", {
        autoClose: 2000,
      });
    }
  };

  const handleSaveListing = () => {
    const isSaved = saveListings.some((saveListing) => saveListing._id === _id);
    if (isSaved) {
      const restListings = saveListings.filter(
        (savedListing) => savedListing._id !== _id
      );
      dispatch(handleLisingRemove(restListings));
      setSavedListing(false);
    } else {
      const listingToAdd = listings;
      dispatch(handleSave(listingToAdd));
      setSavedListing(true);
    }
  };

  const styles = `
  .thumbnail-slider .slick-slide{
    width:60px !important;
  }
  .slick-track{
    display:flex;
    justify-content:center;
  }
`;

  return (
    <>
      <style>{styles}</style>
      {loading ? (
        <>
          <Loading />
          <p className="text-black text-center font-heading text-xl">
            Loading
          </p>
        </>
      ) : (
        <div className="w-[87%] flex flex-col md:flex lg:flex-row f relative mt-3 mb-8 mx-auto justify-between">
          <div className="listing_section pb-2 lg:pb-16 w-full lg:w-[70%]  ">
            {listings && (
              <>
                <div className=" flex flex-col items-center">
                  <Slider
                    {...mainSliderSettings}
                    ref={(slider) => (mainSliderRef.current = slider)}
                    className="main-slider w-full lg:w-[670px] h-[50%]"
                  >
                    {listings.imgUrl &&
                      listings.imgUrl.map((listing, index) => (
                        <div
                          key={index}
                          className="fancybox h-[342px] lg:h-[400px] w-[50%] sm:w-full mx-auto z-10"
                        >
                          <img
                            data-fancybox="gallery"
                            className="object-cover w-full h-full"
                            src={listing}
                            alt={`main-image-${index}`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <div className="flex flex-col  mx-auto">
                  <Slider
                    {...thumbnailSliderSettings}
                    ref={(slider) => (thumbnailSliderRef.current = slider)}
                    className="thumbnail-slider "
                  >
                    {listings.imgUrl &&
                      listings.imgUrl.map((listing, index) => (
                        <div
                          key={`thumbnail-${index}`}
                          className={` ${
                            thumbnailIndex === index
                              ? " border-2 border-black"
                              : "border"
                          } !aspect-[1/1] !w-[60px] `}
                          onClick={() => setThumbnailIndex(index)}
                        >
                          <img
                            className="object-cover w-full h-full"
                            src={listing}
                            alt={`thumbnail-${index}`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>
              </>
            )}

            <div className=" lg:w-[95%] lg:pl-[5rem]">
              <div className="w-full lg:w-[95%] sm:flex mt-11 shadow-sm shadow-brand-blue">
                <div className="bg-white md:p-12 p-4 rounded-md  w-full md:w-[60%]">
                  <div className="property_info text-black">
                    <p className="font-heading text-black">
                      <span className="py-2 px-6 bg-brand-blue/40  border-black uppercase">
                        {type}
                      </span>
                    </p>

                    <h1 className="font-heading font-bold mt-5 md:mt-8 text-[19px] sm:text-xl text-black capitalize">
                      {title}
                    </h1>
                    <p className="font-content mt-3 font-medium text-base flex items-center justify-left">
                      <IoLocationSharp className="text-black" />
                      <span className="ml-1 text-sm">{address}</span>
                    </p>

                    <div className="description">
                      <p className=" mt-4 font-bold text-[19px]  sm:text-xl">
                        Description:
                      </p>
                      <p className="font-content mt-1 font-medium text-sm sm:text-sm md:text-md lg:text-base ">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Content Section */}

                <div className=" bg-white  md:px-12 lg:pr-0 py-5 px-6 w-full md:w-[40%]">
                  <div className="flex items-center justify-between">
                    {offer ? (
                      <p className="text-xl font-bold text-black mt-5 ">
                        Rs.{discountPrice}{" "}
                        <s className="text-black font-bold text-sm">
                          NPR.{price}
                        </s>
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-black mt-3">
                        NPR.{price}
                      </p>
                    )}
                  </div>
                  <div
                    className={`text-black  transition-max-h overflow-hidden duration-500 ease-in-out`}
                  >
                    <div className="info_contaier mt-5 max-w-md ">
                      <div className="grid grid-cols-2">
                        <p className="font-semibold text-md lg:text-base ">
                          Bedrooms:
                        </p>
                        <p className="  text-md lg:text-base ">{bed}</p>
                      </div>
                      <div className="grid grid-cols-2 mt-2">
                        <p className="font-semibold text-md lg:text-base ">
                          BathRoom:
                        </p>
                        <p className="  text-md lg:text-base ">{bath}</p>
                      </div>
                      <div className="grid grid-cols-2 mt-2">
                        <p className="font-semibold text-md lg:text-base ">
                          Parking:
                        </p>
                        <p
                          className={` ${
                            parking ? "text-black" : "text-black"
                          }  text-md lg:text-base capitalize`}
                        >
                          {parking ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 mt-2">
                        <p className="font-semibold text-md lg:text-base ">
                          Furnished:
                        </p>
                        <p
                          className={`font-heading ${
                            furnished ? "text-black" : "text-black"
                          }  text-md lg:text-base capitalize`}
                        >
                          {furnished ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 mt-2">
                        <p className="font-semibold text-md lg:text-base ">
                          Area:
                        </p>
                        <p className="  text-md lg:text-base ">
                          {area} <span>sqft</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ToastContainer />
          </div>
          <div className=" w-full  lg:w-[30%]">
            <div className="bg-white lg:p-[2rem] lg:pt-[2px] p-6   sticky top-[7.6rem]  lg:flex justify-center">
              {currentUser && currentUser._id === userRef ? (
                <div className="post_owner sm:mt-16">
                  <div className="btn_container w-11">
                    <button
                      onClick={() => navigate(`/update_post/${params.id}`)}
                      className="flex justify-center relative bg-black text-white w-full px-2 py-3 text-lg font-heading rounded-full"
                    >
                      <FaEdit />
                      <span className="absolute top-2 left-14  text-black font-extrabold">
                         :Edit
                        </span>
                    </button>
                  </div>

                  <div className="contant_btn_container mt-2 w-11">
                    <button
                      onClick={() => handlePostDelete(params.id)}
                      className="flex justify-center relative bg-black text-white w-full px-2 py-3 text-lg font-heading rounded-full"
                    >
                      <AiFillDelete />
                      <span className="absolute top-2 left-14  text-black font-extrabold">
                         :Delete
                        </span>
                    </button>
                  </div>
                  <div className="contant_btn_container mt-2 w-11">
                    <button
                      onClick={() => navigate(`/dashboard`)}
                      className="flex justify-center relative bg-black text-white w-full px-2 py-3 text-lg font-heading rounded-full"
                    >
                      <FaListAlt />
                      <span className="absolute top-2 left-14  text-black font-extrabold">
                         :Posts
                        </span>
                    </button>
                  </div>
                    <div className="btn_container mt-2 w-11 ">
                      <button
                        onClick={handleUrlShare}
                        className="flex justify-center relative text-white w-full bg-black px-2 py-3 text-lg font-heading rounded-full"
                      >
                       
                          <FaShareSquare className="  text-white" />
                          <span className="absolute top-2 left-14  text-black font-extrabold">
                         :Share
                        </span>
                       
                      </button>
                    </div>
                    <div className="contant_btn_container w-11 mt-2">
                      <button
                        onClick={handleSaveListing}
                        className="flex justify-center relative text-white w-full bg-black px-2 py-3 text-lg font-heading rounded-full"
                      ><FaHeart
                            className={`  ${
                              savedListing ? "text-white" : "text-white"
                            } `}
                          />
                        <span className="absolute top-2 left-14  text-black font-extrabold">
                        {savedListing ? ":Saved" : ":Save"}
                        </span>
                      </button>
                    </div>
                </div>
              ) : (
                <div className="visitor_view">
                  <div className="btn_container mt-3">
                    <div className="contant_owner_form mt-5">
                      <Contact listing={listings} loadingState={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 sm:gap-5 gap-2 sm:mt-2">
                    <div className="btn_container ">
                      <button
                        onClick={handleUrlShare}
                        className=" text-white w-full px-2 py-3 text-lg font-heading rounded-sm"
                      >
                        <span className="flex items-center justify-center font-bold text-black">
                          <FaShareSquare className="mr-2 text-2xl" />
                          Share
                        </span>
                      </button>
                    </div>
                    <div className="contant_btn_container">
                      <button
                        onClick={handleSaveListing}
                        className=" text-white w-full px-2 py-3 text-lg rounded-sm"
                      >
                        <span className=" flex items-center justify-center text-black font-bold">
                          <FaHeart
                            className={`mr-2 text-xl  ${
                              savedListing ? "text-black" : "text-gray-400"
                            } `}
                          />
                          {savedListing ? "Saved" : "Save"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingPage;
