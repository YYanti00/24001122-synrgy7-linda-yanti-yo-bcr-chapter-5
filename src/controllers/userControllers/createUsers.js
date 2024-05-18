import { genSalt } from "bcrypt";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

export const createUsers = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : "";
    const { fullName, email, password, role } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUsers = await userModel.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
      role: role,
      profilePicture: image,
    });

    return res.status(201).json({
      status: true,
      message: "Users successfully create",
      data: newUsers,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
