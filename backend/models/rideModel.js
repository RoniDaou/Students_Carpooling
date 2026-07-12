const mongoose = require("mongoose");
const rideSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  route: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availableSeats: { type: Number, required: true, min: 1 },
  notes: { type: String, default: "" },
  isFemaleOnly: { type: Boolean, default: false },
  status: { type: String, enum: ["pending","approved","cancelled","completed"], default: "approved" },
  passengerIdsList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  punchInTime: Date,
  punchOutTime: Date,
}, { timestamps: true });
module.exports = mongoose.model("Ride", rideSchema);
