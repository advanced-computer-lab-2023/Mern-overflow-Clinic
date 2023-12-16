import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import user from "../models/User.js";
import Contract from "../models/Contract.js";
import sendMailService from "../services/emails/sendMailService.js";
import NotificationController from "./NotificationController.js";
// import medicine from "../models/medicine.js";
import Prescription from "../models/Prescription.js";
import fs from 'fs';

const createDoctor = async (req: Request, res: Response) => {
	const data = req.body.datatoserver;
	console.log("DATA: " + JSON.stringify(data));
	const dataToServer = JSON.parse(data);
	console.log("im here");
	const entry = user
		.find({ username: dataToServer.username })
		.then((document) => {
			if (document.length === 0) {
				doctor.find({ email: dataToServer.email }).then((emailRes) => {
					if (emailRes.length !== 0)
						return res
							.status(404)
							.send("You are already registered , please sign in ");
					else {
						const files = req.files as Express.Multer.File[];
						console.log("Files:", files);
						console.log("additional Field: " + data);
						console.log("additional Field2: " + dataToServer.name);
						const documents = [];
						if (files !== undefined) {
							for (const file of files) {
								const fileInfo = {
									filename: file.originalname,
									path: file.path,
								};
								documents.push(fileInfo);
							}
						}
						console.log("DOCUMENTS: " + JSON.stringify(documents));
						dataToServer.status = "pending";

						dataToServer.files = documents;

						console.log("Modified Data:", JSON.stringify(dataToServer));
						const newDoctor = doctor
							.create(dataToServer)
							.then((newDoctor) => {
								newDoctor.wallet = 0;
								newDoctor.save();
								return res.status(200).json(newDoctor);
							})
							.catch((err) => {
								return res.status(400).json(err);
							});
					}
				});
			} else if (document.length !== 0)
				return res
					.status(400)
					.send("username taken , please choose another one ");
		});
};

const readDoctor = async (req: Request, res: Response) => {
	const pId = req.params.id;
	await doctor
		.findById(pId)
		.then((doc) => {
			if (!doc || doc === undefined) {
				return res.status(404).json({ message: "Doctor not found" });
			} else {
				return res.status(200).json(doc);
			}
		})
		.catch((err) => {
			return res.status(404).send(err);
		});
};

