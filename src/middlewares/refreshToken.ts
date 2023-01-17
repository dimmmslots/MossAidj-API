const refreshToken = (req, res, next) => {
  try {
    const jwt = require("jsonwebtoken");
    // check req.user from jwtValidation middleware
    if (req.user) {
      next();
    }
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      {
        username: decoded.username,
        id: decoded.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    // });
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = refreshToken;
