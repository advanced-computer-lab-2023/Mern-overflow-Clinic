import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/medicine.js';


const createPrescription = async (req: Request, res: Response) => {
  try {
    const docId = req.params.dId;
    const patientId = req.params.pId;
    const medicines = req.body.medicines;
    let medicineJSON = [];
    for (const medicine of medicines) {
      const medicineName = medicine.medName;
      const medicineDosage = medicine.dailyDosage;
      const med = await Medicine.findOne({ name: medicineName });
      if (!med) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      medicineJSON.push({medId: med._id, dailyDosage: medicineDosage});
    }
    const newBody = {"doctor": docId, "patient": patientId, "medicine": medicineJSON};
    const newPrescription = await Prescription.create(newBody);
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(docId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    patient.prescriptions?.push(newPrescription._id);
    doctor.prescriptions?.push(newPrescription._id);

    await patient.save();
    await doctor.save();

    res.status(200).send(newPrescription);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const viewPatientPrescription = async (req: Request, res: Response) => {
  const patientId = req.params.pId;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const prescriptionArr = [];
    if (patient.prescriptions !== undefined) {
      for (const presId of patient.prescriptions) {
        const pres = await Prescription.findById(presId).populate('doctor').populate('patient');
        prescriptionArr.push(pres);
      }
    }
    return res.status(200).json(prescriptionArr);
  } catch (err) {
return res.status(400).json(err);
  }
};

const viewDoctorPrescription = async (req: Request, res: Response) => {
  const doctorId = req.params.dId;
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  try {
    const prescriptionArr = [];
    if (doctor.prescriptions !== undefined) {
      for (const presId of doctor.prescriptions) {
        const pres = await Prescription.findById(presId).populate('doctor').populate('patient');
        prescriptionArr.push(pres);
      }
    }
    return res.status(200).json(prescriptionArr);
  } catch (err) {
return res.status(400).json(err);
  }
}

const addMedicine = async (req: Request, res: Response) => {
    
  const presId = req.params.id;
  const newMedicineName = req.body.mName.toLowerCase();
  const newMedicineDosage = req.body.mDosage;
  //console.log(id)
  //console.log("File in BE : " + JSON.stringify(fileInfo))
  try {
      const pres = await Prescription.findById(presId);

      if (!pres) {
          return res.status(404).json({ message: "Prescription not found" });
      } else {
          if(pres.medicine !== undefined){
              // i want to loop on the list of medicines of pres
              for(const medId of pres.medicine){
                  const med = await Medicine.findById(medId.medId);
                  // const newMed = await Medicine.findById(newMedicineName)
                  if(med?.name.toLowerCase() === newMedicineName){
                      return res.status(400).json({ message: "Medicine already exists in the prescription" });
                  }
              }      
          }
            const NewMedecine = await Medicine.findOne({name: newMedicineName});
            if (NewMedecine) {
              pres.medicine?.push({medId: NewMedecine._id, dailyDosage: newMedicineDosage});
              await pres.save();
  
              res.status(200).json(pres);
            } else {
              return res.status(404).json({ message: "Medicine not found" });
            }
      }

  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
    
  const presId = req.params.id;
  const medicineId = req.params.mid;
  
  try {
      const pres = await Prescription.findById(presId);

      if (!pres) {
          return res.status(404).json({ message: "Patient not found" });
      } else {

          
          // let newFiles = pat.files;
          // if (newFiles === undefined) {
          //     newFiles = [];
          const newPrescription= [];
          if(pres.medicine !== undefined){
            console.log("medicineIdToBeDel: " + medicineId)
              for (const med of pres.medicine){
                 if (!((med.medId).equals(medicineId))){
                           console.log("medId: " + med.medId)
                           newPrescription.push(med);
                   }  
              //   if (med.medId && medicineId && med.medId.toString && medicineId.toString) {
              //     if (med.medId.toString() !== medicineId.toString()) {
              //         newPrescription.push(med);
              //     }
              // } else {
              //   return res.status(404).json({ message: "medicine not found" });
              // }        
      }
                  pres.medicine = newPrescription;
                  await pres.save();   
                  res.status(200).json(pres); 
    }
  }
}
   catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
};


const updatePrescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = { _id: id };
  const filled = req.body.filled;
  const medicine = req.body.medicine;
  const update: { [key: string]: any } = {};
  if (filled !== undefined) update["filled"] = filled;
  if (medicine !== undefined) update["medicine"] = medicine;

  Prescription
    .findOneAndUpdate(query, update, { new: true })
    .then((updatedPrescription) => {
      if (updatedPrescription) {
return res.status(200).send(updatedPrescription);
      }
    })
    .catch((error) => {
return res.status(400).send(error);
    });
}

const deletePrescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  const prescription = await Prescription
    .findByIdAndDelete({ _id: id })
    .then((prescription) => {
return res.status(200).json(prescription);
    })
    .catch((err) => {
return res.status(400).json(err);
    });
}


const selectPrescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pres = await Prescription
    .findById(id).populate('doctor').populate('patient')
    .then((pres) => res.status(200).json(pres))
    .catch((err) => {
return res.status(400).json(err);
    });
}

const listMedicine = async (req: Request, res: Response) => {
  const mId = req.params.mId;
  const med = await Medicine
    .findById(mId)
    .then((med) => res.status(200).json(med))
    .catch((err) => {
return res.status(400).json(err);
    });
}

const updateDosage = async (req: Request, res: Response) => {
   const id = req.params.id;
   const mid = req.params.mid;
   const newDosage = req.body.dosage
   console.log("Hiii")
   try {
     const pres = await Prescription.findById(id);
     if (!pres) {
         return res.status(404).json({ message: "Patient not found" });
     } else {
      const newPrescription= [];
      for (const med of pres.medicine){
             if((med.medId).equals(mid)){
              console.log("DailyDosage = " + med.dailyDosage)
              med.dailyDosage = newDosage;
            }
            newPrescription.push(med);
       }
       pres.medicine = newPrescription;
       await pres.save();   
       res.status(200).json(pres);
   }
 }
 catch (err) {
   console.error(err);
   return res.status(500).json({ message: "Server error" });
 }
}

 const listMedDosage = async (req: Request, res: Response) => {
   const id = req.params.id;
   const mid = req.params.mid;
   console.log("Hiii")
   try {
     const pres = await Prescription.findById(id);
     if (!pres) {
         return res.status(404).json({ message: "Patient not found" });
     } else {
       for (const med of pres.medicine){
             if((med.medId).equals(mid)){
              console.log("DailyDosage = " + med.dailyDosage)
              return res.json({ dosage: med.dailyDosage }); // Send JSON response
            }
       }
   }
 }
 catch (err) {
   console.error(err);
   return res.status(500).json({ message: "Server error" });
 }

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
      queryConditions.date = new Date(filters.date);
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

    const prescriptions = await Prescription.find(queryConditions).populate('doctor').populate('patient')

return res.status(200).json(prescriptions);
  } catch (err) {
return res.status(400).json(err);
  }
};




export default {
  createPrescription,
  selectPrescription,
  updatePrescription,
  deletePrescription,
  viewPatientPrescription,
  viewDoctorPrescription,
  filterPrescriptions,
  addMedicine,
  deleteMedicine,
  listMedicine,
  listMedDosage,
  updateDosage
}
