import express from "express";
import {
  createTransaction,
  getTransactions,
  updateBalance,
  Edit,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/", createTransaction);
transactionRouter.get("/getTransaction/:id", protect, getTransactions);
transactionRouter.put("/edit/:id", protect, Edit);
transactionRouter.put("/:id", protect, updateBalance);

export default transactionRouter;
