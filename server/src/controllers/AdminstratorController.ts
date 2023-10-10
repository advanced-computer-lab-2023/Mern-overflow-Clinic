import { Request, Response } from "express";
import adminstrator from "../models/Adminstrator.js";
import doctor from "../models/Doctor.js";
import user from "../models/User.js";

const createAdminstrator = async (req: Request, res: Response) => {

	const newAdminstrator = adminstrator
		.create(req.body)
		.then((newAdminstrator) => {
			res.status(200).json(newAdminstrator);
		})
		.catch((err) => {
			//console.log("error");
			res.status(400).json(err);
		});
};

const readAdminstrator = async (req: Request, res: Response) => { };

const updateAdminstrator = async (req: Request, res: Response) => { };

const deleteAdmin = async (req: Request, res: Response) => {
	const id = req.params.id;
	const newAdminstrator = adminstrator
		.findByIdAndDelete({ _id: id })
		.then((newAdminstrator) => {
			res.status(200).json(newAdminstrator);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
};

// to be reviewed again -> ask details
const viewRequest = async (req: Request, res: Response) => {
	const doctors = doctor
		.find({})
		.then((doctors) => {
			var newDoctors = [];
			for (var i = 0; i < doctors.length; i++) {
				if (doctors[i].status === "pending") newDoctors.push(doctors[i]);
			}

			res.status(200).json(newDoctors);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
};

const handleDoctorRequest = async (req: Request, res: Response) => {
	//changeed name to handle to accept or reject in one method based on a parameter
};

const listAdminstrators = async (req: Request, res: Response) => {
	const adminstrators = adminstrator
		.find({})
		.then((doctors) => res.status(200).json(doctors))
		.catch((err) => {
			res.status(400).json(err);
		});
};


export default {
	createAdminstrator,
	readAdminstrator,
	updateAdminstrator,
	deleteAdmin,
	acceptDoctorRequest: handleDoctorRequest,
	viewRequest,
	listAdminstrators
};
