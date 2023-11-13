import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import Patient from "../models/Patient.js";
import Users from "../models/User.js";
import { stat } from "fs";

const createAppointment = async (req: Request, res: Response) => {
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType = "regular";
  const newApt = appointment
    .create(req.body)
    .then((newApt) => {
return res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
return res.status(400).json(err);
    });
};


const createAppointmentForFamilyMember = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const docID = req.body.doctor;
    req.body.duration = 1;
    req.body.status = 'upcoming';
    req.body.appointmentType = 'regular';
    const id = req.params.id; // patient name;
    const flag = req.body.flag;
    const relation = req.body.relation;

    if (flag) {
      console.log(req.body);
      req.body.patient = req.body.relativeId;

      // Get the doctor and remove the date from availableStartTimeSlots
      var doctorObj = await doctor.findById(docID);
      if (!doctorObj || doctorObj===undefined) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      const dateToRemove = new Date(req.body.date); // Replace with the actual date

// Assuming availableStartTimeSlots is an array of Date objects
      if(doctorObj.availableSlotsStartTime !== undefined)
       { 
        doctorObj.availableSlotsStartTime = doctorObj.availableSlotsStartTime.filter(
          (slot) => slot.getTime() !== dateToRemove.getTime()
        );
      }



      // Update the doctor in the database
      await doctor.findByIdAndUpdate(docID, {
        $set: { availableStartTimeSlots: doctorObj.availableSlotsStartTime },
      });

      // Create the new appointment
      const newApt = await appointment.create(req.body);
      return res.status(200).json(newApt);
    } else {
      req.body.patient = id;
      console.log(req.body);

      var doctorObj = await doctor.findById(docID);
      if (!doctorObj || doctorObj===undefined) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      const dateToRemove = new Date(req.body.date); // Replace with the actual date

// Assuming availableStartTimeSlots is an array of Date objects
      if(doctorObj.availableSlotsStartTime !== undefined)
       { 
        doctorObj.availableSlotsStartTime = doctorObj.availableSlotsStartTime.filter(
          (slot) => slot.getTime() !== dateToRemove.getTime()
        );
      }



      // Update the doctor in the database
      await doctor.findByIdAndUpdate(docID, {
        $set: { availableStartTimeSlots: doctorObj.availableSlotsStartTime },
      });


      // Create the new appointment
      const newApt = await appointment.create(req.body);
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
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType = "followup";
  console.log(req.body);
  // 1. Extract the patient's email from req.body
  const patientEmail = req.body.email;

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

const readAppointment = async (req: Request, res: Response) => {
  const id = req.params.id;

  console.log("Appointment print"+id);
  let today = new Date();
  const apt = appointment
    .find({patient:id})
    .populate({ path: "doctor", select: "name" })
    .populate({ path: "patient", select: "name" })
    .then((apt) => {
      return res.status(200).json(apt);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
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

return res.status(200).json({ message: "Appointments updated successfully" });
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
  console.log(req.body);
  console.log(id);
  var doc;

  const pat = await Patient.findById(id).exec();
  if(!pat || pat ===undefined){
    //return res.status(404).send("no user found");
    doc =await doctor.findById(id).exec();
    if(!doc || doc ===undefined){
      return res.status(404).send("no user found with this ID");
    }
  }
  
  if (
    (req.body.date !== undefined && status !== undefined) ||
    (req.body.date && status)
  ) {
    const inputDate = new Date(req.body.date);
    if (pat){
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

    }else{
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
    const inputDate = new Date(req.body.date);
    if(pat){
      const apt = appointment
      .find({ date: inputDate , patient: id})

      .populate({ path: "doctor", select: "name" })
      .populate({ path: "patient", select: "name" })
      .then((apt) => {
        res.status(200).json(apt);
      })
      .catch((err) => {
        res.status(400).json(err);
      });

    }else{
      const apt = appointment
      .find({ date: inputDate , doctor: id})

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

    if(pat){
      const apt = appointment
      .find({ status: status ,patient:id})

      .populate({ path: "doctor", select: "name" })
      .populate({ path: "patient", select: "name" })
      .then((apt) => {
        res.status(200).json(apt);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    }else{
      const apt = appointment
      .find({ status: status ,doctor:id})

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

const getAllAppointments = async (req: Request, res: Response) => {
  const id = req.params.id;
  var doc;
  const pat = await Patient.findById(id).exec();
  if(!pat || pat ===undefined){
    //return res.status(404).send("no user found");
    doc =await doctor.findById(id).exec();
    if(!doc || doc ===undefined){
      return res.status(404).send("no user found with this ID");
    }
  }

  if(pat){
    const currentDate = new Date();

    const apt = appointment
      .find({"patient": id})
      .populate({ path: "doctor", select: "name" })
      .populate({ path: "patient", select: "name" })
      .then((appointments) => {
        if (appointments.length === 0) {
          // No appointments found for the patient
          return res.status(200).json([]);
        }
    
        // Add a new attribute 'state' based on the date comparison
        const updatedAppointments = appointments.map((apt) => {
          const aptDate = new Date(apt.date);
          const state = aptDate < currentDate ? 'past' : 'upcoming';
          return { ...apt.toObject(), state };
        });
    
        res.status(200).json(updatedAppointments);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }else{
    const currentDate = new Date();

    const apt = appointment
      .find({"doctor": id})
      .populate({ path: "doctor", select: "name" })
      .populate({ path: "patient", select: "name" })
      .then((appointments) => {
        if (appointments.length === 0) {
          // No appointments found for the patient
          return res.status(200).json([]);
        }

        // Add a new attribute 'state' based on the date comparison
        const updatedAppointments = appointments.map((apt) => {
          const aptDate = new Date(apt.date);
          const state = aptDate < currentDate ? 'past' : 'upcoming';
          return { ...apt.toObject(), state };
        });

        res.status(200).json(updatedAppointments);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }


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
  
};
