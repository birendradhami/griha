import React from 'react'
import { ToastContainer } from 'react-toastify';


const DashboardOption = ({ user }) => {
    if (!user) {
        // Handle the case where user is null or undefined
        return (
          <div className="flex-none gap-2">
            {/* You might want to add some default content or a loading spinner */}
            <p>User data not available</p>
            <ToastContainer />
          </div>
        );
      }


    return (
        <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:outline-0 ">
                    <div className=" w-16 rounded-full">
                        <img className='rounded-full border border-brand-blue/20 h-10 w-8 object-cover' src={user.avatar} alt="profile image" />
                    </div>
                </label>
            </div>
            <ToastContainer />
        </div>
        
    )
};

export default DashboardOption;