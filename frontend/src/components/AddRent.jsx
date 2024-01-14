import React from 'react'
import { MdRealEstateAgent } from "react-icons/md";
import { Link } from "react-router-dom";



const AddRent = () => {
  return (
    <section className=' pb-2 sm:pb-20'>
    <div className=" flex items-center justify-center">
      <div className=" p-8 rounded w-full my-9 max-w-screen-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0 md:mr-4">
              <i className='text-[5.75rem] text-black sm:pr-[6rem]'>
              <MdRealEstateAgent />
              </i>
          </div>
          <div className="md:flex-1">
            <h2 className="text-xl font-bold text-black mb-2">Add Your Room to Our Listings</h2>
            <p className="text-black pr-5">
            Join our community by adding your room to our exclusive listings. Showcase the unique
              features and amenities of your space to potential tenants. Start earning by renting your
              room today!
            </p>
          </div>

          <div className="mt-4 md:mt-0 md:ml-4 pt-6 sm:pt-0">
            <Link to={"/create_post"}>
            <button className="bg-black text-white font-bold  py-[0.6rem] px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Create Post
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}

export default AddRent
