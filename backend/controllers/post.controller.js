import Listing from "../models/listing.models.js";
import { throwError } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (req.user.id != req.body.userRef)
    return next(throwError(400, "Token Expired, Login for create post"));
  try {
    const post = await Listing.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// Post Delete
export const deletePost = async (req, res, next) => {
  const isPostExist = await Listing.findById(req.params.id);

  try {
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Post delete successfully");
  } catch (error) {
    next(error);
  }
};

// Post Update
export const updatePost = async (req, res, next) => {
  const isPostExist = await Listing.findById(req.params.id);
  if (!isPostExist) return next(throwError(404, "Post not found"));
  if (req.user.id != isPostExist.userRef)
    return next(throwError(400, "You can only update  your own account"));
  try {
    const updatedPost = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// Single Post
export const singlePost = async (req, res, next) => {
  try {
    const post = await Listing.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Get Posts

export const getListingPost = async (req, res, next) => {
  try {
    const {
      searchTerm = "",
      type = "all",
      offer = false,
      parking = false,
      furnished = false,
      minPrice = 0,
      maxPrice = Infinity,
      page = 1,
      sort,
    } = req.query;

    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (type !== "all") {
      query.type = type;
    }
    if (offer === "true") {
      query.offer = true;
    }
    if (parking === "true") {
      query.parking = true;
    }
    if (furnished === "true") {
      query.furnished = true;
    }

    // Add a condition for the price range
    if (minPrice || maxPrice !== Infinity) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    const limit = 12;
    const pageNumber = parseInt(page);
    const skip = (pageNumber - 1) * limit;

    let listings;

    if (sort && (sort === "latest" || sort === "oldest")) {
      const sortOption = sort === "latest" ? -1 : 1;
      listings = await Listing.find(query)
        .sort({ createdAt: sortOption })
        .skip(skip)
        .limit(limit);
    } else {
      listings = await Listing.find(query).skip(skip).limit(limit);
    }

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};
