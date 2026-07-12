const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

//Importing express
const express = require("express");
const cors = require("cors");

//Importing dotenv that allows to load environment variables from a .env file into process.env
require("dotenv").config();

//Importing Mongoose to connect to the database on mongodb atlas
const mongoose = require("mongoose");

const app = express();

// Allow all origins (or you can specify a specific domain)
app.use(cors());

const userRoutes = require("./routes/user");
const rideRoutes = require("./routes/ride");

//Middleware build into Express to parse incoming JSON requests
app.use(express.json());

app.use("/user", userRoutes);
app.use("/rides", rideRoutes);

const PORT = process.env.PORT || 5000;
//Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
      console.log("Connected to the Database successfully");
    });
  })
  .catch((error) => console.log(error));
