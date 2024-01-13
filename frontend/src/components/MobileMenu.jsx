import React from "react";
import {
  FaBookmark,
  FaHeart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutFailed, signoutSuccess } from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { clearSavedListing } from "../redux/saveListing/saveListingSlice";
import { IoChatboxEllipses } from "react-icons/io5";


const MobileMenu = ({ menuStatus }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { setisActiveMoblie, isActiveMoblie } = menuStatus;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const res = await fetch("api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        useDispatch(signoutFailed(data.message));
        toast.error(data.message, {
          autoClose: 2000,
        });
      } else {
        dispatch(signoutSuccess());
        dispatch(clearSavedListing());
      }
    } catch (error) {
      dispatch(signoutFailed(error.message));
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  return (
    <menu className={`fixed right-0 bg-white h-72 py-5 px-5 text-black font-semibold w-full !z-50 shadow-lg shadow-brand-blue/40 ${!currentUser ? 'hidden' : ''}`}>
      <ul className=" ">
        
        {currentUser && currentUser.email ? (
          <>
            <li
              onClick={() => {
                navigate("/dashboard"), setisActiveMoblie(!isActiveMoblie);
              }}
              className="p-2 cursor-pointer rounded-sm mb-3  font-heading hover:bg-brand-blue/40 duration-300"
            >
              <p to="/dashboard" className="flex items-center gap-2">
                <FaUser className="text-black" /> Dashboard
              </p>
            </li>
            <li
              onClick={() => {
                navigate("/saved_listing"), setisActiveMoblie(!isActiveMoblie);
              }}
              className="p-2 cursor-pointer rounded-sm mb-3  font-heading hover:bg-brand-blue/40 duration-300"
            >
              <p to="/saved_listing" className="flex items-center gap-2">
                <FaHeart className="text-black" /> Wishlist
              </p>
            </li>
            <li
          onClick={() => {
            navigate("/message"), setisActiveMoblie(!isActiveMoblie);
          }}
          className="p-2 cursor-pointer rounded-sm mb-3  font-heading hover:bg-brand-blue/40 duration-300"
        >
          <p className="flex items-center gap-2">
            <IoChatboxEllipses /> Chat
          </p>
        </li>
            <li
              onClick={handleLogOut}
              className="p-2  rounded-sm mb-3  cursor-pointer font-heading hover:bg-brand-blue/40 duration-300"
            >
              <p className="flex items-center gap-2">
                <FaSignOutAlt className="text-black" /> Log Out
              </p>
            </li>
          </>
        ) : (
          <li
            onClick={() => {
              navigate("/login"), setisActiveMoblie(!isActiveMoblie);
            }}
            className="p-2  rounded-sm mb-3 cursor-pointer font-heading hover:bg-brand-blue/40 duration-300"
          >
            <p to="/login" className="flex items-center gap-2">
              <FaSignInAlt className="text-black" /> Login
            </p>
          </li>
        )}
      </ul>
      <ToastContainer />
    </menu>
  );
};

export default MobileMenu;
