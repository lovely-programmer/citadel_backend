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

const sendEmail = ({ recipient_email, message, subject }) => {
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
      subject: subject,
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
      <div style="font-family: Helvetica,Arial,sans-serif;">
      <div margin-right:auto; margin-left:auto;">

      <div style="marginBottom:20px; color:green;">
        <p>
          You have successfully Transfered $${amount} from ${account_number} to ${account_name}
        </p>
      </div>

      <p style="margin-top:10px;">Current Balance: $${account_balance} </p>

      <div style="margin-bottom:20px; color: red;">
        <p>
          International transaction initiated successfully. <br/> It may take few
          minute, few hours, or a day to credit funds in receivers account. <br /> A
          detail of this transaction has been recorded in your estatement.
        </p>
      </div>

      <p style="color: gray; margin-bottom: 20px;">
        Citadel Choice Banking
      </p>
       <p style="font-weight: bold; color: #2e1a47;">
        How do i know this is not a fake email?
      </p>
      <p style="margin-top:10px;">
        An email really coming from us will address you by your registered full
        name or username. It will not ask for <br /> sensitive information like
        your password, bank account or credit card details
      </p>
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

const sendUpdateUser = ({
  amount,
  account_name,
  account_balance,
  recipient_email,
  account_number,
  subject,
  alert,
  remark,
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
      subject: subject,
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>Transaction</title>
        
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;">
      <div
      style="margin-right:auto; margin-left:auto; width:70%;">

      <p style="font-weight:bold"> Dear ${account_name}</p>

      <p style="margin:10px 0px">
        This is a summary that has occurred on your account below
      </p>

      <div style="width: 70%; border: 1px solid bisque; margin-bottom: 30px;">
        <table>
          <tbody>
            <tr>
              <td style="padding:5px;"> Credit/Debit </td>
              <td style="padding-left:90px;"> ${alert} </td>
            </tr>
            <tr>
            <td style="padding:5px;"> Account Number</td>
            <td style="padding-left:90px;"> ${account_number} </td>
            </tr>
            <tr>
            <td style="padding:5px;"> Date/Time </td>
            <td style="padding-left:90px;"> 19/03/2023 </td>
            </tr>
            <tr>
            <td style="padding:5px;"> Description </td>
            <td style="padding-left:90px;"> ${remark} </td>
            </tr>
            <tr>
            <td style="padding:5px;"> Amount </td>
            <td style="padding-left:90px;"> ${`${amount}`} </td>
            </tr>
            <tr>
            <td style="padding:5px;"> Available Balance </td>
            <td style="padding-left:90px;"> ${`${account_balance}`} </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style= "color:gray; margin-bottom:20px;">
        Citadel Choice Banking
      </p>
      <p style="font-weight: bold; color: #2e1a47;">
        How do i know this is not a fake email?
      </p>
      <p style="margin-top:10px;">
        An email really coming from us will address you by your registered full
        name or username. It will not ask for <br /> sensitive information like
        your password, bank account or credit card details
      </p>
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
  sendUpdateUser()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/send_recovery_email/update", (req, res) => {
  sendUpdateUser(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.use("/api/users/", userRouter);

app.use("/api/transaction", transactionRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
