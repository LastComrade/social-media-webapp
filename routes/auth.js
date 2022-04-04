const router = require("express").Router();
const authMid = require("../middlewares/auth");
const authCont = require("../controllers/auth");

router.route("/register").post(authCont.register);

router.route("/login").post(authCont.login);

router.route("/logout").get(authCont.logout);

router.route("/activate-account").post(authCont.activateUser);

router
  .route("/request-password-reset-link")
  .post(authCont.sendPasswordResetLink);

router.route("/reset-password").post(authCont.resetPassword);

router.route("/google-login").post(authCont.googleLogin);

router.route("/facebook-login").post(authCont.facebookLogin);

router
  .route("/refresh")
  .post(authMid.checkAccessToken, authCont.refreshAccessToken);

module.exports = router;
