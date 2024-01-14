import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setMessage("");
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false)
        } else {
            try {
              const token = searchParams.get("token");
              const res = await axios.post(
                `/api/forgotPassword/resetPassword`,
                { token, password }
              );
              setMessage(res.data.message);
              // Redirect to login page after successful password reset
             navigate("/login");
            } catch (error) {
                setError(error.response.data.message)
            } finally {
                setIsLoading(false)
            }

        }
    }
    return (
      <>
        <section className="form-section py-10 md:py-3 ">
          <div className="container ">
            <div className="form-container px-4 sm:px-8 bg-white py-6 pb-8 sm:py-9 sm:pb-12 max-w-lg mx-auto rounded-sm border-[1px] border-brand-black/50 shadow-brand shadow-black/40">
              <h1 className="text-center font-bold text-black mb-3 font-heading text-md sm:text-[20px]">
                Forgot Password
              </h1>
              <form onSubmit={handleSubmit}>
                {/* <input
                  type="password"
                  className="form_input mt-1"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                /> */}
                {/* Password input with show/hide functionality */}
                <div className="relative mt-5">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form_input mt-1"
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center  cursor-pointer"
                    onClick={handleTogglePasswordVisibility}
                  >
                    {showPassword ? (
                      <VscEye size={21} />
                    ) : (
                      <VscEyeClosed size={21} />
                    )}
                  </div>
                </div>
                <div className="relative mt-5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="form_input mt-5"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center  cursor-pointer"
                    onClick={handleTogglePasswordVisibility}
                  >
                    {showPassword ? (
                      <VscEye size={21} />
                    ) : (
                      <VscEyeClosed size={21} />
                    )}
                  </div>
                </div>
                {/* <input
                  type="password"
                  placeholder="Confirm new password"
                  className="form_input mt-5"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                /> */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn bg-black text-white text-base mt-5 rounded-md w-full "
                >
                  Reset
                </button>
                {message && (
                  <div className="mt-10 bg-green-700 mx-auto w-full p-3 rounded-lg shadow-lg text-white text-base">
                    <p>{message}</p>
                  </div>
                )}
                {error && (
                  <div className="mt-10 bg-red-700 mx-auto w-full p-3 rounded-lg shadow-lg text-white text-base">
                    <p>{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </>
    );
}

export default ResetPassword;