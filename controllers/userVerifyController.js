import User from "../models/userModels.js";
import asyncHandler from "express-async-handler";

const restrictedUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ restricted: true });

  const isAdmin = req.user.isAdmin;

  if (isAdmin) {
    res.status(200).json(users);
  }
});

const getCode = asyncHandler(async (req, res) => {
  const ALBET = makeid(1);
  let tcc_code = "FT" + Math.floor(Math.random() * 900);
  let imf_code = "FTB" + Math.floor(Math.random() * 9000);
  let tax_code = ALBET + Math.floor(Math.random() * 9000) + "L";
  let atc_code = "AT" + Math.floor(Math.random() * 9000);

  function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const isAdmin = req.user.isAdmin;

  const codeType = req.params.codeType;

  if (isAdmin) {
    if (codeType === "tcc_code") {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            tcc_code,
            tcc_code_price: req.body.codePrice,
          },
        }
      );

      res.status(200).json("Updated tcc code Successfully");
    } else if (codeType === "imf_code") {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            imf_code,
            imf_code_price: req.body.codePrice,
          },
        }
      );

      res.status(200).json("Updated imf code Successfully");
    } else if (codeType === "tax_code") {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            tax_code,
            tax_code_price: req.body.codePrice,
          },
        }
      );

      res.status(200).json("Updated tax code Successfully");
    } else if (codeType === "atc_code") {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            atc_code,
            atc_code_price: req.body.codePrice,
          },
        }
      );

      res.status(200).json("Updated atc code Successfully");
    }
  }
});

const restrict = asyncHandler(async (req, res) => {
  const isAdmin = req.user.isAdmin;

  const id = req.params.id;

  const numberOfRestrictions = req.body.numberOfRestrictions;

  const data = parseInt(numberOfRestrictions);

  if (isAdmin) {
    if (data === 4) {
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            tcc_code_need: true,
            imf_code_need: true,
            tax_code_need: true,
            atc_code_need: true,
            restricted: true,
          },
        },
        { new: true, runValidators: true }
      );

      res.status(200).json("Updated Successfully");
    } else if (data == 3) {
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            tcc_code_need: true,
            imf_code_need: true,
            tax_code_need: true,
            restricted: true,
          },
        },
        { new: true, runValidators: true }
      );

      res.status(200).json("Updated Successfully");
    } else if (data == 2) {
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            tcc_code_need: true,
            tax_code_need: true,
            restricted: true,
          },
        },
        { new: true, runValidators: true }
      );
      res.status(200).json("Updated Successfully");
    } else if (data == 1) {
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            tcc_code_need: true,
            restricted: true,
          },
        },
        { new: true, runValidators: true }
      );
      res.status(200).json("Updated Successfully");
    }
  }
});

const updateTcc = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        tcc_code_need: false,
      },
    }
  );

  res.status(200).json("tcc updated");
});

const updateImf = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        imf_code_need: false,
      },
    }
  );

  res.status(200).json("imf updated");
});

const updateTax = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        tax_code_need: false,
      },
    }
  );

  res.status(200).json("tax updated");
});

const updateAtc = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        atc_code_need: false,
      },
    }
  );

  res.status(200).json("atc updated");
});

export {
  restrictedUsers,
  restrict,
  getCode,
  updateTcc,
  updateImf,
  updateTax,
  updateAtc,
};
