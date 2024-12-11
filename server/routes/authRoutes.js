import express from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/authControllers.js";
import { isAuthorized } from "../middlewares/authSession.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/profile", isAuthorized, profile);

export default authRouter;
