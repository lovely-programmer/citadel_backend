import express from "express";
import {
  createTransaction,
  getTransactions,
  updateBalance,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/", protect, createTransaction);
transactionRouter.get("/", protect, getTransactions);
transactionRouter.put("/:id", protect, updateBalance);

export default transactionRouter;
