import { React, useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useSelector } from "react-redux";
import Dashboard from "./DashboardOption";
import { FaHeart, FaHome} from "react-icons/fa";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import GrihaLogo from '../../assets/Griha.png'; 

const Header = () => {
  const [isActiveMoblie, setisActiveMoblie] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { notificationsDB } = useSelector((state) => state.notification);

  return (
    <>
      <div className="navbar sm:pl-16 pr-0 pt-6 pb-6 bg-white border-b-[2px] sticky top-0 z-[1000]">
        <div className=" px-2 sm:px-5 justify-between  max-w-screen-2xl w-full !mx-auto gap-1">
          {/* Logo container  */}
          <div className="col-span-3 sm:col-span-4">
            <h1 className="font-blach sm:text-xl text-sm text-left hover:bg-transparent  text-black tracking-tighter w-full font-heading font-bold flex items-center justify-start">
              <Link to={"/home"} className="flex items-center justify-start">
               <img src={GrihaLogo} alt='Griha Logo' className="w-[25%] sm:w-[25%] lg:w-[8%] mr-2 sm:mr-2">
               </img>
                <span className="text-3xl sm:text-4xl"> Griha</span>
              </Link>
            </h1>
          </div>
          <div className="col-span-3 sm:col-span-5  md:col-span-4 flex items-center justify-end">
            <ul className=" sm:ml-5 sm:flex items-center justify-end  sm:pr-4 font-semibold text-black font-content ">
              <li className="hidden sm:block" >
                <Link to={`${currentUser ? "/saved_listing" : "/login"}`} className="flex items-center gap-1 mr-4 text-lg">
                Wishlist
                <i>
                <FaHeart />
                </i>
                </Link>
                
              </li>
              <li className="hidden sm:block mr-9 capitalize text-lg text-black  ">
                    <Link to={`${currentUser ? "/message" : "/login"}`}>
                      <span className="relative flex items-center gap-1">
                        Chat
                      <IoChatboxEllipsesSharp className="z-10 text-2xl" />
                        {notificationsDB.length === 0 ? (
                          <p
                            className={`text-xs px-[2px] font-heading font-medium bg-lime-600 text-white absolute  top-[-13px] right-[-14px]  flex items-center justify-center rounded-sm`}
                          >
                           
                          </p>
                        ) : (
                          <p
                            className={`text-[11px] font-content font-medium bg-[#c00] text-white absolute  top-[-10px] h-4 ${
                              notificationsDB.length < 9
                                ? "w-3 right-[-8px]"
                                : "w-4 right-[-10px]"
                            } flex items-center justify-center rounded-sm`}
                          >
                            {notificationsDB.length}
                          </p>
                        )}
                      </span>
                    </Link>
                  </li>
                  {currentUser ? (
                  
                  <Link to={"/dashboard"} className="hidden sm:block">
                    <Dashboard user={currentUser} />
                  </Link>
                
              ) : (
                <li className="mr-6">
                  <Link
                    to="/login"
                    className=" text-white px-5 font-bold font-headi py-[0.6rem] rounded uppercase bg-black text-sm duration-300 hover:shadow-sm"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>

            <div className={`nav_mobile flex items-center justify-center sm:hidden gap-1 ${!currentUser ? 'hidden' : ''}`}>
              {/* User Profile Image  */}
              {/* {currentUser && <Profile user={currentUser} />} */}
              <button
                className="btn btn-ghost p-1 hover:bg-transparent text-lg"
                onClick={() => setisActiveMoblie(!isActiveMoblie)}
              >
                {isActiveMoblie ? (
                  <Dashboard user={currentUser} className="text-red-600 font-bold" />
                ) : (
                  <Dashboard user={currentUser} className="text-brand-blue" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isActiveMoblie && (
        <MobileMenu menuStatus={{ isActiveMoblie, setisActiveMoblie }} />
      )}
    </>
  );
};

export default Header;
