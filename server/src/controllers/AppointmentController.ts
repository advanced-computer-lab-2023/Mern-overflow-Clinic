import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";
import Users from "../models/User.js";
import { stat } from "fs";
import dayjs from "dayjs";
import Doctor from "../models/Doctor.js";
import sendMailService from "../services/emails/sendMailService.js";
import NotificationController from "./NotificationController.js";
import Package from "../models/Package.js";
import axios from "axios";

const createAppointment = async (req: Request, res: Response) => {
	//console.log("HELLO ");
	req.body.duration = 1;
	req.body.status = "upcoming";
	req.body.appointmentType = "regular";

	console.log("HI HI please print");
	console.log("REQ BODY: " + req.body);

	//req.body.paid = false;
	req.body.price = (await Doctor.findById(req.body.dId))?.hourlyRate;

	const patientEmail = await Users.findById(req.body.patient).then(
		(pat) => pat?.email,
	);
	const doctorEmail = await Users.findById(req.body.doctor).then(
		(doc) => doc?.email,
	);

	if (patientEmail === undefined || doctorEmail === undefined) {
		return res.status(400).json();
	}
	//console.log("BODY  ========" + req.body);
	//console.log("DOCTOR ID" + req.body.dId);
	const newApt = appointment
		.create(req.body)
		.then((newApt) => {
			const subject = "Appointment Booked";
			let html = `Hello patient, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(patientEmail, subject, html);
			html = `Hello doctor, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(doctorEmail, subject, html);
			return res.status(200).json(newApt);
		})
		.catch((err) => {
			console.log("error::::  " + err);
			return res.status(400).json(err);
		});
};










