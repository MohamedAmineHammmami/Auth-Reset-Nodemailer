import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

export const inputValidationError = async (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")),
  });
  try {
    await schema.validateAsync(data);
  } catch (err) {
    return err.details[0].message;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
