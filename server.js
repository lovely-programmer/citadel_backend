import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import connectDb from "./config/db.js";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import transactionRouter from "./routes/transactionRoutes.js";
import multer from "multer";

dotenv.config();

connectDb();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users/", userRouter);

app.use("/api/transaction", transactionRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
