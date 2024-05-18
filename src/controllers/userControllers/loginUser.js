import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email: email } });
    if (user == null) {
      // return res.status(404).json({ message: "User not found" });
      req.flash("error", "User hasn't been registered");
      res.redirect("/");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      // return res.status(401).json({ message: "Wrong password" });
      req.flash("error", "Password is incorrect");
      res.redirect("/");
    }

    if (user.role != "admin") {
      req.flash("error", "You are not an admin");
      res.redirect("/");
      // return res.status(401).json({ message: "You are not an admin" });
    }
    const acesstoken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    const loginUser = await userModel.update(
      { refreshToken: refreshToken },
      { where: { id: user.id } }
    );
    if (loginUser) {
      req.session.refreshToken = refreshToken;
      res.redirect("/cars");

      // return res.status(200).json({
      //   status: true,
      //   message: "Success login",
      //   accessToken: acesstoken,
      // });
    }
    
  } catch (error) {
    req.flash("error", error.message);
    res.render("/");
    // return res.status(500).json({ status: false, message: error.message });
  }
};