const createAppointmentForFamilyMember = async (
	req: Request,
	res: Response,
) => {
	try {
		//console.log(req.body);
		const docID = req.body.doctor;
		console.log("DOC ID: " + docID);
		console.log("rate: " + ((await Doctor.findById(docID))?.hourlyRate));
		req.body.duration = 1;
		req.body.status = "upcoming";
		req.body.appointmentType = "regular";
		const id = req.params.id;
		const flag = req.body.flag;
		const relation = req.body.relation;
		console.log("APP for family member");

		if (flag) {
			//console.log(req.body);
			req.body.patient = req.body.relativeId;

			// Get the doctor and remove the date from availableStartTimeSlots
			const doctorObj = await doctor.findById(docID);
			if (!doctorObj || doctorObj === undefined) {
				return res.status(404).json({ message: "Doctor not found" });
			}
			req.body.price = doctorObj.hourlyRate * 1;
			const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

			// Assuming availableStartTimeSlots is an array of Date objects
			if (doctorObj.availableSlotsStartTime !== undefined) {
				doctorObj.availableSlotsStartTime =
					doctorObj.availableSlotsStartTime.filter(
						(slot) => slot.toDateString() !== dateToRemove,
					);
			}

			// Update the doctor in the database
			await doctor.findByIdAndUpdate(docID, {
				$set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
			});

			const patientEmail = await Users.findById(req.body.patient).then(
				(pat) => pat?.email,
			);
			const doctorEmail = await Users.findById(req.body.doctor).then(
				(doc) => doc?.email,
			);

			if (patientEmail === undefined || doctorEmail === undefined) {
				return res.status(400).json();
			}

			// req.body.price =  (await Doctor.findById(docID))?.hourlyRate;


			req.body.price = doctorObj.hourlyRate * 1;
			console.log("APT details: " + JSON.stringify(req.body));
			// Create the new appointment

			const newApt = await appointment.create(req.body);
			const subject = "Appointment Booked";
			let html = `Hello patient, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(patientEmail, subject, html);
			html = `Hello doctor, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(doctorEmail, subject, html);
			console.log("sending notification for appointmen: patient", req.body.patient, " | doctor", req.body.doctor);
			NotificationController.createNotificationwithId(req.body.patient, "You have a new appointment", "/patient/appointments");
			NotificationController.createNotificationwithId(req.body.doctor, "You have a new appointment", "/doctor/appointments");
			return res.status(200).json(newApt);
		} else {


			// const pId = id;
			// const patientFound = await Patient.findById(pId);
			// var docSessDisc = 0; 
			// const doctors = await doctor.findById(docID);

			// if (patientFound?.package !== undefined) {
			//     const packageId = patientFound.package;
			//     const packageData = await Package.findById(packageId);


			//     let sessionPrice = 0;

			//     if (packageData) {
			//         docSessDisc = (packageData.discountOnDoctorSessions / 100) * (doctors?.hourlyRate);
			//     }
			//     sessionPrice = doctors?.hourlyRate? + (0.1 * doctors?.hourlyRate) - docSessDisc:Number;

			// } 
			// else {
			//   let sessionPrice = 0;
			//   sessionPrice = doctors?.hourlyRate? + (0.1 * doctors?.hourlyRate) - docSessDisc;    
			// }




			req.body.patient = id;
			console.log(req.body);

			const doctorObj = await doctor.findById(docID);
			if (!doctorObj || doctorObj === undefined) {
				return res.status(404).json({ message: "Doctor not found" });
			}

			const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

			// Assuming availableStartTimeSlots is an array of Date objects
			if (doctorObj.availableSlotsStartTime !== undefined) {
				doctorObj.availableSlotsStartTime =
					doctorObj.availableSlotsStartTime.filter(
						(slot) => slot.toDateString() !== dateToRemove,
					);
			}

			// Update the doctor in the database
			await doctor.findByIdAndUpdate(docID, {
				$set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
			});
			const patientEmail = await Users.findById(req.body.patient).then(
				(pat) => pat?.email,
			);
			const doctorEmail = await Users.findById(req.body.doctor).then(
				(doc) => doc?.email,
			);

			if (patientEmail === undefined || doctorEmail === undefined) {
				return res.status(400).json();
			}
			// Create the new appointment
			req.body.price = doctorObj.hourlyRate * 1;
			console.log("APT details: " + JSON.stringify(req.body));
			const newApt = await appointment.create(req.body);
			const subject = "Appointment Booked";
			let html = `Hello patient, <br /> A new appointment was booked with date ${req.body.date}. <br /> Please be on time. <br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(patientEmail, subject, html);
			html = `Hello doctor, <br /> A new appointment was booked with date ${req.body.date}. <br /> Please be on time. <br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(doctorEmail, subject, html);
			console.log("sending notification for appointmen: patient", req.body.patient, " | doctor", req.body.doctor);
			NotificationController.createNotificationwithId(req.body.patient, "You have a new appointment", "/patient/appointments");
			NotificationController.createNotificationwithId(req.body.doctor, "You have a new appointment", "/doctor/appointments");
			return res.status(200).json(newApt);
		}
	} catch (err) {
		console.error(err);
		return res.status(400).json(err);
	}
};

// const createAppointmentForFamilyMember = async (req: Request, res: Response) => {
//   req.body.duration = 1;
//   req.body.status = "upcoming";
//   req.body.type = "regular";
//   const id = req.params.id; // patient name;
//   const flag = req.body.flag;
//   const relativeId = req.body.relativeId;

//   // Set patient field based on flag and relativeId
//   req.body.patient = flag ? relativeId : id;

//   try {
//     const newApt = await appointment.create(req.body);
//     res.status(200).json(newApt);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json(err);
//   }
// };

const createFollowUp = async (req: Request, res: Response) => {
	req.body.doctor = req.params.id;
	req.body.price = 0;
	req.body.duration = 1;
	req.body.status = "upcoming";
	req.body.appointmentType = "followup";
	req.body.followUpStatus = "accepted";
	console.log(req.body);
	// 1. Extract the patient's email from req.body
	const patientEmail = req.body.email;

	let iDate = new Date(req.body.date);
	let userTimezoneOffset = iDate.getTimezoneOffset() * 60000;

	let utcDate = new Date(iDate.getTime() - userTimezoneOffset).toISOString();

	req.body.date = utcDate;

	// 2. Search for the patient with the given email in your database
	Patient.findOne({ email: patientEmail })
		.then((patient) => {
			console.log("getting patient");
			if (!patient) {
				console.log("error here");
				return res.status(404).json({ message: "Patient not found" });
			}
			console.log(patient._id);
			// 3. If a patient with that email is found, set req.body.patient to the _id of the patient
			req.body.patient = patient._id;

			// 4. Create the follow-up appointment using the updated req.body
			appointment
				.create(req.body)
				.then((newApt) => {
					console.log("success");
					return res.status(200).json(newApt);
				})
				.catch((err) => {
					console.log("error");
					return res.status(400).json(err);
				});
		})
		.catch((err) => {
			console.log("error");
			return res.status(400).json(err);
		});
};