const isDoctorPending = async (req: Request, res: Response) => {
	const id = req.params.id;
	doctor
		.find({ _id: id, status: { $in: ["pending", "rejected"] } })
		.then((doc) => {
			if (doc.length === 0)
				return res
					.status(400)
					.send("doctor with this ID is not pending any more");
			else return res.status(200).json(doc);
		})
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const updateDoctor = async (req: Request, res: Response) => {
	const id = req.params.id;
	const query = { _id: id };
	const email = req.body.email;
	const hourlyRate = req.body.hourlyRate;
	const affiliation = req.body.affiliation;
	const update: { [key: string]: any } = {};

	if (email !== undefined) update["email"] = email;
	if (hourlyRate !== undefined) update["hourlyRate"] = hourlyRate;
	if (affiliation !== undefined) update["affiliation"] = affiliation;

	await doctor
		.findOneAndUpdate(query, update, { new: true })
		.then((updatedDoc) => {
			if (updatedDoc) {
				return res.status(200).send(updatedDoc);
			}
		})
		.catch((error) => {
			return res.status(400).send(error);
		});
};

const deleteDoctor = async (req: Request, res: Response) => {
	const id = req.params.id;
	await doctor
		.findByIdAndDelete({ _id: id })
		.then((doc) => {
			res.status(200).json(doc);
			// if(doc !==null){
			//   for(const file of doc.files){
			//       const filePath = `./src/uploads/` + file.filename;
			//       fs.unlink(filePath, (err) => {
			//           if (err) {
			//               console.error(err);
			//               return res.status(500).json({ message: "Error deleting file from server" });
			//            }
			//         })
			//       }
			//     }
		}
		)
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const listDoctors = async (req: Request, res: Response) => {
	await doctor
		.find({ status: "accepted" })
		.then((doctors) => res.status(200).json(doctors))
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const listPendingDoctors = async (req: Request, res: Response) => {
	await doctor
		.find({ status: "pending" })
		.then((doctors) => res.status(200).json(doctors))
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const listDoctorPatients = async (req: Request, res: Response) => {
	const id = req.params.id;

	const appointments = await appointment
		.find({ doctor: id })
		.populate("patient")
		.exec();

	console.log(id);

	console.log(appointments);
	const patientIds = appointments.map((appointment) => appointment.patient);
	const patients = await patient.find({ _id: { $in: patientIds } }).exec();

	return res.status(200).json(patients);
};

const listCompletedPatients = async (req: Request, res: Response) => {
	const id = req.params.id;

	const appointments = await appointment
		.find({ doctor: id, status: "completed" })
		.populate("patient")
		.exec();

	console.log(id);

	console.log(appointments);
	const patientIds = appointments.map((appointment) => appointment.patient);
	const patients = await patient.find({ _id: { $in: patientIds } }).exec();
	console.log(patients);
	return res.status(200).json(patients);
};

const selectPatient = async (req: Request, res: Response) => {
	const id = req.params.id;
	const pId = req.params.pId;

	const appointments = await appointment
		.find({ doctor: id })
		.populate("patient")
		.exec();

	const patientIds = appointments.map((appointment) => appointment.patient);

	const pat = await patient.findOne({ _id: pId }).exec();

	if (!pat) {
		return res.status(404).json({ message: "Patient not found" });
	} else {
		return res.status(200).json(pat);
	}
};

const listAllMyPatientsUpcoming = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		// Find all upcoming appointments for the doctor with the specified ID
		const upcomingAppointments = await appointment
			.find({ doctor: id, status: "upcoming" }) // Filter by date >= currentDate
			.populate("patient")
			.exec();

		if (!upcomingAppointments || upcomingAppointments.length === 0)
			return res.status(404).send("no upcoming appointments found");
		else {
			const patientIds = upcomingAppointments.map(
				(appointment) => appointment.patient,
			);

			const patients = await patient.find({ _id: { $in: patientIds } }).exec();

			return res.status(200).json(patients);
		}
	} catch (error) {
		return res.status(400).json(error);
	}
};

const listMyPatients = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		// Find all upcoming appointments for the doctor with the specified ID
		const appointments = await appointment
			.find({
				doctor: id,
				status: { $in: ["upcoming", "completed", "rescheduled"] },
			}) // Filter by date >= currentDate
			.populate("patient")
			.exec();

		if (appointments.length === 0)
			return res.status(404).send("no patients found");
		else {
			const patientIds = appointments.map((appointment) => appointment.patient);

			const patients = await patient.find({ _id: { $in: patientIds } }).exec();

			return res.status(200).json(patients);
		}
	} catch (error) {
		return res.status(400).json(error);
	}
};

const selectPatientByName = async (req: Request, res: Response) => {
	const id = req.params.id;
	const patientName = req.body.patientName.toLowerCase();
	var pIDs: any[] = [];
	var pats: any[] = [];
	try {
		const apts = await appointment.find({
			doctor: id,
			status: { $nin: ["canceled"] },
		});

		if (apts.length === 0) {
			return res.status(404).send("no appointments found");
		} else {
			for (const appoint of apts) {
				pIDs.push(appoint.patient);
			}

			const patients = await patient.find({ _id: { $in: pIDs } }).exec();

			for (const pat of patients) {
				if (pat.name.includes(patientName)) {
					pats.push(pat);
				}
			}

			if (pats.length === 0) {
				return res.status(404).send("no patients found");
			} else {
				return res.status(200).json(pats);
			}
		}
	} catch (err) {
		return res.status(400).json(err);
	}
};

const viewHealthRecordOfPatient = async (req: Request, res: Response) => {
	// assuming in Fe , doctorn gets a table that has all HIS patients and upon selecting a specific entry has the option to view health record of a patient with him

	const pid = req.params.id;
	await patient
		.findById(pid)
		.then((result) => {
			if (result != null) res.status(200).send(result.healthRecords);
			else res.status(404).send("no health records found ");
		})
		.catch((err) => res.status(400).send(err));
};

const viewWallet = async (req: Request, res: Response) => {
	const dId = req.params.id;

  await doctor
    .findById(dId)
    .then((doc) => {
      if (!doc || doc === undefined) {
        return res.status(404).json({ message: "Doctor not found" });
      } else {
        return res.status(200).json(doc.wallet);  
      }
    })
    .catch((err) => {
      return res.status(404).send(err);
    });
};

