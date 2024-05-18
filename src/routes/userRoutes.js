import express from "express";
import { loginUser } from "../controllers/userControllers/loginUser.js";
import { createUsers } from "../controllers/userControllers/createUsers.js";
import { getAllUsers } from "../controllers/userControllers/getAllUsers.js";
import { getUserbyId } from "../controllers/userControllers/getUserbyId.js";
import { deleteUsers } from "../controllers/userControllers/deleteUsers.js";
import { editUsers } from "../controllers/userControllers/editUsers.js";
import { logoutUser } from "../controllers/userControllers/logoutUser.js";
import upload from "../middlewares/upload.js";
import { authCheck } from "../middlewares/authCheck.js";

const userRoutes = express.Router();

userRoutes.post("/users/login", loginUser);
userRoutes.post(
  "/users/register",
  upload.single("profilePicture"),
  createUsers
);
userRoutes.get("/users", authCheck, getAllUsers);
userRoutes.get("/users/:id", authCheck, getUserbyId);
userRoutes.put(
  "/users/:id",
  upload.single("profilePicture"),
  authCheck,
  editUsers
);
userRoutes.delete("/users/:id", authCheck, deleteUsers);
userRoutes.post("/users/logout/", authCheck, logoutUser);

export default userRoutes;
