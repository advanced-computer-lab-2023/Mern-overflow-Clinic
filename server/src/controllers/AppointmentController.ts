import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import { stat } from "fs";




const createAppointment = async (req: Request, res: Response) => {
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType="regular";
  const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};
const createFollowUp = async (req: Request, res: Response) => {
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType="followup";
  const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json(err);
    });
};
const readAppointment = async (req: Request, res: Response) => {
  const id = req.params.id;
  let today = new Date();
  const apt = appointment
    .findById(id)
    .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
    .then((apt) => {
      res.status(200).json(apt)
    })
    .catch((err) => {
      res.status(400).json(err);
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
const id = req.params.id
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

    res.status(200).json({ message: 'Appointments updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



const deleteAppointment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const apt = appointment
    .findByIdAndDelete({ _id: id })
    .then((apt) => {
      res.status(200).json(apt);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listAllAppointments = async (req: Request, res: Response) => {
  const apt = appointment
    .find({})
    .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
    .then((apt) => res.status(200).json(apt))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const filterAppointments = async (req: Request, res: Response) => {

  const status = req.body.status;

  if (req.body.date !== undefined && status !== undefined || (req.body.date && status)) {
    const inputDate = new Date(req.body.date);
    const apt = appointment
      .find({ "date": inputDate, "status": status })
      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  if ((req.body.date !== undefined && status === undefined) || (req.body.date && !status)) {
    const inputDate = new Date(req.body.date);
    const apt = appointment
      .find({ "date": inputDate })

      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  if (req.body.date === undefined && status !== undefined || (!req.body.date && status)) {
    const apt = appointment
      .find({ "status": status })

      .populate({ path: 'doctor', select: 'name' }).populate({ path: 'patient', select: 'name' })
      .then((apt) => {

        res.status(200).json(apt)
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

};



export default {
  createAppointment,
  listAllAppointments,
  readAppointment,
  deleteAppointment,
  filterAppointments,
  updateAppointment
};

