import { Request, Response } from "express";
import pack from "../models/Package.js";

const createPackage = async (req: Request, res: Response) => {
  const newPack = pack
    .create(req.body)
    .then((newPack) => {
      res.status(200).json(newPack);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};

const readPackage = async (req: Request, res: Response) => {};

const updatePackage = async (req: Request, res: Response) => {};

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
};
