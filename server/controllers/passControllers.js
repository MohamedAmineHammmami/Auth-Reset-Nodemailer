import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const forgotPassView = (req, res) => {
  res.render("forgotPassView");
};
export const forgotPassEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found..!" });
    }
    const secretKey = process.env.SECRET_KEY + user.password;
    const token = Jwt.sign({ id: user._id }, secretKey, { expiresIn: "10min" });
    const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;
    const transporteur = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL,
      to: req.body.email,
      subject: "Reset Passwored Link!",
      html: `<div>
      <h2>Here is the reset password link!<h2>
      <h3>link expires in 10min </h3>
      <p>${link}</p>
      </div>`,
    };
    transporteur.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email info", info.response);
      }
    });
    res.render("checkEmailView");
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};
export const resetPassView = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not Found!" });
    }
    Jwt.verify(req.params.token, process.env.SECRET_KEY + user.password);
    res.render("resetPassView");
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const restPass = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    user.password = hash;
    await user.save();
    res.render("successResetView");
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
