import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/medicine.js';
import carts from "../models/Cart.js";
import medicine, {Imedicine} from "../models/medicine.js";
import { HydratedDocument } from "mongoose";

const addMedicineToCart = async (req: Request, res: Response) => {
  const { medName, medPrice, medQuantity } = req.body;
  // const patientId = req.params.id;
  const prescriptionId = req.params.id;
  const prescription = await Prescription.findById(prescriptionId);
  const patientId = prescription?.patient;
  console.log("I AM HEREE!!!");
  try {
      const cart = await carts.findOne({ patient: patientId });
      console.log("CARTSS HEREE!!!" + cart + "PatientID: " + patientId);
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }
      const existingMedicine = cart.medicines.find(med => med.medName === medName);
      const med : HydratedDocument<Imedicine> | null = await medicine.findOne({"name" : medName});
      if(!med){
          return res.status(404).send("medicine not found");
      }

      if (existingMedicine) {
          if((existingMedicine.medQuantity + medQuantity)> med.availableQuantity){
              return res.status(400).send("Not enough stock");
          }
          existingMedicine.medQuantity += medQuantity;
      } else {
          if(medQuantity > med.availableQuantity){
              return res.status(400).send("Not enough stock");
          }
          const newMedicine = {
              medName,
              medPrice,
              medQuantity,
          };
          cart.medicines.push(newMedicine);
      }
      await cart.save();
      res.json({ message: 'Medicine added to cart successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

const createPrescription = async (req: Request, res: Response) => {
  try {
    const docId = req.params.dId;
    const patientId = req.params.pId;
    const medicines = req.body.medicines;
    let medicineJSON = [];
    for (const medicine of medicines) {
      const medicineName = medicine.medName;
      const medicineDosage = medicine.dailyDosage;
      const medicineQuantity = medicine.quantity;
      const med = await Medicine.findOne({ name: medicineName });
      if (!med) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      medicineJSON.push({medId: med._id, dailyDosage: medicineDosage, quantity: medicineQuantity});
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

    console.log("Pres IDDDD: " + newPrescription._id);

    patient.prescriptions?.push(newPrescription._id);
    doctor.prescriptions?.push(newPrescription._id);

    console.log("Patient: " + patient.prescriptions);
    console.log("Doctor: " + doctor.prescriptions);

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
  const newMedicineQuantity = req.body.mQuantity;
  try {
      const pres = await Prescription.findById(presId);

      if (!pres) {
          return res.status(404).json({ message: "Prescription not found" });
      } else {
          if(pres.medicine !== undefined){
              for(const medId of pres.medicine){
                  const med = await Medicine.findById(medId.medId);
                  if(med?.name.toLowerCase() === newMedicineName){
                      return res.status(400).json({ message: "Medicine already exists in the prescription" });
                  }
              }      
          }
            const NewMedecine = await Medicine.findOne({name: newMedicineName});
            if (NewMedecine) {
              pres.medicine?.push({medId: NewMedecine._id, dailyDosage: newMedicineDosage, quantity: newMedicineQuantity});
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

          
          
          const newPrescription= [];
          if(pres.medicine !== undefined){
            // console.log("medicineIdToBeDel: " + medicineId)
              for (const med of pres.medicine){
                 if (!((med.medId).equals(medicineId))){
                          //  console.log("medId: " + med.medId)
                           newPrescription.push(med);
                   }       
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

const readPrescription = async (req: Request, res: Response) => {
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

const updatePrescriptionMedicine = async (req: Request, res: Response) => {
   const id = req.params.id;
   const mid = req.params.mid;
   const newDosage = req.body.dosage;
   const newQuantity = req.body.quantity;
  //  console.log("Hiii")
   try {
     const pres = await Prescription.findById(id);
     if (!pres) {
         return res.status(404).json({ message: "Patient not found" });
     } else {
      const newPrescription= [];
      for (const med of pres.medicine){
             if((med.medId).equals(mid)){
              // console.log("DailyDosage = " + med.dailyDosage)
              med.dailyDosage = newDosage;
              med.quantity = newQuantity;
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

const readPresMedDetails = async (req: Request, res: Response) => {
   const id = req.params.id;
   const mid = req.params.mid;
  //  console.log("Hiii")
   try {
     const pres = await Prescription.findById(id);
     if (!pres) {
         return res.status(404).json({ message: "Patient not found" });
     } else {
       for (const med of pres.medicine){
             if((med.medId).equals(mid)){
              // console.log("DailyDosage = " + med.dailyDosage)
              return res.json({ dosage: med.dailyDosage, quantity: med.quantity }); // Send JSON response
            }
       }
   }
 }
 catch (err) {
   console.error(err);
   return res.status(500).json({ message: "Server error" });
 }

}

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
  addMedicineToCart,
  createPrescription,
  readPrescription,
  updatePrescriptionMedicine,
  deletePrescription,
  viewPatientPrescription,
  viewDoctorPrescription,
  filterPrescriptions,
  addMedicine,
  deleteMedicine,
  listMedicine,
  readPresMedDetails,
}
