const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const config = require("config");
// For DEPLOYMENT
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Bodyparser middleware
app.use(bodyParser.json()); // Latest version of express doesn't need to import body-parser, instead app.use(express.json())

// Cors
app.use(cors());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// DB config
// const db = require('./config/keys').mongoURI
const db = config.get("mongoURI");

//Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

// Import Routes and Use them
app.use("/api/blogs", require("./routes/api/blogRoute"));
app.use("/api/comments", require("./routes/api/commentRoute"));
app.use("/users", require("./routes/UserRoute/userRoute"));

// Serve Static assets if in production for DEPLOYMENT
if (process.env.NODE_ENV === "production") {
	// Set Static folder
	app.use(express.static("public/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "public", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server Started on " + port));
