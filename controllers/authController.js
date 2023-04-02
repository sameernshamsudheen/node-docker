const User = require("../models/userModel");
var bcrypt = require("bcryptjs");

exports.SignUp = async (req, res, next) => {
  console.log(req.body);

  const { username, password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 12);
  console.log(hashedpassword);
  try {
    const newUser = await User.create({
      username,
      password: hashedpassword,
    });
    console.log(newUser);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "failed",
    });
  }
};

exports.Login = async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });



  try {
    if (!existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "user doesnt exist",
      });
    }
    const isCorrect = await bcrypt.compare(password,existingUser.password);
    console.log(isCorrect)

    if (isCorrect) {
      req.session.user = existingUser;
      res.status(200).json({
        status: "success",
        message:"login success"
      });
    } else {
      return res
        .status(400)
        .json({ status:"fail", message: "password or username is incorrect" });
    }
  } catch (e) {
    console.log(e);
  }
};
