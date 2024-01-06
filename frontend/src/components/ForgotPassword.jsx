import { useState } from 'react';
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            setMessage("");
            setError("");
            const res = await axios.post(
              `/api/forgotPassword/forgotPassword`,
              { email }
            );
            console.log(res);
            setMessage(res.data.message);
            console.log(res.data.message);
        } catch (error) {
            setError(error.response.data.message)
            console.log(error);
            console.log(error.response.data.message);
        }finally{
            setIsLoading(false)
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
          type="email"
          placeholder="Email"
                                className="form_input mt-1"
                                 onChange={(e) => setEmail(e.target.value)}
                    value={email}
          required
        />
       
        <button
          type="submit"
           disabled={isLoading}
          className="btn bg-black text-white text-base mt-5 rounded-md w-full "
                            >
                                Reset
                            </button>
                            {
                message && <div className='mt-10 bg-green-700 mx-auto w-full p-3 rounded-lg shadow-lg text-white text-base'>
                    <p>
                        {message}
                    </p>
                </div>
            }
            {
                error && <div className='mt-10 bg-red-700 mx-auto w-full p-3 rounded-lg shadow-lg text-white text-base'>
                    <p>
                        {error}
                    </p>
                </div>
            }
            </form>


            </div>
          </div>
        </section>
            </>
        
    );
}

export default ForgotPassword;