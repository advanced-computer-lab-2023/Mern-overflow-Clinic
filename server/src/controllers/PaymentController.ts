//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
//import {loadStripe} from '@stripe/stripe-js';
//const stripe = await loadStripe('sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO');

//export const stripe = new Stripe('sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO');
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import healthPackage from "../models/Package.js";
import PatientController from "./PatientController.js";

import { Request, Response } from "express";
import Stripe from "stripe";
import axios from "axios";
import Doctor from "../models/Doctor.js";
import { CompletionInfoFlags } from "typescript";
const stripe = new Stripe(
  "sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO"
);

const payCCAppointment = async (req: Request, res: Response) => {
  try {
    const appPrice = (await appointment.findById(req.body.appId))?.price; // price in pounds
    console.log("app price: "+appPrice);
    const appPriceIncents = appPrice ? appPrice * 100 : undefined;

    const dId = (await appointment.findById(req.body.appId))?.doctor;
    console.log("doctor id " + dId);
    const doc = await Doctor.findById(dId);
    console.log("doctor entry from appointment " + doc);
    if (appPrice !== undefined) {
      if (doc) {
        const update = {
          // Define the fields you want to update and their new values
          wallet:  doc.wallet + appPrice,
        };

        // Set options for the update
        const options = {
          new: true, // Return the updated document after the update
        };

        // Use findOneAndUpdate to find and update the document
        const filter = { _id: dId };
        const updateWallet = await Doctor.findOneAndUpdate(
          filter,
          update,
          options
        );
        console.log(updateWallet);
        console.log("CHANGED WALLET " + doc.wallet);
        console.log("New Doc Entry: "+await Doctor.findById(dId));
      }
    }
    const app = await appointment.findById(req.body.appId);

    const update = {
      // Define the fields you want to update and their new values
      paid: true,
    };

    // Set options for the update
    const options = {
      new: true, // Return the updated document after the update
    };

    // Use findOneAndUpdate to find and update the document
    const filter = { _id: req.body.appId };
    const updateWallet = await appointment.findOneAndUpdate(
      filter,
      update,
      options
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "EGP",
            product_data: {
              name: "AppointmnetFees",
              description: "Product Description",
            },
            unit_amount: appPrice != undefined ? appPrice * 100 : undefined,
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:3000/patient/appointments`,
      cancel_url: `http://localhost:3000/patient/appointments`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const payWalletAppointment = async (req: Request, res: Response) => {
  // assuming id of appointment comes from req.body but should come from fe entry click
  const appId = req.body.id;
  const appPrice = (await appointment.findById(appId))?.price;

  // TODO: Display these messages  in the fe
  // assumimg id of user is given through req.body
  //TODO:UPDATE ID to be taken from logined in session

  const pId = req.body.pId;

  const pat = await patient.findById(pId);
  const walletValue = pat?.wallet;
  if (appPrice != undefined && walletValue != undefined) {
    if (walletValue < appPrice) {
      res
        .status(400)
        .json(
          "Payment cannot be completed because credit not in wallet : Amount to be paid  " +
            appPrice +
            " current wallet balance " +
            walletValue
        );
    } else {
      const update = {
        // Define the fields you want to update and their new values
        wallet: walletValue && appPrice ? walletValue - appPrice : undefined,
      };

      // Set options for the update
      const options = {
        new: true, // Return the updated document after the update
      };

      // Use findOneAndUpdate to find and update the document
      const filter = { _id: pId };
      const updateWallet = await patient.findOneAndUpdate(
        filter,
        update,
        options
      );

      const newWallet =
        walletValue && appPrice ? walletValue - appPrice : undefined;
      const dId = (await appointment.findById(appId))?.doctor;
      const doc = await Doctor.findById(dId);
      if (doc) {
        const update = {
          // Define the fields you want to update and their new values
          wallet: doc.wallet && appPrice ? doc.wallet + appPrice : undefined,
        };

        // Set options for the update
        const options = {
          new: true, // Return the updated document after the update
        };

        // Use findOneAndUpdate to find and update the document
        const filter = { _id: dId };
        const updateWallet = await Doctor.findOneAndUpdate(
          filter,
          update,
          options
        );
      }

      res
        .status(200)
        .send("Payment successful , new wallet value :" + newWallet);
    }
  } else {
    if (!appPrice) res.status(404).send("appPrice is undefined");
    else res.status(404).send("wallet is undefined");
  }
};

const payCCHealthPackage = async (req: Request, res: Response) => {
  try {
    // assuming health pacakage id is given in req . body

    const id = req.body.id;
    const packageId = req.body.packageId;
    const famId = req.body.famId;

    console.log(
      "id is " + id + ", packageId is " + packageId + ", famId is " + famId
    );

    // const hPrice = (await healthPackage.findById(req.body.hpId))?.price; // price in pounds

    var hPackagePriceIncents;
    if (!famId)
      hPackagePriceIncents = await PatientController.getPackageDiscount(
        id,
        packageId
      );
    else
      hPackagePriceIncents = await PatientController.getPackageDiscount(
        famId,
        packageId
      );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "EGP",
            product_data: {
              name: "PackageSubscriptionFees",
              description: "Package Subscription",
            },
            unit_amount: hPackagePriceIncents * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:3000/patient/packages`,
      cancel_url: `http://localhost:3000/patient/packages`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.log("error:   : " + e);
    res.status(500).json(e);
  }
};

const payWalletHealthPackage = async (req: Request, res: Response) => {
  // assuming id of appointment comes from req.body but should come from fe entry click
  const id = req.body.id;
  const packageId = req.body.packageId;
  const famId = req.body.famId;

  console.log(
    "id is " + id + ", packageId is " + packageId + ", famId is " + famId
  );

  // TODO: Display these messages  in the fe
  // assumimg id of user is given through req.body
  //TODO:UPDATE ID to be taken from logined in session
  // const pId = req.body.pId;
  const pat = await patient.findById(id);
  const walletValue = pat?.wallet;
  console.log(pat?._id);
  console.log(walletValue);

  var hPackagePriceIncents;
  if (!famId)
    hPackagePriceIncents = await PatientController.getPackageDiscount(
      id,
      packageId
    );
  else
    hPackagePriceIncents = await PatientController.getPackageDiscount(
      famId,
      packageId
    );

  if (hPackagePriceIncents != undefined && walletValue != undefined) {
    if (walletValue < hPackagePriceIncents) {
      res
        .status(400)
        .json(
          "Payment cannot be completed because credit not in wallet : Amount to be paid  " +
            hPackagePriceIncents +
            " current wallet balance " +
            walletValue
        );
    } else {
      const update = {
        // Define the fields you want to update and their new values
        wallet:
          walletValue && hPackagePriceIncents
            ? walletValue - hPackagePriceIncents
            : undefined,
      };

      // Set options for the update
      const options = {
        new: true, // Return the updated document after the update
      };

      // Use findOneAndUpdate to find and update the document
      const filter = { _id: id };
      const updateWallet = await patient.findOneAndUpdate(
        filter,
        update,
        options
      );

      const newWallet =
        walletValue && hPackagePriceIncents
          ? walletValue - hPackagePriceIncents
          : undefined;
      res
        .status(200)
        .json("Payment successful , new wallet value :" + newWallet);
    }
  } else {
    if (!hPackagePriceIncents)
      res.status(404).send("health package price is undefined");
    else res.status(404).send("wallet is undefined");
  }
};
export default {
  payCCAppointment,
  payWalletAppointment,
  payCCHealthPackage,
  payWalletHealthPackage,
};
