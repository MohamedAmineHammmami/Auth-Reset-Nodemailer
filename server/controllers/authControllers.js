import User from "../models/User.js";
import bcrypt from "bcrypt";
import { inputValidationError } from "../models/User.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (await inputValidationError(req.body)) {
      return res
        .status(400)
        .json({ success: false, msg: await inputValidationError(req.body) });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists!" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await User.create({ username, email, password: hash });
    res
      .status(201)
      .json({ success: true, msg: "User successfully registred!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await inputValidationError(req.body)) {
      return res
        .status(400)
        .json({ success: false, msg: await inputValidationError(req.body) });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials..!" });
    }
    //set session data
    req.session.userId = user._id;
    res.status(200).json({ success: true, msg: "You're logged in..!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: "logout failed!" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, msg: "you logged out!" });
  });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const { password, ...rest } = user._doc;
    res.status(200).json({ success: true, data: rest });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};
