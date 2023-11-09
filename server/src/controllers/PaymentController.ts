//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
//import {loadStripe} from '@stripe/stripe-js';
//const stripe = await loadStripe('sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO');

//export const stripe = new Stripe('sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO');
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import healthPackage from "../models/Package.js";


import { Request, Response } from "express";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51O9bKeHqEqnZHrbzSpBS6JOvMryqZfvDolGqcPDOb19E9gXdSe3rKy5UbUgCOmqLVFyHxn1U0Fp7G3IFujKuYhn500g0lhxoDO');




const payCCAppointment = async (req: Request, res: Response) =>
{
  try
  {
    const appPrice = (await appointment.findById(req.body.appId))?.price; // price in pounds 
    
    const appPriceIncents = appPrice ? (appPrice *100) : undefined;

       const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
         line_items:
      [
  {
    price_data: {
      currency: 'EGP',
      product_data: {
        name: 'AppointmnetFees',
        description: 'Product Description',
      },
      unit_amount: appPrice!=undefined?appPrice*100:undefined,
    },
    quantity: 1,
             },
             
] ,
        
       
      success_url: `http://localhost:3000/patient/apppointments`,
      cancel_url: `http://localhost:3000/patient/apppointments`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json(e);
  }
  
}

const payWalletAppointment = async (req: Request, res: Response) => {
  // assuming id of appointment comes from req.body but should come from fe entry click
  const appId = req.body.id;
  const appPrice = (await appointment.findById(appId))?.price;

  // TODO: Display these messages  in the fe
  // assumimg id of user is given through req.body
  //TODO:UPDATE ID to be taken from logined in session
  const pId = req.body.pId;
  const pat = await patient.findById(pId);
  const walletValue = (pat)?.wallet;
  if (appPrice!=undefined && walletValue!=undefined)
  {
    if (walletValue < appPrice) {
      res.status(400).json("Payment cannot be completed because credit not in wallet : Amount to be paid  " + appPrice + " current wallet balance " + walletValue);
    }
    else
    {
      const update = {
        // Define the fields you want to update and their new values
        wallet: walletValue && appPrice? (walletValue - appPrice):undefined,

      };

      // Set options for the update
      const options = {
        new: true, // Return the updated document after the update
      };

      // Use findOneAndUpdate to find and update the document
      const filter = { _id: pId };
      const updateWallet = await patient.findOneAndUpdate(filter, update, options);
		
      const newWallet = walletValue && appPrice ? (walletValue - appPrice) : undefined;
      res.status(200).json("Payment successful , new wallet value :" + newWallet);
    }
  }
  else {
    if(!appPrice)
      res.status(404).send("appPrice is undefined")
    else
      res.status(404).send("wallet is undefined")

  }
}




const payCCHealthPackage = async (req: Request, res: Response) =>
{
  try
  {
    /// assuming health pacakage id is given in req . body 
    const hPrice = (await healthPackage.findById(req.body.hPId))?.price; // price in pounds 
    
    const hPackagePriceIncents = hPrice ? (hPrice *100) : undefined;

       const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
         line_items:
      [
  {
    price_data: {
      currency: 'EGP',
      product_data: {
        name: 'AppointmnetFees',
        description: 'Product Description',
      },
      unit_amount: hPrice!=undefined?hPrice*100:undefined,
    },
    quantity: 1,
             },
             
] ,
        
       
      success_url: `http://localhost:3000/patient/apppointments`,
      cancel_url: `http://localhost:3000/patient/apppointments`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json(e);
  }
  
}
const payWalletHealthPackage= async (req: Request, res: Response) => {
  // assuming id of appointment comes from req.body but should come from fe entry click
  const hpid = req.body.HPId;
  const hPrice = (await healthPackage.findById(hpid))?.price;

  // TODO: Display these messages  in the fe
  // assumimg id of user is given through req.body
  //TODO:UPDATE ID to be taken from logined in session
  const pId = req.body.pId;
  const pat = await patient.findById(pId);
  const walletValue = (pat)?.wallet;
  console.log(pat?._id);
  console.log(walletValue);
  if (hPrice!=undefined && walletValue!=undefined)
  {
    if (walletValue < hPrice) {
      res.status(400).json("Payment cannot be completed because credit not in wallet : Amount to be paid  " + hPrice + " current wallet balance " + walletValue);
    }
    else
    {
      const update = {
        // Define the fields you want to update and their new values
        wallet: walletValue && hPrice? (walletValue - hPrice):undefined,

      };

      // Set options for the update
      const options = {
        new: true, // Return the updated document after the update
      };

      // Use findOneAndUpdate to find and update the document
      const filter = { _id: pId };
      const updateWallet = await patient.findOneAndUpdate(filter, update, options);
		
      const newWallet = walletValue && hPrice ? (walletValue - hPrice) : undefined;
      res.status(200).json("Payment successful , new wallet value :" + newWallet);
    }
  }
  else {
    if(!hPrice)
      res.status(404).send("appPrice is undefined")
    else
      res.status(404).send("wallet is undefined")

  }
}
export default
  {
    payCCAppointment,
    payWalletAppointment,
    payCCHealthPackage,
    payWalletHealthPackage

  
}