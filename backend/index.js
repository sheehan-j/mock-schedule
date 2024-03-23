const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const connectToDB = require("./config/dbConfig");
const PORT = 6205;
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// DB connection w/ mongoose
connectToDB();

// Setup
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use("/", express.static("dist"));

// Routes
app.use("/api/health", require("./routes/health"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/schedules", require("./routes/schedules"));

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB.");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});