// const createAppointmentForFamilyMember = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     //console.log(req.body);
//     const docID = req.body.doctor;
//     req.body.duration = 1;
//     req.body.status = "upcoming";
//     req.body.appointmentType = "regular";
//     const id = req.params.id;
//     const flag = req.body.flag;
//     const relation = req.body.relation;

//     if (flag) {
//       //console.log(req.body);
//       req.body.patient = req.body.relativeId;

//       // Get the doctor and remove the date from availableStartTimeSlots
//       const doctorObj = await doctor.findById(docID);
//       if (!doctorObj || doctorObj === undefined) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }
//       req.body.price = doctorObj.hourlyRate * 1;
//       const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

//       // Assuming availableStartTimeSlots is an array of Date objects
//       if (doctorObj.availableSlotsStartTime !== undefined) {
//         doctorObj.availableSlotsStartTime =
//           doctorObj.availableSlotsStartTime.filter(
//             (slot) => slot.toDateString() !== dateToRemove
//           );
//       }

//       // Update the doctor in the database
//       await doctor.findByIdAndUpdate(docID, {
//         $set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
//       });

//       // Create the new appointment
//       const newApt = await appointment.create(req.body);
//       return res.status(200).json(newApt);
//     } else {
//       req.body.patient = id;
//       console.log(req.body);

//       const doctorObj = await doctor.findById(docID);
//       if (!doctorObj || doctorObj === undefined) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

//       // Assuming availableStartTimeSlots is an array of Date objects
//       if (doctorObj.availableSlotsStartTime !== undefined) {
//         doctorObj.availableSlotsStartTime =
//           doctorObj.availableSlotsStartTime.filter(
//             (slot) => slot.toDateString() !== dateToRemove
//           );
//       }

//       // Update the doctor in the database
//       await doctor.findByIdAndUpdate(docID, {
//         $set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
//       });

//       // Create the new appointment
//       const newApt = await appointment.create(req.body);
//       return res.status(200).json(newApt);
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json(err);
//   }
// };
const requestFollowUp = async (req: Request, res: Response) => {
	try {
		const docID = req.body.doctor;
		req.body.duration = 1;
		req.body.status = "upcoming";
		req.body.appointmentType = "followup";
		const id = req.params.id;
		const flag = req.body.flag;
		const relation = req.body.relation;
		let iDate = new Date(req.body.date);
		let userTimezoneOffset = iDate.getTimezoneOffset() * 60000;

		let utcDate = new Date(iDate.getTime() - userTimezoneOffset).toISOString();

		//req.body.date = utcDate;
		if (flag) {
			req.body.patient = req.body.relativeId;
			// Get the doctor and remove the date from availableStartTimeSlots
			const doctorObj = await doctor.findById(docID);

			if (!doctorObj || doctorObj === undefined) {
				return res.status(404).json({ message: "Doctor not found" });
			}
			req.body.price = doctorObj.hourlyRate * 1;
			const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

			// Assuming availableStartTimeSlots is an array of Date objects
			if (doctorObj.availableSlotsStartTime !== undefined) {
				doctorObj.availableSlotsStartTime =
					doctorObj.availableSlotsStartTime.filter(
						(slot) => slot.toDateString() !== dateToRemove
					);
			}
			// Update the doctor in the database
			await doctor.findByIdAndUpdate(docID, {
				$set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
			});

			// Create the new appointment
			const newApt = await appointment.create(req.body);
			// console.log(newApt)
			return res.status(200).json(newApt);

		} else {
			req.body.patient = id;
			//console.log(req.body);

			const doctorObj = await doctor.findById(docID);
			if (!doctorObj || doctorObj === undefined) {
				return res.status(404).json({ message: "Doctor not found" });
			}

			const dateToRemove = new Date(req.body.date).toDateString(); // Convert to string

			// Assuming availableStartTimeSlots is an array of Date objects
			if (doctorObj.availableSlotsStartTime !== undefined) {
				doctorObj.availableSlotsStartTime =
					doctorObj.availableSlotsStartTime.filter(
						(slot) => slot.toDateString() !== dateToRemove
					);
			}

			// Update the doctor in the database
			await doctor.findByIdAndUpdate(docID, {
				$set: { availableSlotsStartTime: doctorObj.availableSlotsStartTime },
			});

			// Create the new appointment
			const newApt = await appointment.create(req.body);
			return res.status(200).json(newApt);
		}

	} catch (err) {
		console.error(err);
		return res.status(400).json(err);
	}
}






const readAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;

	console.log("Appointment print" + id);
	let today = new Date();
	const apt = appointment
		.find({ patient: id })
		.populate({ path: "doctor", select: "name" })
		.populate({ path: "patient", select: "name" })
		.then((apt) => {
			return res.status(200).json(apt);
		})
		.catch((err) => {
			return res.status(400).json(err);
		});
};




const changeToPastAppointment = async (req: Request, res: Response) => {
	try {
		const currentDate = new Date();
		const filter = {
			date: { $lt: currentDate },
			status: 'upcoming'
		};

		const update = {
			$set: { status: 'completed' }
		};
		const result = await appointment.updateMany(filter, update);

		res.status(200).json(result);

	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};


// const updateAppointment = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const today = new Date();

//   const apt = await appointment
//     .findById({id})
//     .then((apt) => {
//       try {
//         for (const apt of appointment) {
//           const appointmentDate = new Date(apt.date);
//           const today = new Date();

//           if (appointmentDate < today && apt.status !== "completed") {
//             apt.status = "completed";
//             await apt.save();
//           }
//         }
//       catch (err) {
//         res.status(500).json({ message: 'Internal server error' });
//       }
//     })
// };
const updateAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const appointments = await appointment.find({});

		for (const apt of appointments) {
			const appointmentDate = new Date(apt.date);
			const today = new Date();

			if (appointmentDate < today && apt.status !== "completed") {
				apt.status = "completed";
				await apt.save();
			}
		}

		return res
			.status(200)
			.json({ message: "Appointments updated successfully" });
	} catch (err) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

const deleteAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;
	const apt = appointment
		.findByIdAndDelete({ _id: id })
		.then((apt) => {
			return res.status(200).json(apt);
		})
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const listAllAppointments = async (req: Request, res: Response) => {
	const apt = appointment
		.find({})
		.populate({ path: "doctor", select: "name" })
		.populate({ path: "patient", select: "name" })
		.then((apt) => res.status(200).json(apt))
		.catch((err) => {
			return res.status(400).json(err);
		});
};

