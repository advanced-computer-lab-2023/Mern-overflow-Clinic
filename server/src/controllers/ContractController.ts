import { Request, Response } from "express";
import adminstrator from "../models/Adminstrator.js";
import doctor from "../models/Doctor.js";
import contract from "../models/Contract.js";



const createContract = async (req: Request, res: Response) => {
    req.body.date = Date.now();
    req.body.admin = req.params.id;
    const newContract = contract
    .create(req.body)
    .then((newContract) => {
        res.status(200).json(newContract);
    })
    .catch((err) => {
        res.status(400).json(err);
    });
}

const readContract = async (req: Request, res: Response) => {
    const cId = req.params.id;
     const cont = await contract
        .findById(cId)
        .then((cont) => {
            if (!cont || cont === undefined) {
                return res.status(404).json({ message: 'Contract not found' });
            } else {
                res.status(200).json(cont);
            }
        }).catch((err) => {
            res.status(404).send(err);
        });
}

const updateContract = async (req: Request, res: Response) => {

}

const deleteContract = async (req: Request, res: Response) => {
    const id = req.params.id;
    const cont = contract
        .findByIdAndDelete({ _id: id })
        .then((cont) => {
        res.status(200).json(cont);
        })
        .catch((err) => {
        res.status(400).json(err);
        });
}

const listAllDoctorContracts = async (req: Request, res: Response) => {
    const contracts = contract
    .find({"doctor": req.params.id})
    .then((contracts) => res.status(200).json(contracts))
    .catch((err) => {
      res.status(400).json(err);
    });
}

export default {
    createContract,
    readContract,
    updateContract,
    deleteContract,
    listAllDoctorContracts,
}