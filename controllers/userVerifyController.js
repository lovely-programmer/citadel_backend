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
  let cot_code = ALBET + Math.floor(Math.random() * 9000) + "L";
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
    } else if (codeType === "cot_code") {
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            cot_code,
            cot_code_price: req.body.codePrice,
          },
        }
      );

      res.status(200).json("Updated cot code Successfully");
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
  if (isAdmin) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          restricted: true,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("User Restricted");
  }
});

const unRestrict = asyncHandler(async (req, res) => {
  const isAdmin = req.user.isAdmin;

  const id = req.params.id;
  if (isAdmin) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          restricted: false,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("User Unrestricted");
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

const updateCot = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        cot_code_need: false,
      },
    }
  );

  res.status(200).json("cot updated");
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
  unRestrict,
  getCode,
  updateTcc,
  updateImf,
  updateCot,
  updateAtc,
};
