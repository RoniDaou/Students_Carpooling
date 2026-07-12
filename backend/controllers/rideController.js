const mongoose = require("mongoose");
const Ride = require("../models/rideModel");
const RideRequest = require("../models/rideRequestModel");

const DRIVER_FIELDS =
  "first_name last_name universityEmail campusLocation location vehicleNumber role";
const PASSENGER_FIELDS =
  "first_name last_name universityEmail phoneNumber campusLocation location role";

const populateRide = (query) =>
  query.populate("driverId", DRIVER_FIELDS);

const populateRequest = (query) =>
  query
    .populate({
      path: "rideId",
      populate: {
        path: "driverId",
        select: DRIVER_FIELDS,
      },
    })
    .populate("passengerId", PASSENGER_FIELDS);

exports.getRides = async (req, res) => {
  try {
    const rides = await populateRide(
      Ride.find({ status: { $ne: "cancelled" } }).sort({ date: 1 })
    );

    return res.status(200).json(rides);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSpecificRide = async (req, res) => {
  try {
    const ride = await populateRide(Ride.findById(req.params.rideId));

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.addRide = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can offer rides",
      });
    }

    const {
      date,
      route,
      pickupLocation,
      destination,
      availableSeats,
      notes,
      isFemaleOnly,
    } = req.body;

    const ride = await Ride.create({
      date,
      route,
      pickupLocation,
      destination,
      availableSeats,
      notes,
      isFemaleOnly,
      driverId: req.user._id,
    });

    const populatedRide = await populateRide(
      Ride.findById(ride._id)
    );

    return res.status(201).json(populatedRide);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (String(ride.driverId) !== String(req.user._id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await RideRequest.deleteMany({ rideId: ride._id });
    await ride.deleteOne();

    return res.status(200).json({ message: "Ride deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getDriverRides = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can view offered rides",
      });
    }

    const rides = await populateRide(
      Ride.find({ driverId: req.user._id }).sort({ date: 1 })
    );

    return res.status(200).json(rides);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.requestRide = async (req, res) => {
  try {
    if (req.user.role !== "passenger") {
      return res.status(403).json({
        error: "Only passengers can request rides",
      });
    }

    const { rideId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({ error: "Invalid ride ID" });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status === "cancelled" || ride.status === "completed") {
      return res.status(400).json({
        error: "This ride is no longer accepting requests",
      });
    }

    if (String(ride.driverId) === String(req.user._id)) {
      return res.status(400).json({
        error: "You cannot request your own ride",
      });
    }

    const acceptedCount = await RideRequest.countDocuments({
      rideId,
      status: "accepted",
    });

    if (acceptedCount >= ride.availableSeats) {
      return res.status(400).json({ error: "No available seats" });
    }

    const existingRequest = await RideRequest.findOne({
      rideId,
      passengerId: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "You already requested this ride",
      });
    }

    const request = await RideRequest.create({
      rideId,
      passengerId: req.user._id,
    });

    const populatedRequest = await populateRequest(
      RideRequest.findById(request._id)
    );

    return res.status(201).json(populatedRequest);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        error: "You already requested this ride",
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      RideRequest.find({ passengerId: req.user._id }).sort({
        createdAt: -1,
      })
    );

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDriverRequests = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can view ride requests",
      });
    }

    const driverRides = await Ride.find({
      driverId: req.user._id,
    }).select("_id");

    const rideIds = driverRides.map((ride) => ride._id);

    const requests = await populateRequest(
      RideRequest.find({
        rideId: { $in: rideIds },
      }).sort({ createdAt: -1 })
    );

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRideRequests = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (String(ride.driverId) !== String(req.user._id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const requests = await populateRequest(
      RideRequest.find({ rideId: ride._id }).sort({
        createdAt: -1,
      })
    );

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({
        error: "Only drivers can respond to requests",
      });
    }

    const { requestId, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const request = await RideRequest.findById(requestId).populate(
      "rideId"
    );

    if (!request || !request.rideId) {
      return res.status(404).json({ error: "Request not found" });
    }

    const ride = request.rideId;

    if (String(ride.driverId) !== String(req.user._id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        error: `This request was already ${request.status}`,
      });
    }

    if (action === "accepted") {
      const acceptedCount = await RideRequest.countDocuments({
        rideId: ride._id,
        status: "accepted",
      });

      if (acceptedCount >= ride.availableSeats) {
        return res.status(400).json({ error: "No available seats" });
      }

      await Ride.findByIdAndUpdate(ride._id, {
        $addToSet: { passengerIdsList: request.passengerId },
      });
    }

    request.status = action;
    await request.save();

    const populatedRequest = await populateRequest(
      RideRequest.findById(request._id)
    );

    return res.status(200).json(populatedRequest);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.triggerSOS = async (req, res) => {
  return res.status(200).json({
    message: "SOS alert recorded",
    timestamp: new Date(),
    rideId: req.body.rideId,
    userId: req.user._id,
  });
};

exports.punchInRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    ride.punchInTime = new Date();
    await ride.save();

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.punchOutRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    ride.punchOutTime = new Date();
    ride.status = "completed";
    await ride.save();

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
