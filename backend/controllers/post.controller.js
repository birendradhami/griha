import Listing from "../models/listing.models.js";
import { throwError } from "../utils/error.js";

// Create 
export const createPost = async (req, res, next) => {
  if (req.user.id !== req.body.userRef) {
    return next(throwError(400, 'Token Expired, Login for create post'));
  }

  try {
    const user = req.user;
    const isAdmin = user.role === 'admin';

    const post = await Listing.create({
      ...req.body,
      approved: isAdmin ? true : false,
    });

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
  try {
    const existingPost = await Listing.findById(req.params.id);

    if (!existingPost) {
      return next(throwError(404, "Post not found"));
    }

    console.log(req.user)

    if (req.user.id !== existingPost.userRef && req.user.role !== "admin") {
      return next(throwError(400, "You can only update your own account"));
    }

    try {
      let updatedPost;

      if (req.user.role === "admin") {
        updatedPost = await Listing.findByIdAndUpdate(
          req.params.id,
          { ...req.body, userRef: existingPost.userRef },
          { new: true }
        );
      } else {
        if (req.body.userRef && req.body.userRef !== existingPost.userRef) {
          return next(
            throwError(400, "You are not allowed to change the owner")
          );
        }

        updatedPost = await Listing.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// Approve Room

export const approvePost = async (req, res, next) => {
  try {
    const existingPost = await Listing.findById(req.params.id);

    if (!existingPost) {
      return next(throwError(404, "Post not found"));
    }
    console.log(req.user)

    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return next(throwError(403, "You are not allowed to approve posts"));
    }

    try {
      const approvedPost = await Listing.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
      );

      res.status(200).json(approvedPost);
    } catch (error) {
      next(error);
    }
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
      approved = false,
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

    if (minPrice || maxPrice !== Infinity) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    if (approved === "true") {
      query.approved = true;
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