const addFreeSlots = async (req: Request, res: Response) => {
	// console.log(req.body);
	const id = req.params.id;
	let iDate = new Date(req.body.date);
	let userTimezoneOffset = iDate.getTimezoneOffset() * 60000;

	let utcDate = new Date(iDate.getTime() - userTimezoneOffset).toISOString();

	const startTime = utcDate;
	// let inputDate = utcDate;
	const currentTime = new Date();
	try {
		if (!startTime || startTime === undefined) {
			return res.status(401).json({ message: "You have not entered a date." });
		}
		const doc = await doctor.findById(id);

    if (!doc || doc === undefined) {
      console.log("LINE 351");
      return res.status(404).json({ message: "Doctor not found." });
    }

		if (doc.status !== "accepted") {
			return res
				.status(402)
				.json({ message: "You have not yet been accepted." });
		}

		const cont = await Contract.find({ doctor: id }).exec();
		if (!cont || cont === undefined) {
			console.log("LINE 363");
			return res.status(404).json({ message: "No contracts found, can't use this functionality." });
		}
		if (cont.length === 0) {
			console.log("LINE 367");
			return res.status(404).json({ message: "No contracts found, can't use this functionality." });
		}
		if (cont[0].status !== "accepted") {
			console.log("400");

      return res.status(400).json({message: "Doctor has not accepted the contract, can't add slots"});
    }

		if (doc.availableSlotsStartTime) {
			for (const dt of doc.availableSlotsStartTime) {
				if (dt.toISOString() === startTime) {
					console.log("403");

					return res
						.status(403)
						.json({ message: "This slot has already been added." });
				}
			}
		}
		if (startTime <= currentTime.toISOString()) {
			console.log("405");

			return res.status(405).json({ message: "You cannot use a past date." });
		}

		const appointments = await appointment.find({ doctor: id });

		const conflictingAppointments = [];
		for (const appointment of appointments) {
			const appointmentStartTime = appointment.date;
			const appointmentEndTime = new Date(
				appointmentStartTime.getTime() + appointment.duration * 60 * 1000,
			);

			if (
				startTime < appointmentEndTime.toISOString() &&
				startTime >= appointmentStartTime.toISOString()
			) {
				conflictingAppointments.push(appointment);
			}
		}

		if (conflictingAppointments.length !== 0) {
			console.log("406");

			return res.status(406).json({
				message: "You already have an appointment on that date and time",
			});
		}

		doc.availableSlotsStartTime?.push(new Date(startTime));

		// Save the updated doctor document
		const savedDoc = await doc.save();
		// Respond with the saved doctor document
		return res.status(200).json(savedDoc);
	} catch (err) {
		return res.status(500).send(err);
	}
};


const acceptContract = async (req: Request, res: Response) => {
	const docId = req.params.id;
	const contractId = req.body.contractId;
	console.log(req.body);
	const contracts = await Contract.find({ doctor: docId }).exec();
	if (contracts.length === 0 || contracts === undefined || !contracts) {
		return res
			.status(404)
			.json({ success: false, message: "No contracts found for this doctor." });
	}
	for (const contract of contracts) {
		if (
			contract._id.toString() === contractId &&
			contract.status === "pending"
		) {
			console.log("true");
			contract.status = "accepted";
			try {
				await contract.save();
				break;
			} catch (err) {
				// Handle the error, e.g., log or send an error response.
				console.error(err);
				return res
					.status(500)
					.json({ success: false, message: "Error saving the contract." });
			}
		}
	}
	console.log("200");
	return res
		.status(200)
		.json({ success: true, message: "Contract accepted successfully" });
};

