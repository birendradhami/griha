
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loddingStart,
  signinSuccess,
  signinFailed,
} from "../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from 'react';
const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { loading } = useSelector((state) => state.user);
  const [errorText, setErrorText] = useState("");
 
  const onSubmit = async (formData) => {
    dispatch(loddingStart());
    try {
      if (!formData.email || !formData.userPassword) {
        toast.error("Please fill your information in the fields below:", {
          autoClose: 2000,
        });
        return;
      }

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const userData = await res.json();

      if (userData.success === false) {
        dispatch(signinFailed(userData.message));
        setErrorText(userData.message);
        toast.error(userData.message, {
          autoClose: 2000,
        });
      } else {
        dispatch(signinSuccess(userData));
        navigate("/home");
      }
    } catch (error) {
      dispatch(signinFailed(error.message));
      setErrorText("An error occurred. Please try again.");
      toast.error(error.message, {
        autoClose: 2000,
      });
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

        <input
          {...register("userPassword", { required: true })}
          type="password"
          placeholder="Password"
          className="form_input mt-5"
          required
        />
        {errors.userPassword && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

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
