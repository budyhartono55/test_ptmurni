//Route
const express = require("express");

//router base
const router = express.Router();

//calling function in controllers
const { register, login, get_all_users } = require("../controllers/user_controllers");

//middleware auth
//const { getToken } = require("../middleware/auth");

//actions
router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/get_all_users", get_all_users);
//export to app.js
module.exports = router;
