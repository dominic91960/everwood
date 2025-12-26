import { Request, Response, NextFunction } from "express";
import PaymentSetting from "../models/payment-setting";

const getPaymentSettings = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let settings = await PaymentSetting.findOne();
    if (!settings)
      settings = await PaymentSetting.create({
        cardPayment: { enabled: true },
        cod: { enabled: false, title: "Cash on Delivery", description: "" },
        bankTransfer: { enabled: false, availableAccounts: [] },
        shippingFee: 0,
      });

    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};

const updatePaymentSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bankTransferEnabled, codEnabled, cardPaymentEnabled, shippingFee } =
      req.body;
    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      {},
      {
        $set: {
          "bankTransfer.enabled": bankTransferEnabled,
          "cod.enabled": codEnabled,
          "cardPayment.enabled": cardPaymentEnabled,
          shippingFee,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSettings)
      return res.status(500).json({
        message: "Failed to update payment settings",
      });

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

const addBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountNumber, accountHolderName, bankName, branchName } = req.body;

    const newAccount = {
      accountNumber,
      accountHolderName,
      bankName,
      branchName,
    };
    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      {
        "bankTransfer.availableAccounts.accountNumber": { $ne: accountNumber },
        "bankTransfer.availableAccounts.bankName": { $ne: bankName },
      },
      {
        $push: { "bankTransfer.availableAccounts": newAccount },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSettings)
      return res.status(409).json({
        message: "Bank account already exists",
      });

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

const updateBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { accountNumber, accountHolderName, bankName, branchName } = req.body;
    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      { "bankTransfer.availableAccounts._id": id },
      {
        $set: {
          "bankTransfer.availableAccounts.$.accountNumber": accountNumber,
          "bankTransfer.availableAccounts.$.accountHolderName":
            accountHolderName,
          "bankTransfer.availableAccounts.$.bankName": bankName,
          "bankTransfer.availableAccounts.$.branchName": branchName,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSettings)
      return res.status(404).json({
        message: "Bank account not found",
      });

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

const deleteBankAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const settings = await PaymentSetting.findOne();
    if (!settings)
      return res.status(404).json({
        message: "Bank account not found",
      });

    const accounts = settings.bankTransfer.availableAccounts;
    if (accounts.length <= 1)
      return res.status(400).json({
        message: "Cannot delete the last remaining bank account",
      });

    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      { "bankTransfer.availableAccounts._id": id },
      { $pull: { "bankTransfer.availableAccounts": { _id: id } } },
      { new: true }
    );
    if (!updatedSettings)
      return res.status(404).json({
        message: "Bank account not found",
      });

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

const updateCodDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const updatedSettings = await PaymentSetting.findOneAndUpdate(
      {},
      {
        $set: {
          "cod.title": title,
          "cod.description": description,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSettings)
      return res.status(500).json({
        message: "Failed to update COD details",
      });

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

export {
  getPaymentSettings,
  updatePaymentSettings,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  updateCodDetails,
};