const filterAppointments = async (req: Request, res: Response) => {
	const status = req.body.status;
	const id = req.params.id;
	var doc;

	const pat = await Patient.findById(id).exec();
	if (!pat || pat === undefined) {
		//return res.status(404).send("no user found");
		doc = await doctor.findById(id).exec();
		if (!doc || doc === undefined) {
			return res.status(404).send("no user found with this ID");
		}
	}

	if (
		(req.body.date !== undefined && status !== undefined) ||
		(req.body.date && status)
	) {
		// const iDate = dayjs(req.body.date, 'MM/DD/YYYY hh:mm A').toDate();
		// const inputDate = dayjs(iDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		let iDate = new Date(req.body.date);
		let userTimezoneOffset = iDate.getTimezoneOffset() * 60000;

		let utcDate = new Date(iDate.getTime() - userTimezoneOffset).toISOString();

		let inputDate = utcDate;

		if (pat) {
			const apt = appointment
				.find({ date: inputDate, status: status, patient: id })
				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					console.log(apt);
					res.status(200).json(apt);
				})
				.catch((err) => {
					res.status(400).json(err);
				});
			//console.log(apt);
		} else {
			const apt = appointment
				.find({ date: inputDate, status: status, doctor: id })
				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					console.log(apt);
					res.status(200).json(apt);
				})
				.catch((err) => {
					return res.status(400).json(err);
				});
		}
	}
	if (
		(req.body.date !== undefined && status === undefined) ||
		(req.body.date && !status)
	) {
		let iDate = new Date(req.body.date);
		let userTimezoneOffset = iDate.getTimezoneOffset() * 60000;

		let utcDate = new Date(iDate.getTime() - userTimezoneOffset).toISOString();

		let inputDate = utcDate;
		if (pat) {
			const apt = appointment
				.find({ date: inputDate, patient: id })

				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					res.status(200).json(apt);
				})
				.catch((err) => {
					res.status(400).json(err);
				});
		} else {
			const apt = appointment
				.find({ date: inputDate, doctor: id })

				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					return res.status(200).json(apt);
				})
				.catch((err) => {
					return res.status(400).json(err);
				});
		}
	}
	if (
		(req.body.date === undefined && status !== undefined) ||
		(!req.body.date && status)
	) {
		if (pat) {
			const apt = appointment
				.find({ status: status, patient: id })

				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					res.status(200).json(apt);
				})
				.catch((err) => {
					res.status(400).json(err);
				});
		} else {
			const apt = appointment
				.find({ status: status, doctor: id })

				.populate({ path: "doctor", select: "name" })
				.populate({ path: "patient", select: "name" })
				.then((apt) => {
					return res.status(200).json(apt);
				})
				.catch((err) => {
					return res.status(400).json(err);
				});
		}
	}
};

