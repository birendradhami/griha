import React, { useState } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signoutFailed, signoutSuccess } from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { clearSavedListing } from "../redux/saveListing/saveListingSlice";
import { FaBookmark, FaSignOutAlt, FaUser, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardOption = ({ user }) => {
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

  
    const handleLogOut = async () => {
      try {
        const res = await fetch("api/auth/signout/id");
        const data = await res.json();
        if (data.success === false) {
          dispatch(signoutFailed(data.message));
          toast.error(data.message, {
            autoClose: 2000,
          });
        } else {
          dispatch(signoutSuccess());
          dispatch(clearSavedListing());
          setDropdownOpen(false);
          navigate("/");
        }
      } catch (error) {
        dispatch(signoutFailed(error.message));
        toast.error(error.message, {
          autoClose: 2000,
        });
      }
    };
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

  const styles = ` .menu li > *:not(ul):not(.menu-title):not(details):active {
        background-color: transparent !important;
    }`;
  return (
    <>
      <style>{styles}</style>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end" onClick={toggleDropdown}>
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar hover:outline-0 "
          >
            <div className=" w-16 rounded-full">
              <img
                className="rounded-full border border-brand-blue/20 h-10 w-8 object-cover"
                src={user?.avatar}
                alt="profile image"
              />
            </div>
          </label>

          <ul
            tabIndex={0}
            className={` mt-6 xl:mt-9 sm:mt-7 z-[999999] p-2 sm:mx-1 shadow-md menu menu-lg  sm:menu-sm dropdown-content bg-white rounded-md sm:w-52 ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            <li>
              <Link
                to={"/dashboard"}
                className="justify-start py-2 text-black text-[15.5px] sm:text-[16px]"
              >
                <FaUser className="text-black text-[15.5px] sm:text-[16px]" />{" "}
                Dashboard
              </Link>
            </li>
            <li className="block sm:hidden">
              <Link
                to={"/saved_listing"}
                className="justify-start text-black text-[15.5px] sm:text-[16px] py-2"
              >
                <FaHeart className="text-black text-[15.5px] text-base" />{" "}
                Wishlist
              </Link>
            </li>
            <li className="block sm:hidden">
              <Link
                to={"/message"}
                className="justify-start text-black text-[15.5px] sm:text-[16px] py-2"
              >
                <IoChatboxEllipses className="text-black text-[15.5px] sm:text-[16px]" />{" "}
                Chat
              </Link>
            </li>
            <li
              onClick={() => {
                handleLogOut();
                toggleDropdown();
              }}
            >
              <Link className=" text-black text-[15.5px] sm:text-[16px] py-2">
                <FaSignOutAlt className="text-black text-[15.5px] sm:text-[16px]" />{" "}
                Logout
              </Link>
            </li>
          </ul>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default DashboardOption;
