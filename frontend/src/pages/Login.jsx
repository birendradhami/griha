import React, { useEffect, useLayoutEffect, useState } from "react";
import Signup from "../components/SignUp";
import SignIn from "../components/SignIn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isNewUser, setIsNewUser] = useState(true);
  const [isFormSubmit, setIsformSubmit] = useState(false);
  const [responseData, setResponseData] = useState();
  const navigate = useNavigate();

  const handleTostify = async () => {
    (await responseData.success) && setIsNewUser(!isNewUser);
    toast(responseData.message, {
      autoClose: 2000,
    });
  };
  useEffect(() => {
    isFormSubmit && handleTostify();
    setIsformSubmit(false);
  }, [responseData]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      navigate("/dashboard");
    }
  }, []);


  
  return (
    <>
      {currentUser && currentUser.email ? (
        <section className="form-section py-20  ">
          <div className="container">
            <p className="text-base md:text-xl text-center text-black font-heading font-bold ">
              User exist! Redirecting to profile page
            </p>
          </div>
        </section>
      ) : (
        <section className="form-section py-10 md:py-3 ">
          <div className="container ">
            <div className="form-container px-4 sm:px-8 bg-white py-6 pb-8 sm:py-9 sm:pb-12 max-w-lg mx-auto rounded-sm border-[1px] border-brand-black/50 shadow-brand shadow-black/40">
              <OAuth />
              <h1 className="text-center font-bold text-black mb-3 font-heading text-md sm:text-[20px]">
                {isNewUser ? "Login" : "Create an account"}
              </h1>
              {isNewUser ? (
                <SignIn />
              ) : (
                <Signup userState={{ setResponseData, setIsformSubmit }} />
              )}

              <p className="content text-center font-heading text-black mt-4">
                {isNewUser
                  ? "Don’t have an account?"
                  : "Already have an account?"}
                <u
                  className="ml-1  border-gray-700 text-gray-700 cursor-pointer"
                  onClick={() => setIsNewUser(!isNewUser)}
                >
                  {isNewUser ? "Create an account" : "Login"}
                </u>
              </p>

              <ToastContainer limit={0} />
            </div>
          </div>
        </section>
      )}
      <></>
    </>
  );
};

export default Login;
