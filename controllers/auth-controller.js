const { User } = require("../models/User.js");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { BASE_URL } = process.env;

const path = require("path");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { HttpError } = require("../helpers/HttpError.js");
const { sendEmail } = require("../helpers/sendEmail.js");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bycrypt.hash(password, 10);
    const verificationCode = nanoid();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationCode,
    });
    const verifyMail = {
      to: email,
      subject: "Verify email",
      html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${verificationCode}">Click verify</a>`,
    };
    await sendEmail(verifyMail);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationCode: "",
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};
const recendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyMail = {
      to: email,
      subject: "Verify email",
      html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${user.verificationCode}">Click verify</a>`,
    };
    await sendEmail(verifyMail);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bycrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};
const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please load avatar" });
  }
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  try {
    const avatar = await Jimp.read(tempUpload);
    await avatar.resize(250, 250);
    await avatar.writeAsync(resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    // await fs.rename(tempUpload, resultUpload);
    await fs.unlink(tempUpload);
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  recendVerify,
};
