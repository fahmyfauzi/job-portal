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

  //token
  const token = user.createJWT();

  return res.status(201).send({
    success: true,
    message: "User created successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next("Please Provide All Fields");
  }

  //find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid username or password");
  }

  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid username or password");
  }
  //ini digunakan untuk menghilangkan bidang password dari objek pengguna.
  user.password = undefined;

  //response
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
export { registerController, loginController };
