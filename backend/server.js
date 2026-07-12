const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const User = require("./models/userModel");
const userRoutes = require("./routes/user");
const rideRoutes = require("./routes/ride");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/rides", rideRoutes);

const PORT = process.env.PORT || 5000;

/*
 * Your MongoDB collection contains an old unique index named
 * "studentId_1", although studentId is no longer in the schema.
 *
 * This removes only that obsolete index.
 */
const removeObsoleteUserIndexes = async () => {
  const indexes = await User.collection.indexes();

  const studentIdIndexExists = indexes.some(
    (index) => index.name === "studentId_1",
  );

  if (studentIdIndexExists) {
    await User.collection.dropIndex("studentId_1");

    console.log('Removed obsolete MongoDB index: "studentId_1"');
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to the database successfully");

    await removeObsoleteUserIndexes();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
