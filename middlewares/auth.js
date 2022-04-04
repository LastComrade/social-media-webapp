const jwt = require("jsonwebtoken");

const auth = {
  isAuthenticated: (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      // console.log(req);
      const accessToken = req.headers.authorization.split(" ")[1];
      console.log("This -------- ", accessToken);
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessTokenDecoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      req.userId = refreshTokenDecoded.id;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  },

  checkAccessToken: (req, res, next) => {
    try {
      // console.log(req);
      const refreshToken = req.cookies.refreshToken;
      const accessToken = req.body.accessToken;
      console.log("---CheckAccessToken---\nAccessToken: ", accessToken);
      console.log("---CheckAccessToken---\nRefreshToken: ", refreshToken);
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      req.userId = refreshTokenDecoded.id;
      try {
        const accessTokenDecoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.status(200).json({ message: "Access Token is valid" });
      } catch (err) {
        console.log(err);
        next();
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
};

module.exports = auth;
