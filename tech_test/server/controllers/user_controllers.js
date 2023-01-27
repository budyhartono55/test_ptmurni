//calling models
const { User } = require("../models");
const bcrypt = require("bcrypt");

//route bucket
const routes = {};

//==================> REGISTER
routes.register = async (req, res) => {
  const pass = req.body.password;
  const age = req.body.age;
  const confirmPass = req.body.confirm_password;
  const userEmail = req.body.email;
  try {
    //search in database
    const findUser = await User.findOne({ where: { email: userEmail } });
    if (findUser) {
      return res.status(208).json({
        statusCode: 208,
        status: "Already Reported",
        message: "Email already registered",
      });
    } else {
      if (pass !== confirmPass) {
        return res.status(409).json({
          statusCode: 409,
          status: "Conflict",
          message: "Password didn't match, try again!",
        });
      }

      //validate age
      if (age < 18) {
        return res.status(400).json({
          statusCode: 400,
          status: "Bad Request",
          message: "Sorry,age must be under 18 years old!",
        });
      } else {
        //ValidatePasssword
        const validatePassword = (pass) => {
          const regex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;
          return regex.test(pass);
        };

        if (validatePassword(pass)) {
          //if nothing "CREATE/PUSH"
          const encryptPassword = await User.create({
            ...req.body,
            password: bcrypt.hashSync(pass, 10),
            confirm_password: bcrypt.hashSync(pass, 10),
          });
          req.user = encryptPassword;
          //Result
          const dataResult = {
            statusCode: 200,
            statusMessage: "OK",
            message: "Register Success",
            data: {
              userDetails: encryptPassword,
            },
          };
          res.json(dataResult);
        } else {
          res.status(400).send({ error: "Invalid password. Must contain one uppercase letter, one number and be at least 6 characters long." });
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      statusText: "Internal Server Error",
      message: err.message,
    });
  }
};

//==================> LOGIN
routes.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });

    //check email
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Email doesn't registered, please Sign Up!",
      });
    }

    //if email already registered
    //compare password
    const verifiedPass = await bcrypt.compare(req.body.password, user.password);
    //check password
    if (!verifiedPass) {
      return res.status(401).json({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Wrong Password",
      });
    } else {
      const userResult = {
        statusCode: 200,
        statusMessage: "OK",
        message: "Login Success",
        data: {
          details: user.dataValues,
        },
      };

      //print user information
      res.json(userResult);
    }

    //if success email and password
    //redirect to getToken in middleware
    //next();

    //if login error
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      statusText: err.message,
    });
  }
};

//==================> Get All Users
routes.get_all_users = async (req, res) => {
  try {
    const users = await User.findAll();
    const user_result = {
      statusCode: 200,
      statusText: "Show all categories",
      data: users,
    };
    res.json(user_result);
  } catch (err) {
    res.status(500).json({
      statusText: "Internal Server Error",
      message: err.message,
    });
  }
};

//export to router
module.exports = routes;
