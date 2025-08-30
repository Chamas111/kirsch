const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);
    console.log("userToken exists:", !!req.cookies.userToken);
    if (!req.cookies.userToken) {
      return res.status(401).json({ message: "Not Authenticated user!" });
    }

    const payload = await jwt.verify(
      req.cookies.userToken,
      process.env.JWT_SECRET
    );
    console.log("JWT payload:", payload);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    next(error);
  }
};

module.exports = authenticate;
