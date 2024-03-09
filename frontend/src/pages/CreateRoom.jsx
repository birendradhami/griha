import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState, useEffect } from "react";
import { firebaseApp } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const Createroom = () => {
  const nepalProvinces = [
    {
      province: "Koshi Province",
      districts: [
        "Bhojpur",
        "Dhankuta",
        "Ilam",
        "Jhapa",
        "Khotang",
        "Morang",
        "Okhaldhunga",
        "Panchthar",
        "Sankhuwasabha",
        "Solukhumbu",
        "Sunsari",
        "Taplejung",
        "Terhathum",
        "Udayapur",
      ],
    },
    {
      province: "Madhesh Province",
      districts: [
        "Bara",
        "Parsa",
        "Rautahat",
        "Sarlahi",
        "Dhanusha",
        "Mahottari",
        "Sindhuli",
      ],
    },
    {
      province: "Bagmati Province",
      districts: [
        "Bhaktapur",
        "Chitwan",
        "Dhading",
        "Dolakha",
        "Kathmandu",
        "Kavrepalanchok",
        "Lalitpur",
        "Nuwakot",
        "Ramechhap",
        "Rasuwa",
        "Sindhupalchok",
      ],
    },
    {
      province: "Gandaki Province",
      districts: [
        "Gorkha",
        "Kaski",
        "Lamjung",
        "Manang",
        "Mustang",
        "Myagdi",
        "Nawalpur",
        "Parbat",
        "Syangja",
        "Tanahun",
      ],
    },
    {
      province: "Lumbini Province",
      districts: [
        "Arghakhanchi",
        "Gulmi",
        "Kapilvastu",
        "Nawalparasi",
        "Palpa",
        "Rupandehi",
      ],
    },
    {
      province: "Karnali Province",
      districts: ["Dolpa", "Humla", "Jumla", "Kalikot", "Mugu", "Surkhet"],
    },
    {
      province: "Sudurpashchim Province",
      districts: [
        "Achham",
        "Baitadi",
        "Dadeldhura",
        "Darchula",
        "Kailali",
        "Kanchanpur",
      ],
    },
  ];

  const { currentUser } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState([]);
  const [uploadError, setUploadError] = useState({
    isError: false,
    message: "",
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [isOffer, setIsoffer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imgUrl: [],
  });

  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [address, setAddress] = useState("");

  const districtOptions = selectedProvince
    ? selectedProvince.districts.map((district) => ({
        value: district,
        label: district,
      }))
    : [];

  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const handleAgreeChange = () => {
    setAgreed(!agreed);
  };

  const handleStepClick = async (step) => {
    const isStepAhead = step > currentStep;

    if (isStepAhead) {
      const isStepValid = await validateCurrentStep();

      if (isStepValid) {
        setCurrentStep(step);
      } else {
        console.log("Fill in the required fields!");
      }
    } else {
      setCurrentStep(step);
    }
  };

  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();

    if (isStepValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      console.log("Fill in the blank!");
    }
  };

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return validateDetailsStep();
      case 2:
        return validateAddressStep();
      case 3:
        return validateImagesStep();
      default:
        return false;
    }
  };

  const validateDetailsStep = () => {
    const { title, description, price } = getValues();

    if (!title || !description || !price) {
      toast.error("Please fill in all fields for Details step.");
      return false;
    }

    return true;
  };

  const validateAddressStep = () => {
    if (!selectedProvince || !selectedDistrict || !address) {
      toast.error("Please fill in all fields for Address step.");
      return false;
    }

    return true;
  };

  const validateImagesStep = () => {
    const { imgUrl } = getValues();

    if (!imgUrl) {
      toast.error("Please fill in all fields for Image step.");
      return false;
    }

    return true;
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleImageUpload = async (selectedFiles) => {
    const totalFiles = selectedFiles.length + formData.imgUrl.length;

    if (totalFiles <= 6) {
      setLoading(true);
      const promises = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        promises.push(uploadToFirebase(selectedFiles[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData({ ...formData, imgUrl: formData.imgUrl.concat(urls) });
      } catch (error) {
        setUploadError({
          ...uploadError,
          isError: true,
          message: "File upload failed.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setUploadError({
        ...uploadError,
        isError: true,
        message: "Select a maximum of 6 files.",
      });
    }
  };

  const uploadToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(firebaseApp);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject("File uploaded Falied");
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDelete = (index) => {
    setFormData({
      ...formData,
      imgUrl: formData.imgUrl.filter(
        (items) => items != formData.imgUrl[index]
      ),
    });
  };

  uploadError.isError &&
    toast.error(uploadError.message, {
      autoClose: 2000,
    });

  const handleFormSubmit = async (data) => {
    try {
      if (formData.imgUrl.length < 1) {
        toast.error("Please upload an image before submitting the form.", {
          autoClose: 2000,
        });
        return;
      }

      setFormSubmitLoading(true);

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          address: `${address},${selectedDistrict?.label || ""}`,
          imgUrl: formData.imgUrl,
          userRef: currentUser._id,
        }),
      });

      const serverRes = await res.json();

      if (serverRes.success === false) {
        toast.error(serverRes.message, {
          autoClose: 2000,
        });
        setFormSubmitLoading(false);
      } else {
        if (currentUser && currentUser.role === "admin") {
          navigate(`/listing/${serverRes._id}`);
        } else {
          toast.success("room created successfully and Sent for Approval!");
          navigate(`/listing/${serverRes._id}`);
        }
        setFormSubmitLoading(false);
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      });
      setFormSubmitLoading(false);
    }
  };

  const renderDetailsStep = () => (
    <div className="details-step mt-7">
      <div className="info_container flex justify-evenly flex-col sm:flex-row">
        <div className="input_feilds w-[90%] mx-auto sm:w-[40%]">
          <p className="text-lg font-semibold  text-black mb-2">
            Property Name
          </p>
          <input
            id="title"
            type="text"
            placeholder="Property name"
            name="title"
            className="form_input border-[1px]  focus:border-brand-blue rounded-md placeholder:text-sm "
            min={10}
            max={50}
            {...register("title", {
              required: "This feild is required*",
            })}
          />
          {errors.title && (
            <p className="text-red-700 text-xs">{errors.title.message}</p>
          )}

          <p className="text-lg font-semibold mt-3 text-black">
            Property Description
          </p>
          <textarea
            id="description"
            type="text"
            placeholder="Description"
            name="description"
            className="form_input border-[1px]  focus:border-brand-blue rounded-md placeholder:text-sm mt-3"
            {...register("description", {
              required: "This feild is required*",
            })}
          />
          {errors.description && (
            <p className="text-red-700 text-xs">{errors.description.message}</p>
          )}
          <div className="property_type">
            <p className="text-lg font-semibold  text-black">Property type</p>
            <div className="form-control ">
              <label
                className="label cursor-pointer flex items-center justify-start gap-2
                                            "
              >
                <input
                  type="radio"
                  name="rent"
                  id="rent"
                  value={"rent"}
                  required
                  defaultChecked
                  className="radio w-5 h-5 !bg-gray-100 checked:bg-black"
                  {...register("type")}
                />
                <span className="label-text text-black font-medium">
                  For Rent
                </span>
              </label>
            </div>
          </div>

          <div className="property_info mt-3">
            <p className=" text-lg font-semibold text-black">
              General Information
            </p>
            <div className="max-w-[200px] flex items-center justify-between gap-2 mt-2">
              <span className="label-text font-medium text-black">
                Area <small>(sqft)</small>
              </span>
              <div>
                <input
                  defaultValue={550}
                  className="border-2 focus:border-black rounded-md max-w-[84px] py-1 px-2 bg-transparent"
                  type="number"
                  name="area"
                  id="area"
                  {...register("area", { required: "required" })}
                />
                {errors.area && (
                  <p className="text-red-700 text-xs font-semibold">
                    {errors.area.message}
                  </p>
                )}
              </div>
            </div>

            <div className="max-w-[200px]  flex items-center justify-between gap-2 mt-2">
              <span className="label-text text-black font-medium">
                Bedrooms
              </span>
              <div>
                <input
                  defaultValue={1}
                  className="border-2 focus:border-brand-blue rounded-md max-w-[84px] min-w-[84px]  py-1 px-2 bg-transparent"
                  min={1}
                  max={10}
                  type="number"
                  name="beds"
                  id="bed"
                  {...register("bed", { required: "required" })}
                />
                {errors.bed && (
                  <p className="text-red-700 text-xs font-semibold">
                    {errors.bed.message}
                  </p>
                )}
              </div>
            </div>
            <div className="max-w-[200px] flex items-center justify-between gap-2 mt-1">
              <span className="label-text text-black font-medium">
                Bathrooms
              </span>
              <div>
                <input
                  defaultValue={1}
                  className="border-2 focus:border-brand-lack rounded-md max-w-[84px] min-w-[84px] py-1 px-2 bg-transparent"
                  min={1}
                  max={10}
                  type="number"
                  name="beds"
                  id="bath"
                  {...register("bath", { required: "required" })}
                />
                {errors.bath && (
                  <p className="text-red-700 text-xs font-semibold">
                    {errors.bath.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="additional_info ml-4 w-[90%] mx-auto sm:w-[40%]">
          <div className="additional_feature">
            <p className="text-lg font-semibold text-black">
              Additional Information
            </p>
            <div className="form-control">
              <label className="label cursor-pointer flex items-center justify-start gap-2">
                <input
                  id="parking"
                  type="checkbox"
                  name="parking"
                  className="checkbox w-5 h-5 border-gray-400 rounded-full checked:bg-black"
                  {...register("parking")}
                />
                <span className="label-text text-black font-medium">
                  Parking
                </span>
              </label>
              <label className="label cursor-pointer flex items-center justify-start gap-2">
                <input
                  id="furnished"
                  type="checkbox"
                  className="checkbox w-5 h-5 border-gray-400 rounded-full checked:bg-black"
                  {...register("furnished")}
                />
                <span className="label-text text-black font-medium">
                  Furnished
                </span>
              </label>

              <label className="label cursor-pointer flex items-center justify-start gap-2">
                <input
                  id="offer"
                  type="checkbox"
                  className="checkbox w-5 h-5 border-gray-400 rounded-full checked:bg-black"
                  {...register("offer")}
                  onChange={() => setIsoffer(!isOffer)}
                />
                <span className="label-text text-black font-medium">
                  Do you have any discount?
                </span>
              </label>
            </div>
          </div>

          <div className=" mt-1">
            <div className="pricing_info flex flex-col">
              <p className="mt-3  text-lg font-semibold text-black">
                Regular Price{" "}
              </p>
              <span className="text-sm font-content font-bold text-red-900">
                (NPR. /month)
              </span>
              <div className="flex flex-row mt-2 ">
                <span className="flex bg-grey-lighter rounded rounded-r-none px-2 font-bold text-grey-darker text-xl">
                  NPR.
                </span>
                <input
                  id="price"
                  type="number"
                  name="price"
                  className="bg-slate-100 p-0 sm:p-2 rounded-md text-grey-darkest border-2 focus:border-black font-bold text-black text-lg max-w-[200px]"
                  {...register("price", {
                    required: "This feild is required*",
                  })}
                />
              </div>
              {errors.price && (
                <p className="text-black text-xs font-semibold">
                  {errors.price.message}
                </p>
              )}
            </div>
            {isOffer && (
              <div className="pricing_info flex flex-col">
                <p className="mt-3  font-heading text-black">Discount Price </p>
                <span className="text-sm font-content font-bold text-red-900">
                  (NPR. /month)
                </span>
                <div className="flex flex-row mt-2 ">
                  <span className="flex  bg-grey-lighter rounded rounded-r-none px-2 font-bold text-grey-darker text-xl">
                    NPR.
                  </span>
                  <input
                    id="discountPrice"
                    type="number"
                    name="discountPrice"
                    className="bg-slate-100 p-0 sm:p-2 rounded-md text-grey-darkest border-2 focus:border-brand-blue font-bold text-red-700 text-lg max-w-[200px]"
                    {...register("discountPrice", {
                      required: "This feild is required*",
                      validate: (value) => {
                        const { price } = getValues();
                        if (+price < +value) {
                          return "*Discount price should be lower than regular price";
                        }
                      },
                    })}
                  />
                </div>
                {errors.discountPrice && (
                  <p className="text-red-700 text-xs font-semibold">
                    {errors.discountPrice.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <button
          type="button"
          className="px-4 py-2 rounded-md flex font-bold items-center cursor-pointer bg-black text-white mx-auto"
          onClick={handleNextStep}
        >
          Next
        </button>

        <div className="mt-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span className="text-black">Proceed to next Step</span>
        </div>
      </div>
    </div>
  );

  const renderAddressStep = () => (
    <div className="address-step w-[90%] sm:w-[40%] mx-auto mt-7">
      <p className="text-lg font-semibold text-black">Property Address</p>

      <Select
        options={nepalProvinces.map((province) => ({
          value: province.province,
          label: province.province,
          districts: province.districts,
        }))}
        value={selectedProvince}
        onChange={(selectedOption) => setSelectedProvince(selectedOption)}
        placeholder="Select a province"
        className="form_input p-0 border-b-0 rounded-md placeholder:text-sm mt-3"
        theme={(theme) => ({
          ...theme,
          borderradius: 0,
          colors: {
            ...theme.colors,
            text: "#fff",
            font: "#3599b8",
            primary25: "#3599b8",
            primary: "black",
            neutral80: "black",
            color: "black",
          },
        })}
      />

      <Select
        options={districtOptions}
        value={selectedDistrict}
        onChange={(selectedOption) => setSelectedDistrict(selectedOption)}
        placeholder="Select a district"
        className="form_input p-0 border-b-0 rounded-md placeholder:text-sm mt-3"
        theme={(theme) => ({
          ...theme,
          borderradius: 0,
          colors: {
            ...theme.colors,
            text: "#fff",
            font: "#3599b8",
            primary25: "#3599b8",
            primary: "black",
            neutral80: "black",
            color: "black",
          },
        })}
      />

      <input
        type="text"
        placeholder="Address"
        name="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="form_input border-[1px] focus:border-brand-blue rounded-md placeholder:text-sm mt-3"
      />

      <div></div>

      <textarea
        id="mapUrl"
        placeholder="Google Maps Shared Iframe Link
eg. <Iframe></Iframe>"
        name="mapUrl"
        className="form_input border-[1px] mt-4 focus:border-brand-blue rounded-md placeholder:text-sm "
        {...register("mapUrl", {
          required: "This field is required*",
        })}
      ></textarea>
      <div className="mt-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span className="text-black">Only  enter the iframe code from Google maps.</span>
        </div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          type="button"
          className="px-4 font-bold py-2 rounded-md flex items-center cursor-pointer bg-black text-white "
          onClick={handlePrevStep}
        >
          Previous
        </button>
        <button
          type="button"
          className="px-4 font-bold py-2 rounded-md flex items-center cursor-pointer bg-black text-white"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderImagesStep = () => (
    <div className="images-step w-[90%] sm:w-[40%] mx-auto mt-7">
      <div>
        <p className="text-lg font-semibold mb-4 text-black">Property Images</p>
        <p className="font-content text-[16px] mt-5 sm:mt-0 mb-3 font-normal text-black">
          <span className="font-semibold mr-1">Note:</span>
          First image will be the cover image (max: 6)
        </p>
        <div className="image_upload_container md:p-1 md:border-2 bg-transparent border-dashed rounded-sm lg:flex items-center justify-center gap-2">
          <input
            onChange={(e) => handleImageUpload(e.target.files)}
            multiple
            accept="image/*"
            type="file"
            className={`file-input file:bg-black/80 bg-black/5 ${
              loading ? "lg:w-4/6" : "lg:w-4/5"
            } w-full`}
          />
        </div>
        <div>
          {formData.imgUrl.length > 0 &&
            formData.imgUrl.map((imgSrc, index) => (
              <div
                key={index}
                className="uploaded_images p-2 pr-5 border-2 mt-4 rounded-md flex items-center justify-between"
              >
                <img
                  src={imgSrc}
                  alt="property Image"
                  className="w-24 h-20 object-cover rounded-md"
                />
                <button
                  onClick={() => handleDelete(index)}
                  type="button"
                  className="font-medium text-lg text-black flex items-center underline hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
      {/* <div className="mt-5">
        <label className="flex items-center justify-center">
          <input
            type="checkbox"
            id="agreeCheckbox"
            checked={agreed}
            onChange={handleAgreeChange}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/termsandconditions" className="text-blue-500">
                terms and conditions
              </Link>
            </span>
        </label>
      </div> */}
      <div className="flex justify-center gap-4 mt-7">
        <button
          type="button"
          className="px-4 font-bold py-2 rounded-md flex items-center cursor-pointer bg-black text-white"
          onClick={handlePrevStep}
        >
          Previous
        </button>
        {currentUser ? (
          <button
            type="submit"
            className="font-bold duration-300 px-4 py-2 rounded-md flex items-center cursor-pointer bg-black text-white"
          >
            {formSubmitLoading ? "Creating..." : "Create"}
          </button>
        ) : (
          <Link to="/login">
            <button className="px-4 font-bold py-2 rounded-md flex items-center cursor-pointer bg-black text-white">
              Login to Create
            </button>
          </Link>
        )}
      </div>
    </div>
  );

  const renderProgressSteps = () => (
    <div className="progress-steps flex justify-center space-x-2 relative max-w-full mx-auto mt-3 mb-12">
      <div
        onClick={() => handleStepClick(1)}
        className={`group relative ${
          currentStep >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
        } px-4 py-2 rounded-full flex items-center cursor-pointer`}
      >
        <span className="relative z-10 ">1</span>
        <div
          className={`tooltip absolute bottom-[45px] -top-8 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-2  rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto`}
        >
          Details
        </div>
      </div>
      <div
        className={`line bg-${currentStep >= 2 ? "black" : "gray-200"} h-1 w-4`}
      ></div>
      <div
        onClick={() => handleStepClick(2)}
        className={`group step relative ${
          currentStep >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
        } px-4 py-2 rounded-full flex items-center cursor-pointer`}
      >
        2
        <div
          className={`tooltip absolute bottom-[45px] -top-8 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-2  rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto`}
        >
          Address
        </div>
      </div>
      <div
        className={`line bg-${currentStep >= 3 ? "black" : "gray-200"} h-1 w-4`}
      ></div>
      <div
        onClick={() => handleStepClick(3)}
        className={`group step relative ${
          currentStep >= 3 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
        } px-4 py-2 rounded-full flex items-center cursor-pointer`}
      >
        3
        <div
          className={`tooltip absolute bottom-[45px] -top-8 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-2  rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto`}
        >
          Image
        </div>
      </div>
    </div>
  );

  return (
    <main>
      <section>
        <div className="container !pt-5 py-7 md:py-16 max-w-5xl">
          <h1 className="text-center text-2xl sm:text-3xl font-heading font-bold text-black">
            Create Room
          </h1>
          <div className="mt-7 form_container ">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="feilds_container text-black grid gap-5 md:gap-10 items-start  ">
                <div className="form-container">
                  {renderProgressSteps()}
                  {currentStep === 1 && renderDetailsStep()}
                  {currentStep === 2 && renderAddressStep()}
                  {currentStep === 3 && renderImagesStep()}
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </section>
    </main>
  );
};

export default Createroom;
