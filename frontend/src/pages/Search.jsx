import React, { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSearch,
} from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import SearchCard from "../components/SearchCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTermState } from "../redux/search/searchSlice";
import Footer from "../components/Footer";
import { LuSearchX } from "react-icons/lu";
import _debounce from "lodash/debounce";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Search = () => {
  const [listings, setListings] = useState([]);
  const { searchTermState } = useSelector((state) => state.search);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const scrollRef = useRef();
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("latest");
  const dispatch = useDispatch();

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
  ];

  const [formState, setFormState] = useState({
    searchTerm: "",
    parking: false,
    type: "all",
    furnished: false,
    offer: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTermState(""));
    setFormState({
      searchTerm: "",
      parking: false,
      type: "all",
      furnished: false,
      offer: false,
    });
    setPriceRange([0, 50000]);
    setSortOption("latest");

    fetchListings("", "all", false, false, false, 0, 50000, 1, "latest");
  };

  const fetchListings = useRef(
    _debounce(
      async (
        searchTerm,
        type,
        parking,
        furnished,
        offer,
        minPrice,
        maxPrice,
        page,
        sort
      ) => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/posts?searchTerm=${searchTerm}&type=${type}&parking=${parking}&furnished=${furnished}&offer=${offer}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&sort=${sort}&approved=true`
          );
          const json = await res.json();
          if (json.success === false) {
            setLoading(false);
          } else {
            setListings(json);
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      },
      300
    )
  ).current;

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
    fetchListings(
      searchTermState,
      formState.type,
      formState.parking,
      formState.furnished,
      formState.offer,
      priceRange[0],
      priceRange[1],
      pageCount,
      selectedOption.value
    );
  };

  useEffect(() => {
    fetchListings(
      searchTermState,
      formState.type,
      formState.parking,
      formState.furnished,
      formState.offer,
      priceRange[0],
      priceRange[1],
      pageCount,
      sortOption
    );
  }, [searchTermState, formState, priceRange, pageCount, sortOption]);

  const handleChange = (name, value) => {
    if (
      name === "type" ||
      name === "parking" ||
      name === "furnished" ||
      name === "offer"
    ) {
      setPageCount(1);
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  useEffect(() => {
    document.body.scrollTo(0, 0);
  }, []);

  const styles = `
  .rc-slider-handle{
    height: 15px !important;
    width: 15px !important;
    opacity: 1;
  }

  .rc-slider-handle.rc-slider-handle-dragging {
     box-shadow: none !important;
}

`;

  return (
    <>
      <style>{styles}</style>
      <section>
        <div ref={scrollRef}>
          <div className=" sm:w-[90%] mx-auto flex flex-col sm:flex-row lg:max-h-full lg:min-h-screen">
            <div className=" w-[80%] mx-auto sm:w-[42%] lg:w-[30%] sm:mt-0  lg:mt-1 bg-white lg:max-h-full lg:min-h-screen  ">
              <div className="items_cotainer  sm:pt-0  lg:pt-3 p-3 sm:p-5 py-8 sticky sm:top-[6.5rem] lg:top-32">
                <form onSubmit={handleSubmit}>
                  <div className="form-control w-full max-w-full   sm:max-w-full relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="search placeholder:text-base !max-w-full text-base sm:max-w-full border-black/55 placeholder:text-black/55"
                      onChange={(e) =>
                        dispatch(setSearchTermState(e.target.value))
                      }
                      value={searchTermState}
                    />
                    <button
                      type="submit"
                      className="search_btn right-0 bg-black"
                    >
                      <i className="text-center text-white font-bold">
                        <BsSearch />
                      </i>
                    </button>
                  </div>
                  <div className=" mt-4 sm:w-full">
                    <p className="text-lg text-black/80 font-semibold">
                      Price Range:
                    </p>
                    <Slider
                      min={0}
                      max={50000}
                      step={10}
                      value={priceRange[1]}
                      onChange={(value) =>
                        setPriceRange([priceRange[0], value])
                      }
                      handleStyle={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#000",
                        border: "1px solid #fff",
                        borderRadius: "50%",
                        marginTop: "-6px",
                      }}
                      trackStyle={{ background: "#000" }}
                      railStyle={{ background: "gray", opacity: "0.8" }}
                    />
                    <div className="flex justify-between text-black">
                      <span>NPR. {priceRange[0]}</span>
                      <span>NPR. {priceRange[1]}</span>
                    </div>
                  </div>

                  <div className="feilds_cotainer mt-4">
                    <div className="feilds max-w-xs">
                      <div className="aminities_container mt-4">
                        <p className="text-lg text-black font-semibold">
                          Amenities:
                        </p>
                        <div className="control flex flex-row md:flex-col items-center md:items-start xl:flex-row xl:items-center justify-start mt-1">
                          <div className="mr-5">
                            <label className="flex items-center justify-start text-base font-semibold text-black/70">
                              <input
                                className="h-4 w-4 mr-1 accent-brand-blue"
                                type="checkbox"
                                name="parking"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.checked)
                                }
                                checked={formState.parking}
                              />
                              Parking
                            </label>
                          </div>
                          <div>
                            <label className="flex items-center justify-start text-base font-semibold text-black/70">
                              <input
                                className="h-4 w-4 mr-1 accent-brand-blue"
                                type="checkbox"
                                name="furnished"
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.checked)
                                }
                                checked={formState.furnished}
                              />
                              Furnished
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="offer_container mt-3 ">
                        <div>
                          <label className="flex items-center justify-start text-base font-semibold text-black/70">
                            <input
                              className="h-4 w-4 mr-1  accent-black"
                              type="checkbox"
                              name="offer"
                              checked={formState.offer}
                              onChange={(e) =>
                                handleChange(e.target.name, e.target.checked)
                              }
                            />
                            Available Offer
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-7">
                      <span className="flex items-center text-xl font-semibold text-black">
                        Sort <MdOutlineSort className="ml-2" />
                      </span>
                      <div className="select-container ml-4 w-60">
                        <Select
                          options={sortOptions}
                          value={sortOptions.find(
                            (option) => option.value === sortOption
                          )}
                          onChange={handleSortChange}
                          isSearchable={false}
                          theme={(theme) => ({
                            ...theme,
                            borderradius: 0,
                            colors: {
                            ...theme.colors,
                              text: '#fff',
                              font:'#3599b8',
                              primary25: '#3599b8',
                              primary: 'black',
                              neutral80: 'black',
                              color: 'black',
                            },
                          })}
                         
                        />
                      </div>
                    </div>

                    <div className="btn_cotainer w-full">
                      <button
                        className="w-full mt-5 py-2 px-2 bg-black text-white rounded-sm hover:bg-black/90"
                        type="submit"
                      >
                        <span className="flex items-center justify-center font-heading text-lg">
                          <FaSearch className="mr-1" />
                          Clear Search
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full mx-auto sm:w-[50%] lg:w-[70%] lg:ml-7 md:col-span-9 pb-10 lg:pt-2">
              {loading ? (
                <div className="loading_container mt-40 flex items-center justify-center flex-col">
                  <FaSearch className="font-xl text-black font-bold text-2xl text-center" />
                  <p className="font-heading text-xl text-center text-black ">
                    Searching
                  </p>
                </div>
              ) : (
                <div>
                  {listings.length !== 0 ? (
                    <>
                      <div className=" px-5 gap-y-8">
                        {listings &&
                          listings.map((listing) => (
                            <SearchCard key={listing._id} listing={listing} />
                          ))}
                      </div>
                      <div className="pageination_part mt-8 md:mt-14 w-full flex items-center justify-center">
                        <div className="join">
                          {/* prev Btn  */}
                          <button
                            onClick={() => setPageCount(pageCount - 1)}
                            disabled={pageCount <= 1 || loading}
                            className="join-item btn bg-brand-blue text-white hover:bg-brand-blue/90 
                                                    disabled:bg-[#d5d5d5] disabled:text-[#a0a0a0]
                                                    "
                          >
                            <FaAngleDoubleLeft />
                          </button>

                          <button className="join-item btn bg-black hover:bg-black cursor-default text-white">
                            Page {pageCount}
                          </button>

                          {/* Next Btn  */}
                          <button
                            onClick={() => setPageCount(pageCount + 1)}
                            disabled={listings.length < 4 || loading}
                            className="join-item btn bg-black text-white hover:bg-black/90
                                                    disabled:bg-[#d5d5d5] disabled:text-[#a0a0a0]"
                          >
                            <FaAngleDoubleRight />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className=" mt-40 flex items-center justify-center flex-col">
                      <LuSearchX className="text-3xl text-black font-bold text-center" />
                      <p className="font-heading text-xl mt-3 text-center text-black ">
                        Sorry, No rooms available!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
