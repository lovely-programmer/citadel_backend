import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getMe,
  editUser,
  deleteUser,
  updateProfilePicture,
} from "../controllers/userController.js";
import {
  getCode,
  restrict,
  restrictedUsers,
  updateImf,
  updateTax,
  updateTcc,
  updateAtc,
} from "../controllers/userVerifyController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.put("/getCode/:codeType", protect, getCode);

userRouter.put("/restrict/:id", protect, restrict);

userRouter.put("/updateTcc/:id", protect, updateTcc);

userRouter.put("/updateImf/:id", protect, updateImf);

userRouter.put("/updateTax/:id", protect, updateTax);

userRouter.put("/updateAtc/:id", protect, updateAtc);

userRouter.put("/:id", protect, editUser);

userRouter.put("/updateProfilePicture/:id", protect, updateProfilePicture);

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/allusers", protect, getAllUsers);
userRouter.get("/", protect, getMe);
userRouter.delete("/user/:id", protect, deleteUser);

userRouter.get("/restrictedUser", protect, restrictedUsers);

export default userRouter;
