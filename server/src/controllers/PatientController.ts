import appointment from "../models/appointment.js";
import pack from "../models/Package.js";
import patient from "../models/Patient.js";
import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import bodyParser from "body-parser";
import app from "../index.js";
import { relative } from "path";
import doctor from "../models/Doctor.js";
import user from "../models/User.js";


const createPatient = async (req: Request, res: Response) => {

    const entry = user.find({ 'username': req.body.username }).then((document) => {
        if (document.length === 0) {

            patient.find({ 'email': req.body.email }).then((emailRes) => {

                if (emailRes.length !== 0)
                    res.status(404).send("You are already registered , please sign in ");

                else {
                    const newPatient = patient
                        .create(req.body)
                        .then((newPatient) => {
                            res.status(200).json(newPatient);
                        })
                        .catch((err) => {
                            res.status(400).json(err);
                        });
                }
            })
        }
        else if (document.length !== 0)
            res.status(400).send("username taken , please choose another one ");
    })

};

const readPatient = async (req: Request, res: Response) => {
};

const updatePatient = async (req: Request, res: Response) => { };

const deletePatient = async (req: Request, res: Response) => {
    const id = req.params.id;
    const pat = patient
        .findByIdAndDelete({ _id: id })
        .then((pat) => {
            res.status(200).json(pat);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

const listPatients = async (req: Request, res: Response) => {
    const pat = patient
        .find({})
        .then((pat) => res.status(200).json(pat))
        .catch((err) => {
            res.status(400).json(err);
        });
};

const addFamilyMember = async (req: Request, res: Response) => {
    const familyMem = await patient.findOne({ "nationalId": req.body.nationalId });
    if (!familyMem) {
        return res.status(404).send("user not found");
    }

    //   const familyMemId:mongoose.Types.ObjectId = familyMem._id;
    const familyMemId = new mongoose.Types.ObjectId(familyMem._id);

    const familyMember = {
        name: req.body.name.toLowerCase(),
        nationalId: req.body.nationalId,
        patientId: familyMemId,
        age: req.body.age,
        gender: req.body.gender.toLowerCase(),
        relation: req.body.relation.toLowerCase(),
    };

    const id = req.params.id;

    try {
        const pat = await patient.findById(id);

        if (!pat) {
            return res.status(404).json({ message: "Patient not found" });
        } else {

            const newRelatives = pat.familyMembers;
            if (newRelatives !== undefined)
                newRelatives.push(familyMember);

            pat.familyMembers = newRelatives;
            await pat.save();

            res.status(200).json(pat);
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const readFamilyMember = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id)
    const p = patient
        .findById(id)
        .then((p) => {
            if (p !== null)
                res.status(200).json(p.familyMembers);
        })

        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
};

const selectDoctor = async (req: Request, res: Response) => {

    const dId = req.params.dId;

    const docs = await doctor
        .findById(dId)
        .then((docs) => {
            if (!docs) {
                return res.status(404).json({ message: 'Doctor not found' });
            } else {
                res.status(200).json(docs);
            }
        }).catch((err) => {
            res.status(404).send(err);
        });
};


const selectDoctorByNameAndSpeciality = async (req: Request, res: Response) => {
    const doctorName = req.body.doctorName.toLowerCase();
    var docs: any[] = [];
    var docs2: any[] = [];

    var spc = false;
    try {
        const doctors = await doctor.find({});

        if (!doctorName) {
            return res.status(400).send("No name entered");
        } else {
            for (const doc of doctors) {
                if (doc.name.includes(doctorName)) {
                    docs.push(doc);
                }
            }

            if (docs.length === 0) {
                return res.status(404).send("No doctors found with this name");
            } else {
                if (req.body.speciality) {
                    const speciality = req.body.speciality.toLowerCase();
                    for (const d of docs) {
                        if (d.speciality.includes(speciality)) {
                            docs2.push(d);
                        }
                    }

                    if (docs2.length === 0) {
                        return res.status(404).send("No doctors found with this speciality");
                    } else {
                        spc = true;
                    }
                }

                if (spc) {
                    res.status(200).json(docs2);
                } else {
                    res.status(200).json(docs);
                }
            }
        }
    } catch (err) {
        res.status(400).json(err);
    }
};


const listDoctorsBySessionPrice = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        var docSessDisc = 0;
        //var duration = 2;
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            if (patientFound.package !== undefined) {
                const packageId = patientFound.package;
                const packageData = await pack.findById(packageId);

                const doctors = await doctor.find({});
                const sessionPrices = doctors.map((doctor) => {
                    if (packageData) {
                        docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
                    }
                    const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;
                    return { doctor, sessionPrice };
                });

                res.status(200).json(sessionPrices); // Send the response after the loop is done
            } else {
                const doctors = await doctor.find({});
                const sessionPrices = doctors.map((doctor) => {
                    const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;
                    return { doctor, sessionPrice };
                });
                // const doctors = await doctor.find({});
                // const sessionPrices = await Promise.all(
                // doctors.map(async (doctor) => {
                //     const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
                //     const fullDoctor = await (doctor as DocumentQuery<IDoctor, IDoctor>).findOne({ _id: doctor._id }).lean();
                //     return { doctor: fullDoctor, sessionPrice };
                // })
                // );


                res.status(200).json(sessionPrices); // Send the response after the loop is done
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
};


const filterDoctor = async (req: Request, res: Response) => {
    //to be tested @ahmed_wael
    const id = req.params.id;
    const speciality = req.body.speciality.toLowerCase();
    const dateInput = new Date(req.body.date);

    //console.log(dateInput.toISOString()); // Ensure dateInput is in ISO format

    try {
        const docRes = await doctor.find({ 'speciality': speciality });

        if (docRes.length === 0) {
            res.status(404).send("No doctors with this speciality available");
        } else {
            if (!dateInput) {
                console.log("hi!");
                res.status(200).send(docRes);
            } else {
                var resDocs: any[] = [];
                var avDocs: any[] = [];

                for (const doc of docRes) {
                    const appointmentsForDoctor = await appointment
                        .find({ 'doctor': doc._id })
                        .exec();

                    var count = 0;

                    for (const apt of appointmentsForDoctor) {
                        if (!apt.status.includes("canceled")) {
                            var hoursInput = dateInput.getHours();
                            const minutesInput = dateInput.getMinutes();

                            const startHours = apt.date.getHours();
                            const startMinutes = apt.date.getMinutes();
                            var beforeRange = hoursInput - apt.duration;

                            console.log(hoursInput + " + " + minutesInput + " + " + startHours + " + " + startMinutes + " + " + beforeRange);

                            if ((beforeRange === startHours && startMinutes > minutesInput) || (hoursInput === startHours && startMinutes < minutesInput)) {
                                count++;
                                break;
                            }
                        }
                    }

                    if (count === 0) {
                        avDocs.push(doc);
                    }
                }

                if (avDocs.length === 0) {
                    res.status(404).send("No doctors within this speciality are available at this date/time");
                } else {
                    console.log("hey");
                    res.status(200).send(avDocs);
                }
            }
        }
    } catch (err) {
        res.status(404).send(err);
    }
};





export default {
    createPatient,
    readPatient,
    updatePatient,
    deletePatient,
    addFamilyMember,
    readFamilyMember,
    listPatients,
    selectDoctor,
    selectDoctorByNameAndSpeciality,
    listDoctorsBySessionPrice,
    filterDoctor
};
