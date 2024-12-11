import express from "express";
import {
  forgotPassEmail,
  forgotPassView,
  resetPassView,
  restPass,
} from "../controllers/passControllers.js";

const passRouter = express.Router();

passRouter.route("/forgot-password").get(forgotPassView).post(forgotPassEmail);
passRouter
  .route("/reset-password/:id/:token")
  .get(resetPassView)
  .post(restPass);

export default passRouter;
