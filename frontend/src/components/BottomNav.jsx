import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaBookmark, FaSignOutAlt, FaUser, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signoutFailed, signoutSuccess } from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";

const BottomNav = ({ user }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const { currentUser } = useSelector((state) => state.user);
  const { saveListings } = useSelector((state) => state.savedListing);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailed(data.message));
        toast.error(data.message, {
          autoClose: 2000,
        });
      } else {
        dispatch(signoutSuccess());
        navigate("/home");
      }
    } catch (error) {
      dispatch(signoutFailed(error.message));
      toast.error(error.message, {
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = currentScrollPos < prevScrollPos;

      setIsNavVisible(isScrollingUp || currentScrollPos === 0);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const navClass = isNavVisible ? "bottom-nav visible" : "bottom-nav hidden";

  return (
    <div
      className={`block sm:hidden bg-white mx-auto min-h-14 py-3 left-0  fixed bottom-0 w-full z-50 ${navClass}`}
    >
      <div className="bottom-nav-options flex justify-center gap-7">
        {currentUser && (
          <Link
            to={"/dashboard"}
            className="bottom-nav-item text-xs text-black"
          >
            <FaUser className="bottom-nav-icon w-7 h-7 ml-3 mb-1" />
            Dashboard
          </Link>
        )}
        <Link
          to={"/saved_listing"}
          className="bottom-nav-item text-black text-xs"
        >
          {/* <FaHeart className="bottom-nav-icon w-7 h-7 ml-[6px] mb-1" /> */}
          <i className="relative">
            <FaHeart className="bottom-nav-icon w-7 h-7 ml-[3px] mb-1" />
            <span className="absolute bg-white text-black text-[10px] h-4 w-4 rounded-full shadow-md border border-black flex items-center justify-center text-xs bottom-1 top-2 left-[20px] leading-tight">
              {saveListings.length} {saveListings.length === 1}
            </span>
          </i>
          Wishlist
        </Link>
        <Link to={"/message"} className="bottom-nav-item text-xs text-black">
          <IoChatboxEllipses className="bottom-nav-icon w-7 h-7 mb-1" />
          Chat
        </Link>
        {currentUser && (
          <Link
            className="bottom-nav-item text-xs text-black"
            onClick={handleLogOut}
          >
            <FaSignOutAlt className="bottom-nav-icon w-7 h-7 ml-2 mb-1" />
            Logout
          </Link>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BottomNav;
