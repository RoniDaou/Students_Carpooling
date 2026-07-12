const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");

const createToken = (_id) => jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
const publicUser = (user) => ({
  id: user._id,
  universityEmail: user.universityEmail,
  first_name: user.first_name,
  last_name: user.last_name,
  universityName: user.universityName,
  campusLocation: user.campusLocation,
  phoneNumber: user.phoneNumber,
  location: user.location,
  role: user.role,
  vehicleNumber: user.vehicleNumber || "",
  profilePic: user.profilePic || "",
});

exports.loginUser = async (req, res) => {
  try {
    const { universityEmail, password } = req.body;
    const user = await User.login(universityEmail, password);
    res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.signupUser = async (req, res) => {
  try {
    const { universityEmail, password, confirmPassword, first_name, last_name,
      universityName, campusLocation, phoneNumber, location, role, vehicleNumber } = req.body;
    if (password !== confirmPassword) throw Error("Passwords do not match");
    const studentIdPic = req.files?.studentIdPic?.[0]?.buffer.toString("base64");
    const driverLicensePic = req.files?.driverLicensePic?.[0]?.buffer.toString("base64");
    const user = await User.signup({ universityEmail, password, first_name, last_name,
      universityName, campusLocation, phoneNumber, location, role, studentIdPic,
      vehicleNumber, driverLicensePic });
    res.status(201).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.getMe = async (req, res) => res.json({ user: publicUser(req.user) });

exports.updateInfo = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.role;
    delete updates.universityEmail;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ user: publicUser(user) });
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.generateQRCode = async (req, res) => {
  const data = JSON.stringify({ id: req.user._id, name: `${req.user.first_name} ${req.user.last_name}`, role: req.user.role });
  res.json({ qrCodeImage: await QRCode.toDataURL(data) });
};
