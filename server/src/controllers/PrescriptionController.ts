import { Request, Response } from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/medicine.js';


const createPrescription = async (req: Request, res: Response) => {
  try {
    const docId = req.params.dId;
    const patientId = req.params.pId;
    const newBody = {"doctor": docId, "patient": patientId, ...req.body };
    const newPrescription = await Prescription.create(newBody);
    res.status(200).send(newPrescription);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const viewPatientPrescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    console.log(id)
    const prescriptions = await Prescription.find({ "patient": id }).populate('doctor').populate('patient');
    // for(const pres of prescriptions){
    //              for(const medId of pres.medicine){
    //               await pres.populate('medId')
    //              }
    //           }     
    console.log(prescriptions)
    if (prescriptions.length === 0) {
return res.status(200).json(prescriptions);
    } else {
return res.status(200).json(prescriptions);
    }
  } catch (err) {
return res.status(400).json(err);
  }
};

const addMedicine = async (req: Request, res: Response) => {
    
  const presId = req.params.id;
  const newMedicineId = req.body.mId;
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
                  // const med = await Medicine.findById(medId);
                  // const newMed = await Medicine.findById(newMedicineId)
                  if(medId.equals(newMedicineId)){
                      return res.status(400).json({ message: "Medicine already exists in the prescription" });
                  }
              }      
          }
            
              pres.medicine?.push(newMedicineId);
              await pres.save();
  
              res.status(200).json(pres);           
      }

  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
    
  const presId = req.params.id;
  const medicineId = req.body.mId;
  
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
              for (const medId of pres.medicine){
                  if(!medId.equals(medicineId)){
                          newPrescription.push(medId);
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


const updatePrescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = { _id: id };
  const filled = req.body.filled;
  const update: { [key: string]: any } = {};
  if (filled !== undefined) update["filled"] = filled;

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
  const prescription = Prescription
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
  const pres = Prescription
    .findById(id)
    .then((pres) => res.status(200).json(pres))
    .catch((err) => {
return res.status(400).json(err);
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
  filterPrescriptions,
  addMedicine,
  deleteMedicine
}
