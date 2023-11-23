import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  //tangkap headers authorization
  const authHeader = req.headers.authorization;

  //validasi header
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth failed");
  }

  // Ambil token dari header
  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token menggunakan JWT dan dapatkan payload
    const payload = JWT.verify(token, process.env.JWT_SECRET);

    // Tambahkan informasi pengguna ke objek request
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    next("auth failed");
  }
};

export default userAuth;
