import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import connectDb from "./config/db.js";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import transactionRouter from "./routes/transactionRoutes.js";
import multer from "multer";
import nodemailer from "nodemailer";

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

const sendEmail = ({ recipient_email, message }) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APPLICATION_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.SENDER_EMAIL,
      to: recipient_email,
      subject: "Login Successful",
      text: message,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
};

app.get("/", (req, res) => {
  sendEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/send_recovery_email", (req, res) => {
  console.log("Auth Email");
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

//? Transaction Mail
const sendTransactionEmail = ({
  amount,
  account_name,
  account_number,
  account_balance,
  recipient_email,
}) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APPLICATION_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.SENDER_EMAIL,
      to: recipient_email,
      subject: "Transaction Successful",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Transaction</title>
        
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #2e1a47;text-decoration:none;font-weight:600">Citadel Choice Banking</a>
          </div>
          <p>You have successfully Transferred ${amount} from Account Number ${account_number} and ${account_name}  </p>
          <p style="margin-top:10px;">Current Balance: ${account_balance}</p>
          <p style="margin-top: 10px"> ${new Date().toLocaleDateString(
            "en-US"
          )} </p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Citadel Choice Banking</p>
            <p>Citadel Choice Bank
            800 Nicollet Mall
            Minneapolis, MN 55402</p>
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
};

app.get("/", (req, res) => {
  sendTransactionEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/send_recovery_email/transfer", (req, res) => {
  console.log("Transaction Email");
  sendTransactionEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.use("/api/users/", userRouter);

app.use("/api/transaction", transactionRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
