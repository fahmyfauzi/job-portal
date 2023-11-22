import User from "../models/userModel.js";
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validate
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "pleasse provide name",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "pleasse provide email",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "pleasse provide name",
      });
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
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in register controller",
      success: false,
      error,
    });
  }
};

export default registerController;
