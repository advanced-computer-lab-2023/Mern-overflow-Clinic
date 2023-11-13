import express from "express";
import bodyParser from "body-parser";
import doctorController from "../controllers/DoctorController.js";
import patientController from "../controllers/PatientController.js";
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import healthRecordController from "../controllers/HealthRecordController.js";
import appointmentController from "../controllers/AppointmentController.js";
import isAuthenticated from "../middlewares/permissions/isAuthenticated.js";

const router = express.Router();
router.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname );
    }
  });
  const upload = multer({ storage: storage })

//   const uploadMiddleware = (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     upload.array('file', 10)(req, res, (err) => {
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }
  
//       // Retrieve uploaded files
//       const files: Express.Multer.File[] = req.files as Express.Multer.File[];
//       const errors: string[] = [];
  
//       // Validate file types and sizes
//     //   files.forEach((file) => {
//     //     const allowedTypes = ['image/jpeg', 'image/png'];
//     //     const maxSize = 5 * 1024 * 1024; // 5MB
  
//     //     if (!allowedTypes.includes(file.mimetype)) {
//     //       errors.push(`Invalid file type: ${file.originalname}`);
//     //     }
  
//     //     if (file.size > maxSize) {
//     //       errors.push(`File too large: ${file.originalname}`);
//     //     }
//     //   });
  
//       // Handle validation errors
//       if (errors.length > 0) {
//         // Remove uploaded files
//         files.forEach((file) => {
//           fs.unlinkSync(file.path);
//         });
  
//         return res.status(400).json({ errors });
//       }
  
//       req.files = files;
  
//       next();
//     });
//   };

router.use(express.json());

router.get("/", isAuthenticated, doctorController.listDoctors);
router.post("/filter", isAuthenticated, patientController.filterDoctor);
router.get("/:id/slots", isAuthenticated, doctorController.listSlots);
router.get("/:id/completedAppointments", isAuthenticated, doctorController.listCompletedPatients);
router.get("/:id", isAuthenticated, doctorController.readDoctor);
router.get("/:id/wallet", isAuthenticated, doctorController.viewWallet);
router.put(
  "/:id/acceptContract",
  isAuthenticated,
  doctorController.acceptContract,
);
router.put(
  "/:id/rejectContract",
  isAuthenticated,
  doctorController.rejectContract,
);
router.put("/:id/addSlots", isAuthenticated, doctorController.addFreeSlots);
router.get(
  "/:id/patients",
  isAuthenticated,
  doctorController.listDoctorPatients,
);
router.get(
  "/:id/registeredPatients",
  isAuthenticated,
  doctorController.listMyPatients,
);
router.get(
  "/:id/patients/:pId",
  isAuthenticated,
  doctorController.selectPatient,
);
router.get(
  "/:id/search",
  isAuthenticated,
  doctorController.selectPatientByName,
);
router.get(
  "/:id/res",
  isAuthenticated,
  doctorController.listAllMyPatientsUpcoming,
);
router.post(
  "/:id/addHealthRecord",
  isAuthenticated,
  healthRecordController.createHealthRecord,
);
router.post(
  "/:id/createFollowup",
  isAuthenticated,
  appointmentController.createFollowUp,
);
router.post("/", doctorController.createDoctor);
router.put("/:id", isAuthenticated, doctorController.updateDoctor);
router.delete("/:id", isAuthenticated, doctorController.deleteDoctor);
router.get("/", doctorController.listDoctors);
router.get("/pendingDoctors", doctorController.listPendingDoctors);
router.post("/filter", patientController.filterDoctor);
router.get("/:id", doctorController.readDoctor);
router.get("/:id/wallet", doctorController.viewWallet);
router.put("/:id/acceptContract", doctorController.acceptContract);
router.put("/:id/rejectContract", doctorController.rejectContract);
router.put("/:id/addSlots", doctorController.addFreeSlots);
router.get("/:id/patients", doctorController.listDoctorPatients);
router.get("/:id/registeredPatients", doctorController.listMyPatients);
router.get("/:id/patients/:pId", doctorController.selectPatient);
router.get("/:id/search", doctorController.selectPatientByName);
router.get("/:id/res", doctorController.listAllMyPatientsUpcoming);
router.post("/", upload.array('files',10) ,doctorController.createDoctor);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

export default router;
