import { Request, Response } from "express";
import adminstrator from "../models/Adminstrator.js";
import doctor from "../models/Doctor.js";
import user from "../models/User.js";
import Contract from "../models/Contract.js";

const createAdminstrator = async (req: Request, res: Response) => {
  //add another adminstrator with a set username and password
  // missing authentication part
  const entry = adminstrator
    .find({ username: req.body.username })
    .then((document) => {
      if (document.length === 0) {
        const newAdmin = adminstrator
          .create(req.body)
          .then((newAdmin) => {
            res.status(200).json(newAdmin);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else if (document.length !== 0)
        res.status(400).send("username taken , please choose another one ");
    });
};

const readAdminstrator = async (req: Request, res: Response) => {};

const updateAdminstrator = async (req: Request, res: Response) => {};

const deleteAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  const adminToDelete = adminstrator
    .findByIdAndDelete({ _id: id })
    .then((adminToDelete) => {
      res.status(200).json(adminToDelete);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// to be reviewed again -> ask details
const viewRequest = async (req: Request, res: Response) => {
  const doctors = doctor
    .find({})
    .then((doctors) => {
      let newDoctors = [];
      for (var i = 0; i < doctors.length; i++) {
        if (doctors[i].status === "pending") newDoctors.push(doctors[i]);
      }

      return res.status(200).json(newDoctors);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

const handleDoctorRequest = async (req: Request, res: Response) => {
  //changeed name to handle to accept or reject in one method based on a parameter
};

const listAdminstrators = async (req: Request, res: Response) => {
  const adminstrators = adminstrator
    .find({})
    .then((admns) => res.status(200).json(admns))
    .catch((err) => {
      res.status(400).json(err);
    });
};
// LOGINE
const acceptDoctorRequest = async (req: Request, res: Response) => {
  // assuming doctor id passed as a parameter whenever entry is clciked from fe
  const reqid = req.body.id;
  // assuming his initial state is pending

  console.log("DOCTOR ID :" + reqid);

  const update = {
    // Define the fields you want to update and their new values
    status: "accepted",
  };

  // Set options for the update
  const options = {
    new: true, // Return the updated document after the update
  };

  // Use findOneAndUpdate to find and update the document
  const filter = { _id: reqid };
  doctor
    .findOneAndUpdate(filter, update, options)
    .then((result) => {
      console.log("RESULT " + result);
      res.status(200).send("accepted");
    })
    .catch((err) => res.status(404).send(err));
};


const rejectDoctorRequest = async (req: Request, res: Response) => {
  // assuming doctor id passed as a parameter whenever entry is clciked from fe
  const reqid = req.body.id;
  // assuming his initial state is pending

  const update = {
    // Define the fields you want to update and their new values
    status: "rejected",
  };

  // Set options for the update
  const options = {
    new: true, // Return the updated document after the update
  };

  // Use findOneAndUpdate to find and update the document
  const filter = { _id: reqid };
  doctor
    .findOneAndUpdate(filter, update, options)
    .then((result) => {
      res.status(200).send("rejected");
    })
    .catch((err) => res.status(404).send(err));
};
const createContract = async (req: Request, res: Response) => {
  // doctor: Types.ObjectId;
  // admin: Types.ObjectId;
  // date?: Date;
  // clinicMarkup: number;
  // status?:string;
  const id = req.params.id;
  req.body.id = id;
  req.body.status = 'pending';
  const date = new Date();
  req.body.date = date;

  const contract = Contract
  .create(req.body)
  .then((contract) => {
    res.status(200).json(contract);
  })
  .catch((err) => {
    res.status(400).json(err);
  });

}

export default {
  createAdminstrator,
  readAdminstrator,
  updateAdminstrator,
  deleteAdmin,
  acceptDoctorRequest,
  rejectDoctorRequest,
  viewRequest,
  listAdminstrators,
  createContract
};