const rescheduleAppointment = async (req: Request, res: Response) => {
	console.log(`hereee`);

	const id = req.params.id;
	const newDate = new Date(req.body.date);

	console.log(`apt id = ${id}`);
	try {

		//var apt=null; 
		const apt = await appointment.findById(id).exec();


		if (!apt || apt === undefined) {
			return res.status(404).send("No appointments found");
		}
		console.log("found apt");

		const oldDate = new Date(apt.date);
		const docId = apt.doctor;
		const foundDoc = await doctor.findById(docId).exec();

		if (!foundDoc) {
			return res.status(404).send("Doctor not found");
		}
		if (apt.status === "upcoming" && apt.appointmentType === "regular") {
			if (foundDoc.availableSlotsStartTime && foundDoc.availableSlotsStartTime.length > 0) {
				const isDateAvailable = foundDoc.availableSlotsStartTime.some((slot) => {
					// Compare date strings without milliseconds
					return slot.toDateString() === newDate.toDateString();
				});

				if (isDateAvailable) {
					// Remove the date from available slots
					foundDoc.availableSlotsStartTime = foundDoc.availableSlotsStartTime.filter(
						(slot) => slot.toISOString().split(".")[0] !== newDate.toISOString().split(".")[0]
					);

					foundDoc.availableSlotsStartTime.push(oldDate);
					// Update the doctor's available slots
					await doctor.findByIdAndUpdate(docId, {
						$set: { availableSlotsStartTime: foundDoc.availableSlotsStartTime },
					});

					if (isDateAvailable) {
						// Remove the date from available slots
						foundDoc.availableSlotsStartTime = foundDoc.availableSlotsStartTime.filter(
							(slot) => slot.toISOString().split(".")[0] !== newDate.toISOString().split(".")[0]
						);

						// Update the doctor's available slots
						await doctor.findByIdAndUpdate(docId, {
							$set: { availableSlotsStartTime: foundDoc.availableSlotsStartTime },
						});

						// Update the appointment details
						apt.date = newDate;
						apt.status = "rescheduled";

						// Save the updated appointment
						await apt.save();

						 const patientEmail: string = await Users.findById(apt.patient).then((pat) => {
						 	console.log(pat?.email);
						 	return pat ? pat.email : "";
						 }
						 );
						 const doctorEmail: string = await Users.findById(apt.doctor).then((doc) => {
						 	console.log(doc?.email);
						 	return doc ? doc.email : "";
						 }
						 );

						  const subject = "Appointment Resceduled";
						  let html = `Hello patient, \n your appointment was resceduled with date ${newDate}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
						  sendMailService.sendMail(patientEmail, subject, html);
						  html = `Hello doctor, \n your appointment was resceduled with date ${newDate}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
						  sendMailService.sendMail(doctorEmail, subject, html);
						  NotificationController.createNotificationwithId(apt.patient.toString(), "Your appointment is rescheduled", "/patient/appointments");
						  NotificationController.createNotificationwithId(apt.doctor.toString(), "Your appointment is rescheduled", "/doctor/appointments");

						return res.status(200).json({ message: "Appointment rescheduled successfully", appointment: apt });
					} else {
						return res.status(404).send("This date is not in the available slots of the doctor");
					}
				} else {
					return res.status(404).send("No available slots for the doctor");
				}
			}

			return res.status(404).send("Cannot reschedule appointment. It may not be in an upcoming status.");
		}
	} catch (error) {
		console.error("Error rescheduling appointment:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const rescheduleAppointmentForMyPatient = async (req: Request, res: Response) => {
	console.log("entered");
	const aptId = req.body.appointmentId;// Update the property name to match the request body
	console.log(aptId);
	try {
		const updatedAppointment = await appointment.findOneAndUpdate({ _id: aptId }, req.body, { new: true });
		console.log(updatedAppointment);
		if (!updatedAppointment) {
			return res.status(404).json({ message: "Appointment not found" });
		}
		const patientEmail: string = await Users.findById(updatedAppointment.patient).then((pat) => {
			console.log(pat?.email);
			return pat ? pat.email : "";
		}
		);
		const doctorEmail: string = await Users.findById(updatedAppointment.doctor).then((doc) => {
			console.log(doc?.email);
			return doc ? doc.email : "";
		}
		);

		const subject = "Appointment Resceduled";
		let html = `Hello patient, \n your appointment was resceduled with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
		sendMailService.sendMail(patientEmail, subject, html);
		html = `Hello doctor, \n your appointment was resceduled with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ni Clinic xoxo.`;
		sendMailService.sendMail(doctorEmail, subject, html);
		console.log("sending notification for appointmen: patient", req.body.patient, " | doctor", req.body.doctor);
		NotificationController.createNotificationwithId(updatedAppointment.patient.toString(), "Your appointment is rescheduled", "/patient/appointments");
		NotificationController.createNotificationwithId(updatedAppointment.doctor.toString(), "Your appointment is rescheduled", "/doctor/appointments");

		return res.status(200).json({ message: "Appointment rescheduled successfully", updatedAppointment });
	} catch (error) {
		console.error("Error updating appointment:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const listAllPendingFllowUps = async (req: Request, res: Response) => {
	const apts = appointment
		.find({ "doctor": req.params.id, "appointmentType": "followup", "followUpStatus": "pending" })
		.then((apts) => res.status(200).json(apts))
		.catch((err) => {
			return res.status(400).json(err);
		});
}


// const getAllAppointments = async (req: Request, res: Response) => {
// 	const id = req.params.id;
// 	var doc;
// 	console.log("here");
// 	const pat = await Patient.findById(id).exec();
// 	if (!pat || pat === undefined) {
// 		//return res.status(404).send("no user found");
// 		doc = await doctor.findById(id).exec();
// 		if (!doc || doc === undefined) {
// 			return res.status(404).send("no user found with this ID");
// 		}
// 		console.log("not patient");
// 	}


// 	if (pat) {
// 		const currentDate = new Date();

// 		console.log("getting apt");
// 		const apt = appointment
// 			.find({ patient: id })
// 			.populate({ path: "doctor", select: "name" })
// 			.populate({ path: "patient", select: "name" })
// 			.then((appointments) => {

// 				console.log("apt here ");

// 				if (appointments.length === 0) {
// 					// No appointments found for the patient
// 					console.log("apt 0");

// 					return res.status(200).json([]);
// 				}else{
// 			// Add a new attribute 'state' based on the date comparison
// 					console.log("apt != 0");

// 				const updatedAppointments = appointments.map((apt) => {
// 					const aptDate = new Date(apt.date);
// 					const state = aptDate < currentDate ? "past" : "upcoming";
// 					return { ...apt.toObject(), state };
// 				});

// 				res.status(200).json(updatedAppointments);
// 				}



// 			})
// 			.catch((err) => {
// 				res.status(400).json(err);
// 			});
// 	} else {
// 		console.log(" doctor");

// 		const currentDate = new Date();

// 		const apt = appointment
// 			.find({ doctor: id })
// 			.populate({ path: "doctor", select: "name" })
// 			.populate({ path: "patient", select: "name" })
// 			.then((appointments) => {
// 				if (appointments.length === 0) {
// 					// No appointments found for the patient
// 					return res.status(200).json([]);
// 				}

// 				// Add a new attribute 'state' based on the date comparison
// 				const updatedAppointments = appointments.map((apt) => {
// 					const aptDate = new Date(apt.date);
// 					const state = aptDate < currentDate ? "past" : "upcoming";
// 					return { ...apt.toObject(), state };
// 				});

// 				res.status(200).json(updatedAppointments);
// 			})
// 			.catch((err) => {
// 				res.status(400).json(err);
// 			});
// 	}
// }

const getAllAppointments = async (req: Request, res: Response) => {
	const patientId = req.params.id;
  
	console.log(patientId);
	try {
	  // Find all appointments with the given patient ID
	  var appointments = await appointment.find({ patient: patientId }).exec();
  
	  if (!appointments || appointments.length === 0) {
		var appointments = await appointment.find({ doctor : patientId }).exec();
		//return res.status(200).json([]);
	  }

	  if (!appointments || appointments.length === 0) {
		//var appointments = await appointment.find({ doctor : patientId }).exec();
		return res.status(200).json([]);
	  }
  
	  // Fetch patient and doctor details for each appointment
	  const appointmentsWithDetails = await Promise.all(appointments.map(async (apt) => {
		try {
		  // Fetch the patient's details based on appointment.patient (assuming appointment.patient is the patient's ID)
		  const patient = await Patient.findById(apt.patient).exec(); // Replace `Patient` with your patient model
  
		  // Fetch the doctor's details based on appointment.doctor (assuming appointment.doctor is the doctor's ID)
		  const doctor = await Doctor.findById(apt.doctor).exec(); // Replace `Doctor` with your doctor model
  
		  if (patient && doctor) {

			console.log(apt);
			return {
			  ...apt.toObject(), // Convert Mongoose document to plain JavaScript object
			  patient: {
				name: patient.name, // Assuming patient has a 'name' field
				_id: patient._id
			  },
			  doctor: {
				name: doctor.name, // Assuming doctor has a 'name' field
				_id: doctor._id
			  }
			};
		  } else {
			return apt.toObject();
		  }
		} catch (error) {
		  console.error('Error fetching details:', error);
		  return apt.toObject();
		}
	  }));
  
	  return res.status(200).json(appointmentsWithDetails);
	} catch (error) {
	  console.error('Error fetching appointments:', error);
	  return res.status(500).json({ message: 'Internal Server Error' });
	}
  };
  

const cancelAppointment = async (req: Request, res: Response) => {
	const id = req.params.id;
	console.log(`id = ${id}`);

	//const isLessThan24Hours = req.body.isLessThan24Hours;

	const apt = await appointment.findById(id).exec();

	if (!apt) {
		return res.status(404).json({ message: "Appointment not found." });
	}

	const appointmentDate = new Date(apt.date);
	const currentDate = new Date();

	if (isNaN(appointmentDate.getTime()) || isNaN(currentDate.getTime())) {
		throw new Error('Invalid date format');
	}

	// Calculate the difference in hours
	const diffInMs = Math.abs(appointmentDate.getTime() - currentDate.getTime());
	const diffInHours = diffInMs / (1000 * 60 * 60);
	console.log(`Difference in hours: ${diffInHours}`);


	// Check if appointment is within the next 24 hours
	const isLessThan24Hours = diffInHours < 24;
	console.log(`Is the appointment less than 24 hours away? ${isLessThan24Hours}`);


	const docID = apt.doctor;

	const doc = await Doctor.findById(docID).exec();

	if (!doc) {
		return res.status(404).json({ message: "Doctor not found." });

	}

	console.log(`got doc`);


	const isFutureAppointment = appointmentDate.toISOString() > currentDate.toISOString();
	const patientEmail = await Users.findById(apt.patient).then(
		(pat) => pat?.email,
	);
	const doctorEmail = await Users.findById(apt.doctor).then(
		(doc) => doc?.email,
	);
	if (!patientEmail || !doctorEmail) {
		return
	}
	if (appointmentDate > currentDate) {
		console.log(`future date`);

		if (isLessThan24Hours) {
			console.log(`less than 24 hours`);

			apt.status = "cancelled";
			await apt.save();
			console.log(`success`);

			const subject = "Appointment cancelled";
			let html = `Hello patient, <br /> Your appointment with date ${appointmentDate} was cancelled .<br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(patientEmail, subject, html);
			html = `Hello doctor, <br /> Your appointment with date ${appointmentDate} was cancelled .<br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			sendMailService.sendMail(doctorEmail, subject, html);
			console.log("sending notification for appointmen: patient", apt.patient, " | doctor", doc._id);
			NotificationController.createNotificationwithId(apt.patient.toString(), "Your appointment was cancelled", "/patient/appointments");
			NotificationController.createNotificationwithId(apt.doctor.toString(), "Your appointment was cancelled", "/doctor/appointments");
			 return res.status(200).json({ message: "Appointment cancelled successfuly." });

			 
		} else {
			apt.status = "cancelled";
			console.log(`cancelled apt `);

			const patID = apt.patient;
			var price = apt.price;

			const pat = await Patient.findById(patID).exec();
			console.log(`found pat`);

			if (!pat || pat === undefined) {
				console.log("no patient");
				return res.status(404).json({ message: "Patient not found." });
			}

			if (!price || price === undefined) {
				price = 0;

			}


			if (!pat.wallet || pat.wallet === undefined) {
				//return res.status(404).json({message : "Patient wallet is undefined."});
				console.log("here1");
				pat.wallet = price;

			} else {
				console.log("here2");
				const money = pat.wallet;
				console.log(`money = ${money} and price = ${price} and sum = ${money + price}`);
				pat.wallet = money + price;
				//= money + price;

			}

			doc.availableSlotsStartTime?.push(appointmentDate);

			await doc.save();
			await pat.save();
			await apt.save();
			console.log(`success`);
			
			 const subject = "Appointment cancelled";
			 let html = `Hello patient, <br /> Your appointment with date ${appointmentDate} was cancelled .<br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			 sendMailService.sendMail(patientEmail, subject, html);
			 html = `Hello doctor, <br /> Your appointment with date ${appointmentDate} was cancelled .<br /> With Love, <br /> El7a2ni Clinic xoxo.`;
			 sendMailService.sendMail(doctorEmail, subject, html);
			 console.log("sending notification for appointmen: patient", apt.patient, " | doctor", doc._id);
			 NotificationController.createNotificationwithId(apt.patient.toString(), "Your appointment was cancelled", "/patient/appointments");
			 NotificationController.createNotificationwithId(apt.doctor.toString(), "Your appointment was cancelled", "/doctor/appointments");
			return res.status(200).json({ message: "Appointment cancelled and money refunded successfuly. " });
		}
	}

	return res.status(400).json({ message: "cannot cancel a past date" });


}


export default {
	createAppointment,
	listAllAppointments,
	readAppointment,
	deleteAppointment,
	filterAppointments,
	updateAppointment,
	createFollowUp,
	createAppointmentForFamilyMember,
	getAllAppointments,
	rescheduleAppointment,
	changeToPastAppointment,
	requestFollowUp,
	listAllPendingFllowUps,
	rescheduleAppointmentForMyPatient,
	cancelAppointment,
}
