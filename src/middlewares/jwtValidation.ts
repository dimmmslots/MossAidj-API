const jwtValidation = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  try {
    // check access token and refresh token
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // if access token or refresh token not found
    if (!accessToken || !refreshToken) {
      return res.status(401).json({
        message: "Access token or refresh token not found",
      });
    }

    // if access token found, verify access token
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    }
  } catch (error) {
    // if access token expired, verify refresh token
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      //   if refresh token expired, return error
      if (!decoded) {
        return res.status(401).json({
          message: "Refresh token expired",
        });
      }
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
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });
      next();
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};

module.exports = jwtValidation;
