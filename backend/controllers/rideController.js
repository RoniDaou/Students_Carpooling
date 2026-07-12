const Ride = require("../models/rideModel");
const RideRequest = require("../models/rideRequestModel");

const populateRide = q => q.populate("driverId", "first_name last_name universityEmail campusLocation location vehicleNumber role");

exports.getRides = async (req,res) => {
  try { res.json(await populateRide(Ride.find({ status: { $ne: "cancelled" } }).sort({ date: 1 }))); }
  catch(e){ res.status(500).json({ error:e.message }); }
};
exports.getSpecificRide = async (req,res) => {
  try { const ride=await populateRide(Ride.findById(req.params.rideId)); if(!ride) return res.status(404).json({error:"Ride not found"}); res.json(ride); }
  catch(e){ res.status(400).json({error:e.message}); }
};
exports.addRide = async (req,res) => {
  try {
    if(req.user.role!=="driver") return res.status(403).json({error:"Only drivers can offer rides"});
    const {date,route,pickupLocation,destination,availableSeats,notes,isFemaleOnly}=req.body;
    const ride=await Ride.create({date,route,pickupLocation,destination,availableSeats,notes,isFemaleOnly,driverId:req.user._id});
    res.status(201).json(await populateRide(Ride.findById(ride._id)));
  } catch(e){res.status(400).json({error:e.message});}
};
exports.deleteRide = async (req,res) => {
  try { const ride=await Ride.findById(req.params.rideId); if(!ride) return res.status(404).json({error:"Ride not found"});
    if(String(ride.driverId)!==String(req.user._id)) return res.status(403).json({error:"Not authorized"});
    await RideRequest.deleteMany({rideId:ride._id}); await ride.deleteOne(); res.json({message:"Ride deleted"});
  } catch(e){res.status(400).json({error:e.message});}
};
exports.getDriverRides = async (req,res) => {
  try { res.json(await populateRide(Ride.find({driverId:req.user._id}).sort({date:1}))); } catch(e){res.status(500).json({error:e.message});}
};
exports.requestRide = async (req,res) => {
  try { const {rideId}=req.body; const ride=await Ride.findById(rideId); if(!ride) return res.status(404).json({error:"Ride not found"});
    if(String(ride.driverId)===String(req.user._id)) return res.status(400).json({error:"You cannot request your own ride"});
    const existing=await RideRequest.findOne({rideId,passengerId:req.user._id}); if(existing) return res.status(400).json({error:"You already requested this ride"});
    const request=await RideRequest.create({rideId,passengerId:req.user._id}); res.status(201).json(request);
  } catch(e){res.status(400).json({error:e.message});}
};
exports.getMyRequests = async (req,res) => {
  try { res.json(await RideRequest.find({passengerId:req.user._id}).populate({path:"rideId",populate:{path:"driverId",select:"first_name last_name universityEmail vehicleNumber"}}).sort({createdAt:-1})); }
  catch(e){res.status(500).json({error:e.message});}
};
exports.getRideRequests = async (req,res) => {
  try { const ride=await Ride.findById(req.params.rideId); if(!ride||String(ride.driverId)!==String(req.user._id)) return res.status(403).json({error:"Not authorized"});
    res.json(await RideRequest.find({rideId:ride._id}).populate("passengerId","first_name last_name universityEmail phoneNumber")); }
  catch(e){res.status(500).json({error:e.message});}
};
exports.respondToRequest = async (req,res) => {
  try { const {requestId,action}=req.body; const request=await RideRequest.findById(requestId).populate("rideId"); if(!request) return res.status(404).json({error:"Request not found"});
    if(String(request.rideId.driverId)!==String(req.user._id)) return res.status(403).json({error:"Not authorized"});
    if(!["accepted","rejected"].includes(action)) return res.status(400).json({error:"Invalid action"});
    if(action==="accepted" && request.rideId.passengerIdsList.length>=request.rideId.availableSeats) return res.status(400).json({error:"No available seats"});
    request.status=action; await request.save(); if(action==="accepted"&&!request.rideId.passengerIdsList.some(id=>String(id)===String(request.passengerId))){request.rideId.passengerIdsList.push(request.passengerId);await request.rideId.save();}
    res.json(request);
  } catch(e){res.status(400).json({error:e.message});}
};
exports.triggerSOS = async (req,res) => { res.json({message:"SOS alert recorded",timestamp:new Date(),rideId:req.body.rideId,userId:req.user._id}); };
exports.punchInRide = async (req,res) => { try{const r=await Ride.findById(req.params.rideId); if(!r)return res.status(404).json({error:"Ride not found"}); r.punchInTime=new Date();await r.save();res.json(r);}catch(e){res.status(400).json({error:e.message});}};
exports.punchOutRide = async (req,res) => { try{const r=await Ride.findById(req.params.rideId); if(!r)return res.status(404).json({error:"Ride not found"}); r.punchOutTime=new Date();r.status="completed";await r.save();res.json(r);}catch(e){res.status(400).json({error:e.message});}};
