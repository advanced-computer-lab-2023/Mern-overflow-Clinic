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

const updatePatient = async (req: Request, res: Response) => {};

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
  const familyMem = await patient.findOne({"nationalId" : req.body.nationalId});
  if(!familyMem){
    return res.status(404).send("user not found");
  }

  const familyMemId:mongoose.Types.ObjectId = familyMem._id;
  
  const familyMember = {
    //name: req.body.name.toLowerCase(),
    nationalId: req.body.nationalId,
    patientId: familyMemId,
    // age: req.body.age,
    // gender: req.body.gender.toLowerCase(),
     relation: req.body.relation.toLowerCase(),
  };

  const id = req.params.id;

  try {
    const pat = await patient.findById(id);

    if (!pat) {
      return res.status(404).json({ message: "Patient not found" });
    }else{
      
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
  const idd = req.params.id;   
  const dId = req.params.dId;  

  const docs = await doctor
    .findById(dId) 
    .then((docs) =>{
      if (!docs) {
        return res.status(404).json({ message: 'Patient not found' });
      } else{
        res.status(200).json(docs);
      }
    }).catch((err) =>{
      res.status(404).send(err);
    });
};


const selectDoctorByName = async (req: Request, res: Response) => {
  const id = req.params.id;
  const doctorName = req.body.doctorName.toLowerCase();
  var docs: any[] = [];
  var docs2: any[] = [];
  const speciality = req.body.speciality.toLowerCase();
  var spc = false;
  try {
    const doctors = await doctor.find({});

    if (!doctorName) {
      return res.status(400).send("No name entered");
    }else{
      for (const doc of doctors) {
        if (doc.name.includes(doctorName)) {
          docs.push(doc);
        }
      }
  
      if (docs.length === 0) {
        return res.status(404).send("No doctors found with this name");
      }else{
        if (speciality) {
          for (const d of docs) {
            if (d.speciality.includes(speciality)) {
              docs2.push(d);
            }
          }
    
          if (docs2.length === 0) {
            return res.status(404).send("No doctors found with this speciality");
          }else{
            spc = true;
          }
        }

        if(spc){
          res.status(200).json(docs2);
        }else{
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
    
    if (!patientFound) {
      return res.status(404).json({ error: 'Patient not found' });
    }else{
      if (patientFound.package !== undefined) {
        const packageId = patientFound.package;
        const packageData = await pack.findById(packageId);
  
        const doctors = await doctor.find({});
        const sessionPrices = doctors.map((doctor) => {
          if (packageData) {
            docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
          }
          const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
          return { doctorName: doctor.name, sessionPrice };
        });
  
        res.status(200).json(sessionPrices); // Send the response after the loop is done
      } else {
        const doctors = await doctor.find({});
        const sessionPrices = doctors.map((doctor) => {
          const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
          return { doctorName: doctor.name, sessionPrice };
        });
  
        res.status(200).json(sessionPrices); // Send the response after the loop is done
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


// const filterDoctor = async (req: Request, res: Response) => {
//   //to be tested
//   const id = req.params.id;
//   const speciality = req.body.speciality.toLowerCase();
//   const dateInput = new Date(req.body.date);

//  //console.log(dateInput.toISOString()); // Ensure dateInput is in ISO format

//   try {
//     const docRes = await doctor.find({ 'speciality': speciality });

//     if (docRes.length === 0) {
//       res.status(404).send("No doctors with this speciality available");
//     } else {
//       if (!dateInput) {
//         res.status(200).send(docRes);
//       } else {
//         var resDocs: any[] = [];
//         var avDocs: any[] = [];

//         for (const doc of docRes) {
//           const appointmentsForDoctor = await appointment
//             .find({ 'doctor': doc._id })
//             .exec();

//           var count = 0;
         
//           for (const apt of appointmentsForDoctor) {
//             var hoursInput = dateInput.getHours();
//             const minutesInput = dateInput.getMinutes();
        
//             const startHours = apt.date.getHours();
//             const startMinutes = apt.date.getMinutes();
//             var endHours  = startHours+apt.duration;

//             var inputTime = (hoursInput*60)+minutesInput;
//             var startTime = (startHours*60)+startMinutes;
//             var endTime = (endHours*60)+startMinutes;
            
//             if (endHours >= 24) {
//               endHours -= 24; // Subtract 24 to wrap around to the next day
//             }

//             if (apt.date.getFullYear() === dateInput.getFullYear() && apt.date.getMonth() === dateInput.getMonth() && apt.date.getDate() === dateInput.getDate()) {
//               if(startTime<=inputTime && endTime>=inputTime)
//                 count++;
//             }
//           }

//           if (count === 0) {
//             avDocs.push(doc);
//           }
//         }

//         if (avDocs.length === 0) {
//           res.status(404).send("No doctors within this speciality are available at this date/time");
//         } else {
//           res.status(200).send(avDocs);
//         }
//       }
//     }
//   } catch (err) {
//     res.status(404).send(err);
//   }
// };

const filterDoctor = async (req: Request, res: Response) => {
  //to be tested
  const id = req.params.id;
  const speciality = req.body.speciality.toLowerCase();
  const dateInput = new Date(req.body.date);

 //console.log(dateInput.toISOString()); // Ensure dateInput is in ISO format

  try {
    const docRes = await doctor.find({ 'speciality': speciality });

    if (docRes.length === 0) {
      res.status(404).send("No doctors with this speciality");
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
            var hoursInput = dateInput.getHours();
            const minutesInput = dateInput.getMinutes();

            const startHours = apt.date.getHours();
            const startMinutes = apt.date.getMinutes();
            var beforeRange  = hoursInput-apt.duration;

            console.log(hoursInput + " + " + minutesInput + " + " + startHours + " + " + startMinutes + " + " + beforeRange);

            if((beforeRange===startHours && startMinutes>minutesInput) || (hoursInput===startHours && startMinutes<minutesInput))
                count++;
          }

          if (count === 0) {
            avDocs.push(doc);
          }
        }

        if (avDocs.length === 0) {
          res.status(404).send("No doctors within this speciality are available at this date/time");
        } else {
          res.status(200).send(avDocs);
        }
      }
    }
  } catch (err) {
    res.status(404).send(err);
  }
};


// const filterDoctor = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const speciality = req.body.speciality;
//   const dateInput = new Date(req.body.date);
//   const hoursInput = dateInput.getHours();
//   const minutesInput = dateInput.getMinutes();

//   try {
//     const docRes = await doctor.find({ 'speciality': speciality });

//     if (docRes.length === 0) {
//       res.status(404).send("No doctors with this speciality available");
//     } else {
//       if (!dateInput) {
//         res.status(200).send(docRes);
//       } else {
//         var resDocs: any[] = [];
//         var avDocs: any[] = [];

//         for (const doc of docRes) {
//           const appointmentsForDoctor = await appointment
//             .find({ 'doctor': doc._id })
//             .exec();

//           // Calculate the end time of the doctor's appointments
//           const endTimes: Date[] = [];
//           for (const apt of appointmentsForDoctor) {
//             const aptStartTime = apt.date;
//             const aptEndTime = new Date(aptStartTime);
//             aptEndTime.setMinutes(aptStartTime.getMinutes() + apt.duration);
//             endTimes.push(aptEndTime);
//           }

//           // Check if the requested time slot overlaps with any appointment
//           const requestedStartTime = new Date(dateInput);
//           const requestedEndTime = new Date(dateInput);
//           requestedEndTime.setMinutes(requestedEndTime.getMinutes() + 1); // Assuming 1-minute slot
//           const overlap = endTimes.some((endTime) => {
//             return (
//               requestedStartTime >= endTime && // Corrected here
//               requestedStartTime < endTime
//             );
//           });

//           if (!overlap) {
//             avDocs.push(doc);
//           }
//         }

//         if (avDocs.length === 0) {
//           res.status(404).send("No doctors within this speciality are available at this date/time");
//         } else {
//           res.status(200).send(avDocs);
//         }
//       }
//     }
//   } catch (err) {
//     res.status(404).send(err);
//   }
// };



export default {
  createPatient,
  readPatient,
  updatePatient,
  deletePatient,
  addFamilyMember,
  readFamilyMember,
  listPatients,
  selectDoctor,
  selectDoctorByName,
  listDoctorsBySessionPrice,
  filterDoctor
};
