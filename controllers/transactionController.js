import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModels.js";

const createTransaction = expressAsyncHandler(async (req, res) => {
  const { amount, remark, transaction_type, name, date } = req.body;

  await Transaction.create({
    amount,
    remark,
    transaction_type,
    name,
    user: req.user.id,
    date,
  });

  res.status(200).json("Transaction Successful");
});

const getTransactions = expressAsyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({
    _id: -1,
  });

  res.status(200).json(transactions);
});

const updateBalance = expressAsyncHandler(async (req, res) => {
  const amount = parseInt(req.body.amount);

  const id = req.params.id;

  const balance = req.user.balance;

  const newBalance = balance - amount;

  if (newBalance < 0) {
    res.status(400).json("Not Enough Fund");
  }

  await User.findByIdAndUpdate({ _id: id }, { $set: { balance: newBalance } });

  res.status(200).json("Balance Updated Successfully");
});

export { createTransaction, getTransactions, updateBalance };
