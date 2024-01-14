import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import success from "../images/success.png";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(null);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/api/auth/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
        toast.success("Email verified successfully");
      } catch (error) {
        console.log(error);
        setValidUrl(false);
        toast.error("Error verifying email");
      }
    };

    // Set a 1-second delay before calling verifyEmailUrl
    const delay = setTimeout(() => {
      setDelayElapsed(true);
    }, 200);

    // Call verifyEmailUrl only if delay has elapsed
    if (delayElapsed) {
      verifyEmailUrl();
    }

    // Cleanup function to clear the timeout
    return () => clearTimeout(delay);
  }, [param, delayElapsed]);

  return (
    <>
      <ToastContainer />
      {validUrl === null ? (
        <div className="w-full h-screen flex items-center justify-center">
          Loading...
        </div>
      ) : validUrl ? (
        <div className="w-full h-screen flex items-center justify-center flex-col">
          <img src={success} alt="success_img" className="w-24 h-24" />
          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button className="py-3 px-6 bg-green-500 rounded-full font-bold text-white text-base mt-4">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <h1 className="text-2xl">404 Not Found</h1>
      )}
    </>
  );
};

export default EmailVerify;
