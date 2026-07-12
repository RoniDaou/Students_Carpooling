const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

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

    return res.status(200).json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.signupUser = async (req, res) => {
  try {
    const {
      universityEmail,
      password,
      confirmPassword,
      first_name,
      last_name,
      universityName,
      campusLocation,
      phoneNumber,
      location,
      role,
      vehicleNumber,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    const studentIdFile = req.files?.studentIdPic?.[0];

    const driverLicenseFile = req.files?.driverLicensePic?.[0];

    if (!studentIdFile) {
      return res.status(400).json({
        error: "Student ID picture is required",
      });
    }

    if (role === "driver" && !vehicleNumber) {
      return res.status(400).json({
        error: "Vehicle or plate number is required",
      });
    }

    if (role === "driver" && !driverLicenseFile) {
      return res.status(400).json({
        error: "Driver license picture is required",
      });
    }

    const studentIdPic = studentIdFile.buffer.toString("base64");

    const driverLicensePic = driverLicenseFile
      ? driverLicenseFile.buffer.toString("base64")
      : "";

    const user = await User.signup({
      universityEmail,
      password,
      first_name,
      last_name,
      universityName,
      campusLocation,
      phoneNumber,
      location,
      role,
      studentIdPic,
      vehicleNumber: vehicleNumber || "",
      driverLicensePic,
    });

    return res.status(201).json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000 && error.keyPattern?.universityEmail) {
      return res.status(400).json({
        error: "This university email is already registered",
      });
    }

    if (
      error.code === 11000 &&
      (error.keyPattern?.studentId || error.message?.includes("studentId_1"))
    ) {
      return res.status(500).json({
        error:
          "The obsolete studentId database index still exists. Restart or redeploy the backend to remove it.",
      });
    }

    return res.status(400).json({
      error: error.message || "Registration failed",
    });
  }
};

exports.getMe = async (req, res) => {
  return res.status(200).json({
    user: publicUser(req.user),
  });
};

exports.updateInfo = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };

    delete updates.role;
    delete updates.universityEmail;

    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const data = JSON.stringify({
      id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      role: req.user.role,
    });

    const qrCodeImage = await QRCode.toDataURL(data);

    return res.status(200).json({
      qrCodeImage,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not generate QR code",
    });
  }
};