const acceptFollowUp = async (req: Request, res: Response) => {
	try {
		const doctorId = req.params.id;
		const appointmentId = req.body.appointmentId;

		// Find the appointment for the given doctor ID
		const apt = await appointment.findById(appointmentId).exec();

		if (!apt) {
			return res.status(404).json({
				success: false,
				message: "No pending appointments found for this doctor.",
			});
		}

		// Update the status to "accepted"
		apt.followUpStatus = "accepted";

		// Save the updated appointment
		await apt.save();

		return res
			.status(200)
			.json({ success: true, message: "Appointment accepted successfully" });
	} catch (error) {
		console.error("Error accepting appointment:", error);
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const rejectFollowUp = async (req: Request, res: Response) => {
	try {
		const doctorId = req.params.id;
		const appointmentId = req.body.appointmentId;

		// Find the appointment for the given doctor ID
		const apt = await appointment.findById(appointmentId).exec();

		if (!apt) {
			return res.status(404).json({
				success: false,
				message: "No pending appointments found for this doctor.",
			});
		}

		// Update the status to "accepted"
		apt.followUpStatus = "rejected";

		// Save the updated appointment
		await apt.save();

		return res
			.status(200)
			.json({ success: true, message: "Appointment accepted successfully" });
	} catch (error) {
		console.error("Error accepting appointment:", error);
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

const rejectContract = async (req: Request, res: Response) => {
	const docId = req.params.id;
	const contractId = req.body.contractId;

	const contracts = await Contract.find({ doctor: docId }).exec();

	if (contracts.length === 0 || contracts === undefined || !contracts) {
		return res
			.status(404)
			.json({ success: false, message: "No contracts found for this doctor." });
	}

	for (const contract of contracts) {
		if (
			contract._id.toString() === contractId &&
			contract.status === "pending"
		) {
			contract.status = "rejected";
			try {
				await contract.save();
				break;
			} catch (err) {
				// Handle the error, e.g., log or send an error response.
				console.error(err);
				return res
					.status(500)
					.json({ success: false, message: "Error saving the contract." });
			}
		}
	}

	return res
		.status(200)
		.json({ success: true, message: "Contract accepted successfully" });
};

const listSlots = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("listSlots id: " + id);

  await doctor
    .findById(id)
    .then((doctors) => {
      if(doctors?.status === "accepted"){
        console.log(doctors.availableSlotsStartTime);

        res.status(200).json(doctors.availableSlotsStartTime);
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

const cancelPatientAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;
	const aptId = req.body.apt;
	console.log(req.body);
	try {
		// const apt = await appointment.find({doctor:Pid}).exec();
		const apt = await appointment.findById(aptId).exec()
		if (!apt) {
			return res.status(404).send("No appointments found");
		}
		if (apt.doctor.toString() === id) {
			// Update the appointment status to "canceled"
			apt.status = "cancelled";
			await apt.save(); // Save the changes to the database

			const patientEmail: string = await user.findById(apt.patient).then((pat) =>{
				console.log(pat?.email);
				return pat? pat.email:"";
			} 
			);
			const doctorEmail: string = await user.findById(apt.doctor).then((doc) => {
				console.log(doc?.email);
				return doc? doc.email:"";
			}
			);
			const subject = "Appointment Cncelled";
			let html = `Hello patient, <br /> your appointment was Cancelled with date ${req.body.date}. <br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(patientEmail, subject, html);
			html = `Hello doctor, <br /> your appointment was Cancelled with date ${req.body.date}. <br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(doctorEmail, subject, html);
			console.log("sending notification for appointmen: patient", req.body.patient, " | doctor", req.body.doctor);
			NotificationController.createNotificationwithId(apt.patient.toString(), "Your appointment is cancelled", "/patient/appointments");
			NotificationController.createNotificationwithId(apt.doctor.toString(), "Your appointment is cancelled", "/doctor/appointments");

			return res.status(200).json({ message: "Appointment canceled successfully" });
		} else {
			return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
		}
	} catch (error) {
		console.error("Error canceling appointment:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const chatWithPatients = async (req: Request, res: Response) => {
	console.log("In chat with patients");
	const dId = req.params.id;
	const search = req.params.search;

	if (!search) res.status(400).send("No search text.");
	else if (search !== undefined && search !== null && typeof search == "string") {
		const apts = await appointment.find({ doctor: dId });
		const patients: any[] = [];
		for (const apt of apts) {

			const pat = await patient.findById(apt.patient);



			if ((pat?.name)?.includes(search) && !patients.some(element => element.id === pat?.id)) patients.push(pat);
		}
		console.log(patients);
		res.status(200).send(patients);
	}

};

const reschedulePatientAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;
	const aptId = req.body.apt;

}

export default {
	createDoctor,
	readDoctor,
	updateDoctor,
	deleteDoctor,
	listDoctors,
	listDoctorPatients,
	selectPatient,
	selectPatientByName,
	listAllMyPatientsUpcoming,
	listMyPatients,
	viewHealthRecordOfPatient,
	viewWallet,
	addFreeSlots,
	acceptContract,
	rejectContract,
	listPendingDoctors,
	listSlots,
	listCompletedPatients,
	acceptFollowUp,
	rejectFollowUp,
	cancelPatientAppointment,
	chatWithPatients,
	reschedulePatientAppointment
};
