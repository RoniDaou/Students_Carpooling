const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  universityEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  universityName: { type: String, required: true },
  campusLocation: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  role: { type: String, enum: ["driver", "passenger"], required: true },
  profilePic: { type: String, default: "" },
  studentIdPic: { type: String, required: true },
  vehicleNumber: { type: String, default: "" },
  driverLicensePic: { type: String, default: "" },
}, { timestamps: true });

userSchema.statics.login = async function (universityEmail, password) {
  if (!universityEmail || !password) throw Error("Email and password are required");
  const user = await this.findOne({ universityEmail: universityEmail.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) throw Error("Invalid email or password");
  return user;
};

userSchema.statics.signup = async function (data) {
  const required = ["universityEmail","password","first_name","last_name","universityName","campusLocation","phoneNumber","location","role","studentIdPic"];
  if (required.some(k => !data[k])) throw Error("All required fields must be filled");
  if (!validator.isEmail(data.universityEmail)) throw Error("Email not valid");
  if (data.password.length < 6) throw Error("Password must be at least 6 characters");
  if (data.role === "driver" && (!data.vehicleNumber || !data.driverLicensePic)) throw Error("Drivers must provide vehicle and license information");
  if (await this.findOne({ universityEmail: data.universityEmail.toLowerCase() })) throw Error("Email already in use");
  return this.create({ ...data, universityEmail: data.universityEmail.toLowerCase(), password: await bcrypt.hash(data.password, 10) });
};
module.exports = mongoose.model("User", userSchema);
