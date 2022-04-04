const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};

module.exports.generateTokens = (id) => {
  try {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.generateActivationToken = (email) => {
  try {
    const activateToken = jwt.sign(
      { email },
      process.env.ACCOUNT_ACTIVATION_SECRET,
      {
        expiresIn: "5m",
      }
    );
    return activateToken;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.generateResetToken = (email) => {
  try {
    const resetToken = jwt.sign({ email }, process.env.PASSWORD_RESET_SECRET, {
      expiresIn: "5m",
    });
    return resetToken;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.sendMailToActivateAccount = async (email, activateToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Activate Account | KonarkLohat Projects",
      html: `<h1>Greetings User, </h1>
          <p>Thank you for registering with KonarkLohat Projects. Please click on the link below to activate your account.</p>
          <a href="${process.env.CLIENT_URL}/activate/${activateToken}">Activate</a>`,
    };
    const mail = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.sendMailToResetPassword = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password | KonarkLohat Projects",
      html: `<h1>Greetings User, </h1>
          <p>This is a highly confidential link. Please click on the link below to reset your password.</p>
          <a href="${process.env.CLIENT_URL}/reset/${resetToken}">Reset Password</a>`,
    };
    const mail = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};
