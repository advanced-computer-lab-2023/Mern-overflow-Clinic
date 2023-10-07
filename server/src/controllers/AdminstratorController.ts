import { Request, Response } from 'express';
import adminstrator from '../models/Adminstrator.js';


const createAdminstrator = async (req: Request, res: Response) => {
    //handle later-AUTH
    //const userName = req.params.userName;

    //admin.find(userName)
    req.body.username = "admin";
    req.body.passwordHash = "admin";
    const newAdminstrator = adminstrator.create()
        .then((newAdminstrator) => {
            res.status(200).json(newAdminstrator);
        })
        .catch((err) => {
            console.log("error");
            res.status(400).json(err);
        })
}

const readAdminstrator = async (req: Request, res: Response) => {
}

const updateAdminstrator = async (req: Request, res: Response) => {
}

const deleteAdmin= async(req:Request, res:Response)=>{
    const id = req.body.id;
    const newAdminstrator = adminstrator.findByIdAndDelete({_id: id})
    .then((newAdminstrator) => {
        res.status(200).json(newAdminstrator);
    })
    .catch((err) => {
        res.status(400).json(err);
    })
}

const handleDoctorRequest= async (req:Request, res:Response)=>{
    //changeed name to handle to accept or reject in one method based on a parameter
}

export default {
    createAdminstrator,
    readAdminstrator,
    updateAdminstrator,
    deleteAdmin,
    acceptDoctorRequest: handleDoctorRequest
}

