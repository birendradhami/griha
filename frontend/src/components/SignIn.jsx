import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loddingStart,
  loadingStop,
  signinSuccess,
  signinFailed,
} from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);
  const [errorText, setErrorText] = useState("");
const [showPassword, setShowPassword] = useState(false);

const handleTogglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};
  const onSubmit = async (formData) => {
    dispatch(loddingStart());
    try {
      if (!formData.email || !formData.userPassword) {
        toast.error("Please fill in your information in the fields below:", {
          autoClose: 2000,
        });
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const userData = await res.json();
      
      if (userData.success === false) {
        // Handle failure cases
        if (userData.verifyEmail) {
          setErrorText(
            "Email not verified. Please check your email for verification instructions."
          );
          toast.error(
            "Email not verified. Please check your email for verification instructions.",
            {
              autoClose: 2000,
            }
          );
        } else {
          dispatch(signinFailed(userData.message));
          setErrorText(userData.message);
          toast.error(userData.message, {
            autoClose: 2000,
          });
        }
      } else {
        // Handle success case
        if (!userData.verified) {
          setErrorText(
            "Email not verified. Please check your email for verification instructions."
          );
          toast.error(
            "Email not verified. Please check your email for verification instructions.",
            {
              autoClose: 2000,
            }
          );
        } else {
          // Set the success message for the toast
          toast.success("login successful", {
            autoClose: 200,
            onClose: () => {
              // console.log(userData)
              // Dispatch the success action and navigate after the toast is closed
              dispatch(signinSuccess(userData));
              navigate("/home");
            },
          });
        }
      }
    } catch (error) {
      dispatch(signinFailed(error.message));
      setErrorText("An error occurred. Please try again.");
      toast.error(error.message, {
        autoClose: 2000,
      });
    } finally {
      dispatch(loadingStop());
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="form_input mt-1"
          required
        />
        {errors.email && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        {/* <input
          {...register("userPassword", { required: true })}
          type="password"
          placeholder="Password"
          className="form_input mt-5"
          required
        /> */}
        {/* Password input with show/hide functionality */}
        <div className="relative mt-5">
          <input
            {...register("userPassword", { required: true })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form_input pr-10"
            required
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center  cursor-pointer"
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword ? <VscEye size={21} /> : <VscEyeClosed size={21} />}
          </div>
        </div>
        {errors.userPassword && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              id="exampleCheck2"
            />
            <label
              className="form-check-label inline-block text-gray-900"
              htmlFor="exampleCheck2"
            >
              Remember me
            </label>
          </div>
          <Link className="text-gray-600" to={"/forgotPassword"}>
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn bg-black text-white text-base mt-5 rounded-md w-full "
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <ToastContainer limit={0} />
    </>
  );
};

export default SignIn;
