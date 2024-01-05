import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
const navigate = useNavigate();
  

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
                "http://localhost:5000/api/forgotPassword/resetPassword",
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
                <input
                  type="password"
                  className="form_input mt-1"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="form_input mt-5"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
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