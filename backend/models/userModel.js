const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    universityEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
    },

    universityName: {
      type: String,
      required: true,
      trim: true,
    },

    campusLocation: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["driver", "passenger"],
      required: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    studentIdPic: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
      default: "",
      trim: true,
    },

    driverLicensePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.login = async function (universityEmail, password) {
  if (!universityEmail || !password) {
    throw Error("Email and password are required");
  }

  const normalizedEmail = universityEmail.toLowerCase().trim();

  const user = await this.findOne({
    universityEmail: normalizedEmail,
  });

  if (!user) {
    throw Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw Error("Invalid email or password");
  }

  return user;
};

userSchema.statics.signup = async function (data) {
  const requiredFields = [
    "universityEmail",
    "password",
    "first_name",
    "last_name",
    "universityName",
    "campusLocation",
    "phoneNumber",
    "location",
    "role",
    "studentIdPic",
  ];

  const missingField = requiredFields.some((field) => !data[field]);

  if (missingField) {
    throw Error("All required fields must be filled");
  }

  const normalizedEmail = data.universityEmail.toLowerCase().trim();

  if (!validator.isEmail(normalizedEmail)) {
    throw Error("Email not valid");
  }

  if (data.password.length < 6) {
    throw Error("Password must be at least 6 characters");
  }

  if (
    data.role === "driver" &&
    (!data.vehicleNumber || !data.driverLicensePic)
  ) {
    throw Error("Drivers must provide vehicle and license information");
  }

  const existingUser = await this.findOne({
    universityEmail: normalizedEmail,
  });

  if (existingUser) {
    throw Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return this.create({
    ...data,
    universityEmail: normalizedEmail,
    password: hashedPassword,
  });
};

module.exports = mongoose.model("User", userSchema);
