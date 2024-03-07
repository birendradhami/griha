import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

const Signup = ({ userState }) => {
  const { setResponseData, setIsformSubmit } = userState;

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (formData) => {
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    setIsformSubmit(true);
    setResponseData(data);
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: true })}
          type="text"
          placeholder="Username"
          className="form_input"
          required
        />
        {errors.username && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="form_input mt-5"
          required
        />
        {errors.email && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        {/* <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="form_input mt-5"
          required
        /> */}
        {/* Password input with show/hide functionality */}
        <div className="relative mt-5">
          <input
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form_input pr-10"
            required
          />
          {errors.password && (
            <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
              {errors.password.message}
            </span>
          )}

          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center  cursor-pointer"
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword ? <VscEye size={21} /> : <VscEyeClosed size={21} />}
          </div>
        </div>
        {errors.password && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn bg-black text-white text-base mt-5 rounded-md w-full"
        >
          {loading ? "Loading..." : "Create an account"}
        </button>
      </form>
    </>
  );
};

export default Signup;
