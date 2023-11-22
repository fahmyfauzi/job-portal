import User from "../models/userModel.js";
const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  //validate
  if (!name) {
    next("Name is require");
  }
  if (!email) {
    next("Email is require");
  }
  if (!password) {
    next("Password is require");
  }

  // if exists user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(200).send({
      success: false,
      message: "Email already register please login",
    });
  }

  //register user
  const user = await User.create({ email, name, password });
  return res.status(201).send({
    success: true,
    message: "User created successfully",
    user,
  });
};

export default registerController;
