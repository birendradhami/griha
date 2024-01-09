import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { firebaseApp } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";

const UpdatePost = () => {
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

  const [dataLoading, setDataLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const getPostInfo = async () => {
      setDataLoading(true);
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 2000,
        });
        setDataLoading(false);
      } else {
        setFeildValue(data);
        setFormData({ ...formData, imgUrl: data.imgUrl });
        data.offer && setIsoffer(true);
        setDataLoading(false);
      }
    };
    getPostInfo();
  }, []);

  const setFeildValue = (data) => {
    setValue("title", data.title);
    setValue("description", data.description);
    setValue("address", data.address);
    setValue("type", data.type);
    setValue("area", data.area && data.area);
    setValue("bath", data.bath);
    setValue("bed", data.bed);
    setValue("furnished", data.furnished);
    setValue("parking", data.parking);
    setValue("offer", data.offer);
    setValue("price", data.price);
    setValue("discountPrice", data.discountPrice);
  };

  const handleImageUpload = async () => {
    if (imageFile.length > 0 && imageFile.length + formData.imgUrl.length < 7) {
      setLoading(true);
      const promises = [];
      for (let i = 0; i < imageFile.length; i++) {
        promises.push(uploadToFirebase(imageFile[i]));
        Promise.all(promises)
          .then((urls) => {
            setFormData({ ...formData, imgUrl: formData.imgUrl.concat(urls) });
            setLoading(false);
          })
          .catch((error) => {
            setUploadError({ ...uploadError, isError: true, message: error });
            setLoading(false);
          });
      }
    } else {
      setUploadError({
        ...uploadError,
        isError: true,
        message: "Select file first (max:6)",
      });
      setLoading(false);
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
      setFormSubmitLoading(true);
      const res = await fetch(`/api/posts/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
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
        navigate(`/listing/${serverRes._id}`);
        setFormSubmitLoading(false);
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      });
      setFormSubmitLoading(false);
    }
  };

  return (
    <main>
      {dataLoading ? (
        <div>
          <Loading />
          <p className="font-heading text-brand-blue text-lg sm:text-2xl text-center">
            Loading...
          </p>
        </div>
      ) : (
        <section>
        <div className="container !pt-5 py-7 md:py-16 max-w-5xl">
          <h1 className="text-center text-2xl font-heading font-bold text-black">
            Update Post
          </h1>
          <div className="mt-8 form_container">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="feilds_container text-black grid gap-5 md:gap-10  grid-col-1 sm:grid-cols-2 items-start  ">
                <div className="info_container">
                  <div className="input_feilds">
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
                      <p className="text-red-700 text-xs">
                        {errors.title.message}
                      </p>
                    )}

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
                      <p className="text-red-700 text-xs">
                        {errors.description.message}
                      </p>
                    )}

                    <input
                      id="address"
                      type="text"
                      placeholder="Address"
                      name="address"
                      className="form_input border-[1px]  focus:border-brand-blue rounded-md placeholder:text-sm mt-3"
                      {...register("address", {
                        required: "This feild is required*",
                      })}
                    />
                    {errors.address && (
                      <p className="text-red-700 text-xs font-semibold">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="additional_info mt-6 max-w-xs">
                    <div className="property_type">
                      <p className="text-lg font-semibold  text-black">
                        Property type:
                      </p>
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
                        General Information:
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
                        <span className="label-text text-black font-medium">Bedrooms</span>
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
                            className="border-2 focus:border-brand-blue rounded-md max-w-[84px] min-w-[84px] py-1 px-2 bg-transparent"
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

                    <div className="additional_feature mt-3">
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
                          <span className="flex items-center bg-grey-lighter rounded rounded-r-none px-2 font-bold text-grey-darker text-xl">
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
                          <p className="mt-3  font-heading text-black">
                            Discount Price{" "}
                          </p>
                          <span className="text-sm font-content font-bold text-red-900">
                            (NPR. /month)
                          </span>
                          <div className="flex flex-row mt-2 ">
                            <span className="flex items-center bg-grey-lighter rounded rounded-r-none px-2 font-bold text-grey-darker text-xl">
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

                <div>
                  <p className="font-content text-[16px] mt-3 sm:mt-0 mb-3 font-normal text-black">
                    <span className="font-semibold mr-1">Note:</span>
                    First image will be cover image (max:6)
                  </p>
                  <div className="image_upload_container md:p-5 md:border-2 bg-transparent border-dashed rounded-sm lg:flex items-center justify-center gap-2">
                    <input
                      onChange={(e) => setImageFile(e.target.files)}
                      required
                      multiple
                      accept="image/*"
                      type="file"
                      className={`file-input file:bg-black/80 bg-black/5 ${
                        loading ? "lg:w-4/6" : "lg:w-4/5"
                      } w-full`}
                    />
                    <button
                      disabled={loading || imageFile.length === 0}
                      onClick={handleImageUpload}
                      type="button"
                      className={`w-full mt-3 text-black text-sm py-2 border-2 border-black rounded-md mt-2 uppercase font-heading  ${
                        loading ? "md:w-2/6" : "lg:w-1/5"
                      } md:h-[3rem] lg:mt-0 duration-500 hover:shadow-lg disabled:border-gray-500 disabled:text-gray-500`}
                    >
                      <span className=" text-sm">
                        {loading ? "Uploading..." : "Upload"}
                        </span>
                    </button>
                  </div>
                  <div>
                    {formData.imgUrl.length > 0 &&
                      formData.imgUrl.map((imgSrc, index) => {
                        return (
                          <div
                            key={index}
                            className="uploaded_images p-2 pr-5 border-2 mt-4  rounded-md flex items-center justify-between"
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
                        );
                      })}
                    <div className="post_btn mt-7">
                    {currentUser ? (
                        <button
                        disabled={
                          formData.imgUrl.length < 1 ||
                          loading ||
                          formSubmitLoading
                        }
                        type="submit"
                        className="w-full bg-black text-xl tracking-wider font-heading rounded-md disabled:opacity-70 duration-300 text-white p-[0.5rem]  sm:p-3"
                      >
                        {formSubmitLoading ? "Updating..." : "Update Post"}
                      </button>
                      ) : (
                        <Link to="/login">
                          <button className="w-full px-2 py-3 text-lg font-heading text-white bg-black">
                            Login to Create Post
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </section>
      )}
    </main>
  );
};

export default UpdatePost;
