import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import SkletonLoading from "./SkletonLoading";
import { useNavigate } from "react-router-dom";
import { GrFormNext, GrFormPrevious  } from "react-icons/gr";




const RentListing = () => {
  const [loading, setLoading] = useState(true);
  const [rentListings, setRentlisting] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?type=rent`);
        const json = await res.json();
        if (json.success === false) {
          setLoading(false);
        } else {
          setRentlisting(json);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  const settings = {
    dots: false,
    customPaging: function (i) {
      return (
        <div className="custom-dot" key={i}>
          ●
        </div>
      );
    },
    infinite: true,
    lazyLoad: false,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow to="next" />,
    prevArrow: <SamplePrevArrow to="prev" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  function SamplePrevArrow({ onClick }) {
    return (
      <div
        className="absolute bottom-0 left-[6rem] sm:left-[17.5rem] lg:left-[33.5rem] z-10 p-[10px] p-[0.4rem] sm:p-[0.50rem] bg-black flex items-center justify-center border-2 border-transparent cursor-pointer shadow-lg hover:bg-white/90 
            hover:border-2 hover:border-black rounded-full duration-300 group "
        onClick={onClick}
      >
        <GrFormPrevious className="text-white text-2xl sm:text-3xl group-hover:text-black " />
      </div>
    );
  }
  function SampleNextArrow({ onClick }) {
    return (
      <div
        className="absolute bottom-0 right-[6rem] sm:right-[17.5rem] lg:right-[33.5rem] p-[0.4rem] rounded-full sm:p-[0.50rem] z-10 p-[10px] sm:p-7 bg-black flex items-center justify-center border-2 border-transparent cursor-pointer shadow-lg hover:bg-white/90 duration-300 group hover:border-black"
        onClick={onClick}
      >
        <GrFormNext  className="text-white text-2xl sm:text-3xl group-hover:text-black " />
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl  space-y-8 px-4 py-9 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="content text-center ">
          <h2 className="text-3xl font-bold text-black mb-5">
            Rent a Comfortable Room
          </h2>
          <p className="text-black mx-auto w-[70%] mb-14">
            Discover a cozy and spacious room for your stay. Perfect for singles
            or couples, our rooms provide a relaxing atmosphere with modern
            amenities.
          </p>
        </div>

        <div className="post_container !mt-4">
          {loading ? (
            <SkletonLoading />
          ) : (
            <div className="slider_container">
              <Slider {...settings} className="z-10 relative gap-3">
                {rentListings &&
                  rentListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
              </Slider>
            </div>
          )}
        </div>

        <div className="btn_container flex items-center justify-center">
          <button
            className="group relative inline-flex items-center overflow-hidden rounded bg-black px-7 sm:px-8 py-[10px] sm:py-3 text-white "
            onClick={() => navigate("/search")}
          >
            <span className="text-[1rem] font-medium transition-all">
              Explore More
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RentListing;
