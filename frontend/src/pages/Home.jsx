import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import SaleListing from "../components/SaleListing";
import RentListing from "../components/RentListing";
import OfferedListing from "../components/OfferedListing";
import { useDispatch } from "react-redux";
import { BsChatHeart, BsSearch } from "react-icons/bs";
import { setSearchTermState } from "../redux/search/searchSlice";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import AddRent from "../components/AddRent";
import AboutSection from "../components/About";
import TestimonialSection from "../components/Testimonials";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const getPlaceNameFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_LOC_API_KEY;
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from OpenCage API: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { county, country } = data.results[0].components;
        return `${county || ""}, ${country || ""}`;
      } else {
        return "Unknown Location";
      }
    } catch (error) {
      console.error("Error getting place name from coordinates:", error);
      return "Unknown Location";
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await getPlaceNameFromCoordinates(
            latitude,
            longitude
          );
          setUserLocation(locationName);
        },
        (error) => {
          console.error("Error getting user location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setUserLocation("Permission denied");
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  };
  useEffect(() => {
    handleGetLocation();
  }, []);

  const location = useLocation();

  useEffect(() => {
    const { pathname, hash } = location;

    if (pathname === "/home" && hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search`);
    setSearchValue("");
  };

  return (
    <>
      {/* Hero Section */}

      <section id="banner" className="relative h-screen 2xl:h-[75vh]">
        <div className="absolute bg-white"></div>

        <div className="relative ">
          <div className=" text-center">
            <h1 className=" text-[36px] sm:text-5xl lg:text-6xl font-bold mx-auto pt-16 sm:pt-28  text-black">
              Room Finder Site
            </h1>

            <div className=" flex flex-col ml-[31%] sm:ml-0 sm:flex-row justify-center gap-4 mt-5 mb-8">
              <div className=" flex items-center gap-2 text-gray-500">
                <i className=" text-gray-500">
                  <FaRegCheckCircle />
                </i>
                Great Homes
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <i className=" text-gray-600">
                  <FaRegCheckCircle />
                </i>
                Affordable Prices
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <i className=" text-gray-500">
                  <FaRegCheckCircle />
                </i>
                Secure
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3  md:col-span-4">
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full max-w-full sm:max-w-sm flex flex-row mx-auto items-center justify-center relative">
                  <input
                    id="search"
                    type="text"
                    placeholder=" Enter your destination"
                    className="search h-12 border-black placeholder:text-black/55"
                    onChange={(e) => {
                      dispatch(setSearchTermState(e.target.value)),
                        setSearchValue(e.target.value);
                    }}
                    value={searchValue}
                    required 
                  />
                  <button type="submit" className="search_btn">
                    <i className="text-center text-black font-bold">
                      <BsSearch />
                    </i>
                  </button>
                </div>
              </form>
            </div>
            <div className="flex justify-center gap-4 mt-11 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <i className="text-2xl text-gray-600">
                  <IoLocationSharp />
                </i>
                Your current location: {userLocation || "Loading..."}
              </div>
            </div>

            {(userLocation === null ||
              userLocation === "Permission denied") && (
              <div style={{ position: "fixed", top: 10, right: 10 }}>
                <button onClick={handleGetLocation}>Get Location</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/*Tab Section */}

      <section>
        <div className="flex items-center justify-center">
          <div className=" rounded w-[90%] max-w-[770px]">
            <div className="flex flex-col md:flex-row gap-4  ">
              <button
                className={`flex-1 ${
                  activeTab === 1 ? "bg-black" : "bg-gray-400"
                } text-white text-xl font-bold py-[0.65rem] px-9 rounded focus:outline-none focus:shadow-outline-blue`}
                onMouseEnter={() => setActiveTab(1)}
                onClick={() => handleTabClick(1)}
              >
                Find Room
              </button>
              <button
                className={`flex-1 ${
                  activeTab === 2 ? "bg-black" : "bg-gray-400"
                } text-white text-xl font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green`}
                onMouseEnter={() => setActiveTab(2)}
                onClick={() => handleTabClick(2)}
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {activeTab === 1 && (
            <div className="w-full">
              <RentListing />
            </div>
          )}
          {activeTab === 2 && (
            <div className="w-full">
              <AddRent />
            </div>
          )}
        </div>
      </section>

      <AboutSection />

      <TestimonialSection />

      <Footer />
    </>
  );
};

export default Home;
