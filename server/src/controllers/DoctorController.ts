import { Request, Response } from "express";
import doctor from "../models/Doctor.js";
import appointment from "../models/appointment.js";
import patient from "../models/Patient.js";
import user from "../models/User.js";



const createDoctor = async (req: Request, res: Response) => {
  req.body.status = "pending";
  const entry = user.find({ 'username': req.body.username }).then((document) => {
    if (document.length === 0) {

        doctor.find({ 'email': req.body.email }).then((emailRes) => {

            if (emailRes.length !== 0)
                res.status(404).send("You are already registered , please sign in ");
        
            else {
                const newDoctor = doctor
                    .create(req.body)
                    .then((newDoctor) => {
                        res.status(200).json(newDoctor);
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

const readDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
    const doc = doctor
    .find({"_id":id, "status":"pending"})
    .then((doc) => {
      if(doc.length === 0)
        res.status(400).send("doctor with this ID is not pending any more");
      else
        res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updateDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const query = { _id: id };
  const email = req.body.email;
  const hourlyRate = req.body.hourlyRate;
  const affiliation = req.body.affiliation;
  const update: { [key: string]: any } = {};

  if (email!==undefined) update["email"] = email;
  if (hourlyRate!==undefined) update["hourlyRate"] = hourlyRate;
  if (affiliation!==undefined) update["affiliation"] = affiliation;

  doctor
    .findOneAndUpdate(query, update, { new: true })
    .then((updatedDoc) => {
      if (updatedDoc) {
        res.status(200).send(updatedDoc);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const deleteDoctor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const doc = doctor
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listDoctors = async (req: Request, res: Response) => {
  const doctors = doctor
    .find({})
    .then((doctors) => res.status(200).json(doctors))
    .catch((err) => {
      res.status(400).json(err);
    });
};

const listDoctorPatients = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pId = req.params.pId;

  const appointments = await appointment
    .find({ 'doctor': id }) 
    .populate('patient')
    .exec();

  const patientIds = appointments.map((appointment) => appointment.patient);
  const patients = await patient.find({ _id: { $in: patientIds } }).exec();

  res.status(200).json(patients);
};

const selectPatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const pId = req.params.pId;

  const appointments = await appointment
    .find({ 'doctor': id }) 
    .populate('patient')
    .exec();

  const patientIds = appointments.map((appointment) => appointment.patient);

  const pat = await patient
  .findOne({ _id: pId })
  .exec();

  if (!pat) {
    return res.status(404).json({ message: 'Patient not found' });
  }else{
    res.status(200).json(pat);
  }
};

const listAllMyPatientsUpcoming = async (req: Request, res: Response) => {
  const id = req.params.id;
  //const id: string = '65200d0602668a2ddd63d01c';
  // Get the current date and time
  const currentDate = new Date();

  try {
    // Find all upcoming appointments for the doctor with the specified ID
    const upcomingAppointments = await appointment
      .find({ 'doctor': id, 'date': { $gte: currentDate } }) // Filter by date >= currentDate
      .populate('patient')
      .exec();

    if(!upcomingAppointments || upcomingAppointments.length===0)
      res.status(404).send("no upcoming appointments found");
    else{
      const patientIds = upcomingAppointments.map((appointment) => appointment.patient);

      const patients = await patient.find({ _id: { $in: patientIds } }).exec();
  
      res.status(200).json(patients);
    }
   
  } catch (error) {
    res.status(400).json(error);
  }
};

const selectPatientByName = async (req:Request, res:Response) => {
  const id = req.params.id;
  const patientName = req.body.patientName.toLowerCase();
  var pIDs: any[]=[];
  var pats: any[]=[];
  try{   
    const apt = appointment.find({"doctor":id}).then((apts)=>{
        for (const appoint of apts){
          pIDs.push(appoint.patient);
        }
      })
    
    if(!apt)
      res.status(404).send("no appointments found");
    else{
          
      const patients = await patient.find({ _id: { $in: pIDs } }).exec();

      for(const pat of patients){
        if(pat.name.includes(patientName))
          pats.push(pat);
      }

      if(pats.length === 0)
        res.status(404).send("no patients found");
      else{
        res.status(200).json(pats);
      }
    }
  }catch(err){
    res.status(400).json(err);
  }

};




export default {
  createDoctor,
  readDoctor,
  updateDoctor,
  deleteDoctor,
  listDoctors,
  listDoctorPatients ,
  selectPatient,
  selectPatientByName,
  listAllMyPatientsUpcoming
};
