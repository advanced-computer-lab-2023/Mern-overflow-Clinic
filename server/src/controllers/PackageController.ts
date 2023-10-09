import { Request, Response } from "express";
import pack from "../models/Package.js";

const createPackage = async (req: Request, res: Response) => {
  try {
    const newPackage = await pack.create(req.body);

    let updatedPackage: any = newPackage; // Initialize with the newly created package

    if (req.body.name === "silver") {
      updatedPackage = await pack.findByIdAndUpdate(
        newPackage._id,
        {
          price: 3600,
          discountOnDoctorSessions: 40,
          discountOnMedicine: 20,
          discountForFamily: 10,
        },
        { new: true } // Return the updated package
      );
    } else if (req.body.name === "gold") {
      updatedPackage = await pack.findByIdAndUpdate(
        newPackage._id,
        {
          price: 6000,
          discountOnDoctorSessions: 60,
          discountOnMedicine: 30,
          discountForFamily: 15,
        },
        { new: true } // Return the updated package
      );
    } else if (req.body.name === "platinum") {
      updatedPackage = await pack.findByIdAndUpdate(
        newPackage._id,
        {
          price: 9000,
          discountOnDoctorSessions: 80,
          discountOnMedicine: 40,
          discountForFamily: 20,
        },
        { new: true } // Return the updated package
      );
    } else {
      pack.create(req.body).then(result => {
        res.status(200).send(result);
      }).catch(err => {
        res.status(400).send(err);
      }
      )
    }

    res.status(200).json(updatedPackage);
  } catch (err) {
    res.status(400).json(err);
  }
};


const listPackages = async (req: Request, res: Response) => {
  const pkjs = pack
    .find({})
    .then((pkjs) => res.status(200).json(pkjs))
    .catch((err) => {
      res.status(400).json(err);
    });
}
const readPackage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pkj = pack
    .findById(id)
    .then((pkj) => res.status(200).json(pkj))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updatePackage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = { _id: id };
  const type = req.body.type;
  const price = req.body.price;
  const discountOnDoctorSessions = req.body.discountOnDoctorSessions;
  const discountOnMedicine = req.body.discountOnMedicine;
  const discountForFamily = req.body.discountForFamily;

  const update: { [key: string]: any } = {};
  if (type !== undefined) update["type"] = type;
  if (price !== undefined) update["price"] = price;
  if (discountOnDoctorSessions !== undefined) update["discountOnDoctorSessions"] = discountOnDoctorSessions;
  if (discountOnMedicine !== undefined) update["discountOnMedicine"] = discountOnMedicine;
  if (discountForFamily !== undefined) update["discountForFamily"] = discountForFamily;

  pack
    .findOneAndUpdate(query, update, { new: true })
    .then((pkj) => {
      if (pkj) {
        res.status(200).send(pkj);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });

};

const deletePackage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pkg = pack
    .findByIdAndDelete({ _id: id })
    .then((pkg) => {
      res.status(200).json(pkg);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export default {
  createPackage,
  readPackage,
  updatePackage,
  deletePackage,
  listPackages
};
