import { Request, Response } from "express";
import pack from "../models/Package.js";



const createPackage = async (req: Request, res: Response) => {
  try {
    const newPackage = await pack.create(req.body);

    let updatedPackage:any = newPackage; // Initialize with the newly created package
    return res.status(200).json(updatedPackage);
  } catch (err) {
    return res.status(400).json(err);
  }
};


const listPackages = async (req: Request, res: Response) => {
  const pkjs = pack
    .find({})
    .then((pkjs) => res.status(200).json(pkjs))
    .catch((err) => {
return res.status(400).json(err);
    });
}


const readPackage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pkj = pack
    .findById(id)
    .then((pkj) => res.status(200).json(pkj))
    .catch((err) => {
return res.status(400).json(err);
    });
};

const updatePackage = async (req: Request, res: Response) => {
  // TODO refactor
  const id = req.params.id;
  const query = { _id: id };
  const name = req.body.name.toLowerCase();
  const price = req.body.price;
  const discountOnDoctorSessions = req.body.discountOnDoctorSessions;
  const discountOnMedicine = req.body.discountOnMedicine;
  const discountForFamily = req.body.discountForFamily;
  const subscriptionPeriod = req.body.subscriptionPeriod;

  const update: { [key: string]: any } = {};
  if (name !==undefined) update["name"] = name;
  if (price !==undefined) update["price"] = price;
  if (discountOnDoctorSessions !==undefined) update["discountOnDoctorSessions"] = discountOnDoctorSessions;
  if (discountOnMedicine !==undefined) update["discountOnMedicine"] = discountOnMedicine;
  if (discountForFamily !==undefined) update["discountForFamily"] = discountForFamily;
  if (subscriptionPeriod !==undefined) update["subscriptionPeriod"] = subscriptionPeriod;

  pack
    .findOneAndUpdate(query, update, { new: true })
    .then((pkj) => {
      if (pkj) {
        return res.status(200).send(pkj);
      }
    })
    .catch((error) => {
      return res.status(400).send(error);
    });

};


const deletePackage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pkg = pack
    .findByIdAndDelete({ _id: id })
    .then((pkg) => {
return res.status(200).json(pkg);
    })
    .catch((err) => {
return res.status(400).json(err);
    });
};

export default {
  createPackage,
  readPackage,
  updatePackage,
  deletePackage,
  listPackages
};
