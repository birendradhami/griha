import Listing from "../models/Listing.js";
import { throwError } from "../utils/error.js";

// Create 
export const createRoom = async (req, res, next) => {
  if (req.user.id !== req.body.userRef) {
    return next(throwError(400, 'Token Expired, Login for create room'));
  }

  try {
    const user = req.user;
    const isAdmin = user.role === 'admin';

    const room = await Listing.create({
      ...req.body,
      approved: isAdmin ? true : false,
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

// Room Delete
export const deleteRoom = async (req, res, next) => {
  const isRoomExist = await Listing.findById(req.params.id);

  try {
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Room deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Room Update
export const updateRoom = async (req, res, next) => {
  try {
    const existingRoom = await Listing.findById(req.params.id);

    if (!existingRoom) {
      return next(throwError(404, "Room not found"));
    }

    if (req.user.id !== existingRoom.userRef && req.user.role !== "admin") {
      return next(throwError(400, "You can only update your own account"));
    }

    try {
      let updatedRoom;

      if (req.user.role === "admin") {
        updatedRoom = await Listing.findByIdAndUpdate(
          req.params.id,
          { ...req.body, userRef: existingRoom.userRef },
          { new: true }
        );
      } else {
        if (req.body.userRef && req.body.userRef !== existingRoom.userRef) {
          return next(
            throwError(400, "You are not allowed to change the owner")
          );
        }

        updatedRoom = await Listing.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
      }

      res.status(200).json(updatedRoom);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// Approve Room

export const approveRoom = async (req, res, next) => {
  try {
    const existingRoom = await Listing.findById(req.params.id);

    if (!existingRoom) {
      return next(throwError(404, "Room not found"));
    }
    console.log(req.user)

    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return next(throwError(403, "You are not allowed to approve rooms"));
    }

    try {
      const approvedRoom = await Listing.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
      );

      res.status(200).json(approvedRoom);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};


// Single Room
export const singleRoom = async (req, res, next) => {
  try {
    const room = await Listing.findById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// Get Rooms

export const getListingRoom = async (req, res, next) => {
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


