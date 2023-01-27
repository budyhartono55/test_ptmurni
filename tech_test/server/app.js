const express = require("express");
const dotenv = require("dotenv");
const dotenvConfig = dotenv.config();

// FOUNDATIONS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

// MAIN
app.get("/home", (req, res) =>
  res.status(200).json({
    statusCode: 200,
    statusText: "OK",
    message: "Welcome to PT. Murni Solusindo Nusantara API",
  })
);

//calling router
//const userRoutes = require("./routes/user_routes");
//url_model
//app.use("/api/auth_login", userRoutes);

// MISSING ROUTES
app.all("*", (req, res) =>
  res.status(404).json({
    statusCode: 404,
    statusText: "Not Found",
    message: "Route doesn't exist, please check your route!",
  })
);

// RUN
app.listen(process.env.PORT, () => {
  console.log(`Server running on Port = ${process.env.DEV_PORT}`);
});
