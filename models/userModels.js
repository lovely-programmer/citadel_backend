import mongoose from "mongoose";

let account_number = Math.floor(Math.random() * 9000000000) + 1000000000;

let firstR = Math.floor(Math.random() * 9000);
let lastR = Math.floor(Math.random() * 90000);

let routing_number = firstR + "-" + lastR;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    name: { type: String, required: [true, "Please add a name"] },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
    phoneNumber: { type: String, required: [true, "Please add a phoneNumber"] },
    address: { type: String, required: [true, "Please add a valid address"] },
    profilePicture: { type: String },
    account_number: { type: Number, default: account_number },
    routing_number: { type: String, default: routing_number },
    account_type: {
      type: String,
      required: [true, "Please add a valid account type"],
    },
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    tcc_code: { type: String },
    imf_code: { type: String },
    cot_code: { type: String },
    atc_code: { type: String },
    tcc_code_price: { type: Number },
    imf_code_price: { type: Number },
    cot_code_price: { type: Number },
    atc_code_price: { type: Number },
    tcc_code_need: { type: Boolean, default: true },
    imf_code_need: { type: Boolean, default: true },
    cot_code_need: { type: Boolean, default: true },
    atc_code_need: { type: Boolean, default: true },
    restricted: { type: Boolean, default: false },
  },
  {
    timeStamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
