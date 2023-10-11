import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';


const createPrescription = async (req: Request, res: Response) => {
  try {
    const newPrescriptionData = req.body;
    
    newPrescriptionData.filled = false;

    const newPrescription = await Prescription.create(newPrescriptionData);
    
    res.status(200).json(newPrescription);
  } catch (error) {
    console.log("error");
    res.status(400).json(error);
  }
};


// const viewPatientPrescription = async(req:Request, res:Response)=>{
//     const id = req.params.id
//     const presc = Prescription
//     .find({})
//     .then((presc) => {
//       var arr: any[]=[]
//       for(const p of presc){
//         if(p.patient.toString() === id.toString()){
//           arr.push(p);
//         }
//       }
//       res.status(200).json(arr)}
//       )
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// }

const viewPatientPrescription = async (req:Request, res:Response) => {
  const id = req.params.id;
  try {
    const prescriptions = await Prescription.find({ patient: id });
    if(prescriptions.length ===0){
      res.status(404).send("no prescriptions found");
    }else{
      res.status(200).json(prescriptions);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};


const updatePrescription = async(req:Request, res:Response)=>{
    const id = req.params.id;
    const query = { _id: id };
    const filled = req.body.filled;
     const update: { [key: string]: any } = {};
    if (filled !== undefined) update["filled"] = filled;

  Prescription
    .findOneAndUpdate(query, update, { new: true })
    .then((updatedPrescription) => {
      if (updatedPrescription) {
        res.status(200).send(updatedPrescription);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

const deletePrescription = async(req:Request, res:Response)=>{
    const id = req.params.id;
    const prescription = Prescription
      .findByIdAndDelete({ _id: id })
      .then((prescription) => {
        res.status(200).json(prescription);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
}
const selectPrescription = async(req:Request, res:Response)=>{
  const id = req.params.id;
    const pres = Prescription
    .findById(id)
    .then((pres) => res.status(200).json(pres))
    .catch((err) => {
      res.status(400).json(err);
    });
}


// const filterPrescriptions = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const filters: any = req.body; // Assuming the filters are sent in the request body

//     const queryConditions: any = {};

//     // Add conditions based on the filters
//     if (filters.date) {
//       queryConditions.date = filters.date;
//     }
//     if (filters.doctorName) {
//       // "doctor" is a reference to the "Doctor" model with a "name" property
//       const doctors = await Doctor.find({ name: filters.doctorName });
//       const doctorIds = doctors.map((doctor) => doctor._id);
//       queryConditions.doctor = { $in: doctorIds };
//     }
//     if (filters.filled !== undefined) {
//       queryConditions.filled = filters.filled;
//     }

//     const prescriptions = await Prescription.find(queryConditions)
//       .populate('patient', '_id') // Select only the "_id" property of the "patient"
//       .populate('doctor', '_id'); // Select only the "_id" property of the "doctor"

//     res.status(200).json(prescriptions);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
const filterPrescriptions = async (req: Request, res: Response) => {
  const patientId = req.params.id; // Assuming you have the patient's ID in the route parameter
  try {
    const filters: any = req.body; // Assuming the filters are sent in the request body

    const queryConditions: any = { patient: patientId }; // Filter by patient ID

    // Add conditions based on the filters
    if (filters.date) {
      queryConditions.date = filters.date;
    }
    if (filters.doctorName) {
      // Find doctors with names containing the input name
      queryConditions.doctor = {
        $in: await Doctor.find({ name: { $regex: filters.doctorName, $options: 'i' } }).distinct('_id'),
      };
    }
    if (filters.filled !== undefined) {
      queryConditions.filled = filters.filled;
    }

    const prescriptions = await Prescription.find(queryConditions)
      .populate('patient', '_id') // Select only the "_id" property of the "patient"
      .populate('doctor', '_id'); // Select only the "_id" property of the "doctor"

    res.status(200).json(prescriptions);
  } catch (err) {
    res.status(400).json(err);
  }
};




export default{
    createPrescription,
    selectPrescription,
    updatePrescription,
    deletePrescription,
    viewPatientPrescription,
    filterPrescriptions
}