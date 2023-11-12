import { Request, Response } from "express";
import adminstrator from "../models/Adminstrator.js";
import doctor from "../models/Doctor.js";
import user from "../models/User.js";


const createAdminstrator = async (req: Request, res: Response) => {

	//add another adminstrator with a set username and password
	// missing authentication part
	const entry = adminstrator.find({ 'username': req.body.username }).then((document) => {
		if (document.length === 0) {

			const newAdmin = adminstrator
				.create(req.body)
				.then((newAdmin) => {
return res.status(200).json(newAdmin);
				})
				.catch((err) => {
return res.status(400).json(err);
				});

		}
		else if (document.length !== 0)
return res.status(400).send("username taken , please choose another one ");
	})
}

const readAdminstrator = async (req: Request, res: Response) => { };

const updateAdminstrator = async (req: Request, res: Response) => { };

const deleteAdmin = async (req: Request, res: Response) => {
	const id = req.params.id;
	const newAdminstrator = adminstrator
		.findByIdAndDelete({ _id: id })
		.then((newAdminstrator) => {
return res.status(200).json(newAdminstrator);
		})
		.catch((err) => {
return res.status(400).json(err);
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

return res.status(200).json(newDoctors);
		})
		.catch((err) => {
return res.status(400).json(err);
		});
};

const handleDoctorRequest = async (req: Request, res: Response) => {
	//changeed name to handle to accept or reject in one method based on a parameter
};

const listAdminstrators = async (req: Request, res: Response) => {
	const adminstrators = adminstrator
		.find({})
		.then((admns) => res.status(200).json(admns))
		.catch((err) => {
return res.status(400).json(err);
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
