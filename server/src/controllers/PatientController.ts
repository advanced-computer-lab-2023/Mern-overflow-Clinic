import appointment from "../models/appointment.js";
import pack from "../models/Package.js";
import patient from "../models/Patient.js";
import { Request, Response } from "express";
import mongoose, { Mongoose, Types } from "mongoose";
import bodyParser from "body-parser";
import app from "../index.js";
import { relative } from "path";
import doctor from "../models/Doctor.js";
import user from "../models/User.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// const uploadedFiles = []; // Initialize an array to hold the uploaded files

//    patient.post('/upload', upload.single('file'), (req, res) => {
//      if (req.file) {
//        // If a file was uploaded, add it to the list of uploaded files
//        uploadedFiles.push({
//          filename: req.file.originalname,
//          path: req.file.path,
//        });
  
//        res.json({ message: 'File added successfully' });
//      } else {
//        res.status(400).json({ message: 'No file added' });
//     }
//    });






const createPatient = async (req: Request, res: Response) => {
    //const uploadedFiles = req.files;
    //req.body.documents = uploadedFiles;
    console.log(req.body)
    const entry = user.find({ 'username': req.body.username }).then((document) => {
        if (document.length === 0) {

            patient.find({ 'email': req.body.email }).then((emailRes) => {// TODO rfactor this and test for uniqe mobile number
                if (emailRes.length !== 0)
return res.status(404).send("You are already registered , please sign in ");

                else {
                    const newPatient = patient
                        .create(req.body)
                        .then((newPatient) => {
return res.status(200).json(newPatient);
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(400).json(err);
                        });
                }
            })
        }
        else if (document.length !== 0)
return res.status(400).send("username taken , please choose another one ");
    })

};

const readPatient = async (req: Request, res: Response) => {
    const pId = req.params.id;
    console.log(pId);
     const pat = patient
        .findById(pId)
        .then((pat) => {
            if (!pat || pat === undefined) {
                return res.status(404).json({ message: 'Patient not found' });
            } else {
        return res.status(200).json(pat);
            }
        }).catch((err) => {
        return res.status(404).send(err);
        });
};

const listFamilyMembers = async (req: Request, res: Response) => {
    const pId = req.params.id;
     const pat = await patient
        .findById(pId)
        .then((pat) => {
            if (!pat || pat === undefined) {
                return res.status(404).json({ message: 'Patient not found' });
            } else {
                if(pat.familyMembers?.length !==0)
                    res.status(200).json(pat.familyMembers);
                else
                res.status(404).send("no family members");
            }
        }).catch((err) => {
            res.status(404).send(err);
        });
};

const updatePatient = async (req: Request, res: Response) => { };

const deletePatient = async (req: Request, res: Response) => {
    const id = req.params.id;
    const pat = patient
        .findByIdAndDelete({ _id: id })
        .then((pat) => {
return res.status(200).json(pat);
        })
        .catch((err) => {
return res.status(400).json(err);
        });
};

const listPatients = async (req: Request, res: Response) => {
    const pat = patient
        .find({})
        .then((pat) => res.status(200).json(pat))
        .catch((err) => {
return res.status(400).json(err);
        });
};

const addFamilyMember = async (req: Request, res: Response) => {
    const familyMem = await patient.findOne({ "nationalId": req.body.nationalId });
    if (!familyMem) {
        return res.status(404).send("Family Member should be registered as a patient.");
    }

    //   const familyMemId:mongoose.Types.ObjectId = familyMem._id;

    const familyMember = {
        name: req.body.name.toLowerCase(),
        nationalId: req.body.nationalId,
        patientId: familyMem._id,
        // age: req.body.age,
        gender: req.body.gender.toLowerCase(),
        relation: req.body.relation.toLowerCase(),
    };

    const id = req.params.id;

    try {
        const pat = await patient.findById(id);

        if (!pat) {
            return res.status(404).json({ message: "Patient not found" });
        } else {

            let revRelation = "";

            if (req.body.relation.toLowerCase() === "child") {
                revRelation = "parent";
            } else if (req.body.relation.toLowerCase() === "parent") {
                revRelation = "child";
            } else if (req.body.relation.toLowerCase() === "wife") {
                revRelation = "husband";
            } else if (req.body.relation.toLowerCase() === "husband") {
                revRelation = "wife";
            } else if (req.body.relation.toLowerCase() === "sibling") {
                revRelation = "sibling";
            }

            const myFamilyMember = {
                name: pat.name.toLowerCase(),
                nationalId: pat.nationalId,
                patientId: pat._id,
                // age: new Date().getFullYear() - new Date(pat.dateOfBirth).getFullYear(),
                gender: pat.gender.toLowerCase(),
                relation: revRelation,
            };

            const newRelatives = pat.familyMembers;
            if (newRelatives !== undefined)
                newRelatives.push(familyMember);

            const newRevRelatives = familyMem.familyMembers;
            if (newRevRelatives !== undefined)
                newRevRelatives.push(myFamilyMember);

            pat.familyMembers = newRelatives;
            familyMem.familyMembers = newRevRelatives;
            await pat.save();
            await familyMem.save();

return res.status(200).json([pat, familyMem]);
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const addDocument = async (req: Request, res: Response) => {
    
    
    //  const fileInfo = {
    //      filename: (req.file as Express.Multer.File).originalname,
    //      path: (req.file as Express.Multer.File).path,
    //    };
    
    const fileInfo = {
        filename: (req.file as Express.Multer.File).originalname,
        //path : path.join(__dirname, 'uploads', (req.file as Express.Multer.File).filename)
        path: (req.file as Express.Multer.File).path,
      };
    
    const id = req.params.id;
    console.log(id)
    console.log("File in BE : " + JSON.stringify(fileInfo))
    try {
        const pat = await patient.findById(id);

        if (!pat) {
            return res.status(404).json({ message: "Patient not found" });
        } else {
            if(pat.files !== undefined){
                const existingFile = pat.files.find(file => file.filename === fileInfo.filename);
                if (existingFile) {
                    return res.status(400).json({ message: "Filename already exists in the patient's files" });
                }
            }
                const newFiles= pat.files || [];
                newFiles.push(fileInfo);
                pat.files = newFiles;
                await pat.save();
    
                res.status(200).json(pat);           
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteDocument = async (req: Request, res: Response) => {
    
    const id = req.params.id;
    const filename = req.body.filename;
    console.log("FileName is:" + filename)
    try {
        const pat = await patient.findById(id);

        if (!pat) {
            return res.status(404).json({ message: "Patient not found" });
        } else {

            
            // let newFiles = pat.files;
            // if (newFiles === undefined) {
            //     newFiles = [];
            const newFiles= [];
            if(pat.files !== undefined){
                for (const file of pat.files){
                    if(file.filename !== filename){
                            newFiles.push(file);
                    }          
        }
                    pat.files = newFiles;
                    await pat.save();   
                    res.status(200).json(pat); 
    }
    const filePath = `./src/uploads/` + filename;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error deleting file from server" });
                }
            })
    

    }
}
     catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const readPath = async (req: Request, res: Response) => {
    
    //get path of file using path.join and res.send
    //const id = req.params.id;
    const filename = req.query.filename  as string;
    console.log("FileName is:" + filename)
    
    const filePath = path.join(__dirname, '../uploads', filename);
     console.log("FilePath is: " + filePath);
     res.send(filePath);                             
}


const readFamilyMember = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id)
    const p = patient
        .findById(id)
        .then((p) => {
            if (p !== null)
return res.status(200).json(p.familyMembers);
        })

        .catch((err) => {
            console.log(err);
return res.status(400).json(err);
        });
};

const readDocuments = async (req: Request, res: Response) => {
    const id = req.params.id;
    const p = patient
        .findById(id)
        .then((p) => {
            if (p !== null)
                res.status(200).json(p.files);
        })
        .catch((err) => {
            console.log(err);
return res.status(400).json(err);
        });
};

const selectDoctor = async (req: Request, res: Response) => {

    const dId = req.params.dId;

    const docs = await doctor
        .findById(dId)
        .then((docs) => {
            if (!docs) {
                return res.status(404).json({ message: 'Doctor not found' });
            } else {
return res.status(200).json(docs);
            }
        }).catch((err) => {
return res.status(404).send(err);
        });
};

const selectDoctorByNameAndSpeciality = async (req: Request, res: Response) => {
    const doctorName = req.body.doctorName.toLowerCase();
    var docs: any[] = [];
    var docs2: any[] = [];

    var spc = false;
    try {
        const doctors = await doctor.find({});

        if (!doctorName) {
            return res.status(400).send("No name entered");
        } else {
            for (const doc of doctors) {
                if (doc.name.includes(doctorName)) {
                    docs.push(doc);
                }
            }

            if (docs.length === 0) {
                return res.status(404).send("No doctors found with this name");
            } else {
                if (req.body.speciality) {
                    const speciality = req.body.speciality.toLowerCase();
                    for (const d of docs) {
                        if (d.speciality.includes(speciality)) {
                            docs2.push(d);
                        }
                    }

                    if (docs2.length === 0) {
                        return res.status(404).send("No doctors found with this speciality");
                    } else {
                        spc = true;
                    }
                }

                if (spc) {
return res.status(200).json(docs2);
                } else {
return res.status(200).json(docs);
                }
            }
        }
    } catch (err) {
return res.status(400).json(err);
    }
};

// const listPatientPackages = async (req: Request, res: Response) => {
//     // console.log("LIST PATIENT PACKAGES");
//     try {

//         const pId = req.params.id;
//         const patientFound = await patient.findById(pId);
//         if (!patientFound) {
//             // console.log("NO PATIENT");
//             return res.status(404).json({ error: 'Patient not found' });
//         } else {
//             if (patientFound.package == undefined) {
//                 // console.log("NO PACKAGE");
//                 return res.status(404).json({ error: 'Patient does not have a package subscription' });
//             }
//             else {
//                 const packageId = patientFound.package;
//                 // console.log("GIHI: "+ patientFound._id);
//                 let packages = [{"patientId": patientFound._id, "packageId": packageId, "relation": "self"}];
//                 if (patientFound.familyMembers) {
//                     for (const famMem of patientFound.familyMembers) {
//                         const famMemPatient = await patient.findById(famMem.patientId);
//                         if (famMemPatient) {
//                             if (famMemPatient.package) {
//                                 const famMemPackage = await pack.findById(famMemPatient.package);
//                                 if (famMemPackage) {
//                                     packages.push({"patientId": famMemPatient._id, "packageId": famMemPackage._id, "relation": famMem.relation});
//                                 }
//                             }
//                         }
//                     }
//                 }

//                 res.status(200).json(packages);
//             }
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const listPatientPackages = async (req: Request, res: Response) => {
    // console.log("LIST PATIENT PACKAGES");
    try {

        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            // console.log("NO PATIENT");
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            if (patientFound.package == undefined) {
                // console.log("NO PACKAGE");
                return res.status(404).json({ error: 'Patient does not have a package subscription' });
            }
            else {
                const packageId = patientFound.package;
                if (patientFound.subscribedToPackage === true && (patientFound.packageRenewalDate && new Date(patientFound.packageRenewalDate).getTime() < new Date().getTime())) {
                    patientFound.subscribedToPackage = false;
                    await patientFound.save();
                    return res.status(404).json({ error: 'Patient package subscription has expired' });
                }
                // console.log("GIHI: "+ patientFound._id);
                let packages = [{"patientId": patientFound._id, "packageId": packageId, "relation": "self"}];
                if (patientFound.familyMembers) {
                    for (const famMem of patientFound.familyMembers) {
                        const famMemPatient = await patient.findById(famMem.patientId);
                        if (famMemPatient) {
                            if (famMemPatient.package) {
                                const famMemPackage = await pack.findById(famMemPatient.package);
                                if (famMemPatient.subscribedToPackage === true && (famMemPatient.packageRenewalDate && new Date(famMemPatient.packageRenewalDate).getTime() < new Date().getTime())) {
                                    famMemPatient.subscribedToPackage = false;
                                    await famMemPatient.save();
                                    return res.status(404).json({ error: 'Family member package subscription has expired' });
                                }
                                if (famMemPackage) {
                                    packages.push({"patientId": famMemPatient._id, "packageId": famMemPackage._id, "relation": famMem.relation});
                                }
                            }
                        }
                    }
                }

                res.status(200).json(packages);
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// const addPackage = async (req: Request, res: Response) => {
//     try {
//         const pId = req.params.id;
//         const patientFound = await patient.findById(pId);
//         if (!patientFound) {
//             return res.status(404).json({ error: 'Patient not found' });
//         } else {
//             if (patientFound.package !== undefined && patientFound.subscribedToPackage) {
//                 return res.status(400).json({ error: 'Patient already has a package' });
//             } else {
//                 const packageId = req.params.packageId;
//                 const packageData = await pack.findById(packageId);
//                 if (!packageData) {
//                     return res.status(404).json({ error: 'Package not found' });
//                 } else {
//                     patientFound.package = packageData._id;
//                     patientFound.subscribedToPackage = true;
//                     //patientFound.packageSubscribed = packageId;
//                     const today = new Date();
//                     const renewalDate = new Date(today.getTime() + packageData.subscriptionPeriod * 24 * 60 * 60 * 1000);
//                     // console.log("RENEWAL DATE: " + renewalDate);
//                     patientFound.packageRenewalDate = renewalDate;
//                     await patientFound.save();
//                     res.status(200).json("Package added successfully");
//                 }
//             }
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const addPackage = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            if (patientFound.package !== undefined && patientFound.subscribedToPackage && (patientFound.packageRenewalDate && new Date(patientFound.packageRenewalDate).getTime() > new Date().getTime())) {
                return res.status(400).json({ error: 'Patient already has a package' });
            } else {
                const packageId = req.params.packageId;
                const packageData = await pack.findById(packageId);
                if (!packageData) {
                    return res.status(404).json({ error: 'Package not found' });
                } else {
                    patientFound.package = packageData._id;
                    patientFound.subscribedToPackage = true;
                    //patientFound.packageSubscribed = packageId;
                    const today = new Date();
                    const renewalDate = new Date(today.getTime() + packageData.subscriptionPeriod * 24 * 60 * 60 * 1000);
                    // console.log("RENEWAL DATE: " + renewalDate);
                    patientFound.packageRenewalDate = renewalDate;
                    await patientFound.save();
                    res.status(200).json("Package added successfully");
                }
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// const addPackageToFamMem = async (req: Request, res: Response) => {
//     try {
//         const pId = req.params.id;
//         const patientFound = await patient.findById(pId);
//         if (!patientFound) {
//             console.log("LINE 390");
//             return res.status(404).json({ error: 'Patient not found' });
//         } else {
//             const familyMemberId = req.params.pId;
//             if (patientFound.familyMembers === undefined) {
//                 return res.status(400).json({ error: 'Patient has no family members' });
//             }
//             const familyMemberPatient = await patient.findById(familyMemberId);
//             console.log("FAM MEM PATIENT: " + familyMemberPatient);
//             console.log("FAM MEM PATIENT ID: " + familyMemberId);
//             let flag = false;
//             if (!familyMemberPatient) {
//                 console.log("LINE 400");
//                 return res.status(404).json({ error: 'Family member not found' });
//             }
//             console.log("FAM MEM PATIENT: " + familyMemberPatient);
//             for (const famMem of patientFound.familyMembers) {
//                 console.log("FAM MEM: " + famMem);
//                 if (famMem.patientId.toString() === familyMemberPatient._id.toString()) {
//                     console.log("FAM MEM FOUND");
//                     flag = true;
//                 }
//             }
//             if (!flag || !familyMemberPatient) {
//                 console.log("LINE 412");
//                 return res.status(404).json({ error: 'Family member not found' });
//             } else {
//                 if (familyMemberPatient.package !== undefined && familyMemberPatient.subscribedToPackage) {
//                     return res.status(400).json({ error: 'Family member already has a package' });
//                 } else {
//                     const packageId = req.params.packageId;
//                     const packageData = await pack.findById(packageId);
//                     if (!packageData) {
//                         console.log("LINE 421");
//                         return res.status(404).json({ error: 'Package not found' });
//                     } else {
//                         familyMemberPatient.package = packageData._id;
//                         familyMemberPatient.subscribedToPackage = true;
//                         //familyMemberPatient.packageSubscribed = packageId;
//                         const today = new Date();
//                         const renewalDate = new Date(today.setDate(today.getDate() + packageData.subscriptionPeriod));
//                         familyMemberPatient.packageRenewalDate = renewalDate;
//                         await familyMemberPatient.save();
//                         await patientFound.save();
//                         res.status(200).json("Package added successfully");
//                     }
//                 }
//             }
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const addPackageToFamMem = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            console.log("LINE 390");
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            const familyMemberId = req.params.pId;
            if (patientFound.familyMembers === undefined) {
                return res.status(400).json({ error: 'Patient has no family members' });
            }
            const familyMemberPatient = await patient.findById(familyMemberId);
            console.log("FAM MEM PATIENT: " + familyMemberPatient);
            console.log("FAM MEM PATIENT ID: " + familyMemberId);
            let flag = false;
            if (!familyMemberPatient) {
                console.log("LINE 400");
                return res.status(404).json({ error: 'Family member not found' });
            }
            console.log("FAM MEM PATIENT: " + familyMemberPatient);
            for (const famMem of patientFound.familyMembers) {
                console.log("FAM MEM: " + famMem);
                if (famMem.patientId.toString() === familyMemberPatient._id.toString()) {
                    console.log("FAM MEM FOUND");
                    flag = true;
                }
            }
            if (!flag || !familyMemberPatient) {
                console.log("LINE 412");
                return res.status(404).json({ error: 'Family member not found' });
            } else {
                if (familyMemberPatient.package !== undefined && familyMemberPatient.subscribedToPackage) {
                    return res.status(400).json({ error: 'Family member already has a package' });
                } else {
                    const packageId = req.params.packageId;
                    const packageData = await pack.findById(packageId);
                    if (!packageData) {
                        console.log("LINE 421");
                        return res.status(404).json({ error: 'Package not found' });
                    } else {
                        familyMemberPatient.package = packageData._id;
                        familyMemberPatient.subscribedToPackage = true;
                        //familyMemberPatient.packageSubscribed = packageId;
                        const today = new Date();
                        const renewalDate = new Date(today.setDate(today.getDate() + packageData.subscriptionPeriod));
                        familyMemberPatient.packageRenewalDate = renewalDate;
                        await familyMemberPatient.save();
                        await patientFound.save();
                        res.status(200).json("Package added successfully");
                    }
                }
            }
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

const deletePackage = async (req: Request, res: Response) => {
    try {
        console.log("DELETE PACKAGE");
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            console.log("Patient found");
            if (patientFound.package === undefined) {
                return res.status(400).json({ error: 'Patient has no package' });
            } else {
                const packageId = patientFound.package;
                const packageData = await pack.findById(packageId);
                console.log("Package found");
                if (!packageData) {
                    return res.status(404).json({ error: 'Package not found' });
                } else {
                    //patientFound.package = undefined;
                    patientFound.subscribedToPackage = false;
                    console.log("Subscribed to package: " + patientFound.subscribedToPackage);
                    await patientFound.save();
                    res.status(200).json(patientFound);
                }
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deletePackageFromFamMem = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            const familyMemberId = req.params.pId;
            if (patientFound.familyMembers === undefined) {
                return res.status(400).json({ error: 'Patient has no family members' });
            }
            const familyMemberPatient = await patient.findById(familyMemberId);
            let flag = false;
            if (!familyMemberPatient) {
                return res.status(404).json({ error: 'Family member not found' });
            }
            for (const famMem of patientFound.familyMembers) {
                // console.log("FAM MEM: " + famMem);
                // console.log("FAM MEM PATIENT: " + familyMemberPatient);
                if (famMem.patientId.toString() === familyMemberPatient._id.toString()) {
                    // console.log("FAM MEM FOUND");
                    flag = true;
                }
            }
            // const familyMember = patientFound.familyMembers.find((famMem) => famMem.patientId === familyMemberPatient?._id);
            if (!flag || !familyMemberPatient) {
                // console.log("fam mem: " + familyMember);
                // console.log("fam mem patient: " + familyMemberPatient);
                return res.status(404).json({ error: 'Family member not found' });
            } else {
                if (familyMemberPatient.package === undefined) {
                    return res.status(400).json({ error: 'Family member has no package' });
                } else {
                    const packageId = familyMemberPatient.package;
                    const packageData = await pack.findById(packageId);
                    if (!packageData) {
                        return res.status(404).json({ error: 'Package not found' });
                    } else {
                        //familyMemberPatient.package = undefined;
                        familyMemberPatient.subscribedToPackage = false;
                        await familyMemberPatient.save();
                        await patientFound.save();
                        res.status(200).json(patientFound);
                    }
                }
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getPackageDiscount = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            const famMembers = patientFound.familyMembers;
            var maxDiscount = 0;
            if (famMembers) {
                for(const famMem of famMembers) {
                    const famMemPatient = await patient.findById(famMem.patientId);
                    if (famMemPatient) {
                        if (famMemPatient.package) {
                            const famMemPackage = await pack.findById(famMemPatient.package);
                            if (famMemPackage) {
                                if (famMemPackage.discountForFamily > maxDiscount) {
                                    maxDiscount = famMemPackage.discountForFamily;
                                }
                            }
                        }
                    }
                }
            }
            return res.status(200).json(maxDiscount);
        }
    } catch (err) {
        res.status(500).json(err);
    }

}

const listDoctorsBySessionPrice = async (req: Request, res: Response) => {
    try {
        const pId = req.params.id;
        const patientFound = await patient.findById(pId);
        var docSessDisc = 0;
        //var duration = 2;
        if (!patientFound) {
            return res.status(404).json({ error: 'Patient not found' });
        } else {
            if (patientFound.package !== undefined) {
                const packageId = patientFound.package;
                const packageData = await pack.findById(packageId);

                const doctors = await doctor.find({"status": "accepted"});
                const sessionPrices = doctors.map((doctor) => {
                    if (packageData) {
                        docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
                    }
                    const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;
                    const ret = { "sessionPrice": sessionPrice, ...doctor }

                    return ret;
                });

                return res.status(200).json(sessionPrices); // Send the response after the loop is done
            } else {
                const doctors = await doctor.find({"status": "accepted"});
                const sessionPrices = doctors.map((doctor) => {
                    const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;

                    const ret = { "sessionPrice": sessionPrice, ...doctor }

                    return ret;
                });
                // const doctors = await doctor.find({});
                // const sessionPrices = await Promise.all(
                // doctors.map(async (doctor) => {
                //     const sessionPrice = doctor.hourlyRate + 0.1 * doctor.hourlyRate - docSessDisc;
                //     const fullDoctor = await (doctor as DocumentQuery<IDoctor, IDoctor>).findOne({ _id: doctor._id }).lean();
                //     return { doctor: fullDoctor, sessionPrice };
                // })
                // );


                return res.status(200).json(sessionPrices); // Send the response after the loop is done
            }
        }
    } catch (error) {
return res.status(500).json(error);
    }
};



const filterDoctor = async (req: Request, res: Response) => {
    //to be tested @ahmed_wael

    const pId = req.body.id;

    const patientFound = await patient.findById(pId);

    if (!patientFound) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    //var duration = 2;

    const packageId = patientFound.package;
    const packageData = await pack.findById(packageId);

    if(req.body.speciality === undefined){
        return res.status(400).send("no speciality was entered");
    }
    const speciality = req.body.speciality.toLowerCase();

    
    const dateInput = new Date(req.body.date);

    //console.log(dateInput.toISOString()); // Ensure dateInput is in ISO format

    try {
        const docRes = await doctor.find({ 'speciality': speciality });

        if (docRes.length === 0) {
            return res.status(404).send("No doctors with this speciality available");
        } else {
            if (!dateInput || dateInput === undefined) {
                var docSessDisc = 0;
                const doctorsWithSessionPrices = docRes.map((doctor) => {
                    if (packageData) {
                        docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
                    }
                    const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;
                    const ret = { "sessionPrice": sessionPrice, ...doctor }

                    return ret;
                });
                return res.status(200).send(doctorsWithSessionPrices);
            } else {
                var resDocs: any[] = [];
                var avDocs: any[] = [];

                for (const doc of docRes) {
                    const appointmentsForDoctor = await appointment
                        .find({ 'doctor': doc._id })
                        .exec();

                    var count = 0;

                    for (const apt of appointmentsForDoctor) {

                        if (!apt.status.includes("canceled")) {
                            var hoursInput = dateInput.getHours();
                            const minutesInput = dateInput.getMinutes();

                            const startHours = apt.date.getHours();
                            const startMinutes = apt.date.getMinutes();
                            var beforeRange = hoursInput - apt.duration;

                            var afterRange = hoursInput + apt.duration;
                            console.log(afterRange)
                            if (beforeRange < 0) {
                                beforeRange = beforeRange + 24
                            }

                            if (afterRange === 24) {
                                afterRange = afterRange - 24
                            }
                            console.log(hoursInput + " + " + minutesInput + " + " + startHours + " + " + startMinutes + " + " + beforeRange);

                            if ((beforeRange === startHours && startMinutes > minutesInput) || (hoursInput === startHours) || (afterRange === startHours && startMinutes < minutesInput)) {
                                count++;
                                break;
                            }
                        }
                    }

                    if (count === 0) {
                        avDocs.push(doc);
                    }
                }

                if (avDocs.length === 0) {
                    return res.status(404).send("No doctors within this speciality are available at this date/time");
                } else {
                    console.log("hey");

                    var docSessDisc = 0;
                    const doctorsWithSessionPrices = avDocs.map((doctor) => {
                        if (packageData) {
                            docSessDisc = (packageData.discountOnDoctorSessions / 100) * doctor.hourlyRate;
                        }
                        const sessionPrice = doctor.hourlyRate + (0.1 * doctor.hourlyRate) - docSessDisc;

                        const ret = { "sessionPrice": sessionPrice, ...doctor }
                        return ret;
                    });
                    return res.status(200).send(doctorsWithSessionPrices);
                }
            }
        }
    } catch (err) {
        res.status(404).send(err);
    }
};


const viewMyHealthRecords = async (req: Request, res: Response) => {
    // assuming I am a patient and I am already logged in so we can get patient id from session
    // TO-DO: how do I get it from session ?
    const pid = req.params.id;
    patient.findById(pid).then(result => {
        if (result != null)
            res.status(200).send(result.healthRecords);
        else
            res.status(404).send("no health records found ");
        
}).catch(err=>res.status(400).send(err));

}

const viewWallet = async (req: Request, res: Response) => {
    const pId = req.params.id;

     const pat = await patient
        .findById(pId)
        .then((pat) => {
            if (!pat || pat === undefined) {
                return res.status(404).json({ message: 'Patient not found' });
            } else {
                return res.status(200).json(pat.wallet);
            }
        }).catch((err) => {
            return res.status(404).send(err);
        });
}

// const linkfamilyMember = async (req: Request, res: Response) => {
//     console.log(req.body);
//     const patId = req.params.id;
//     let familyMember: any[] = []; 
//     const relation = req.body.relation;
//     let found = false ;
//     if (relation !== "wife" && relation !== "husband" && relation !== "child") {
//         return res.status(404).send("cannot add with this relation");
//     } 
//     try {
//         const rPatient = await patient.findById(patId);
//         if (!rPatient || rPatient === undefined) {
//             return res.status(404).send("Patient not found");
//         }
//         if (req.body.mobileNumber) {
//             const mobileNumber = req.body.mobileNumber;
//             const pat = await patient.findOne({ mobileNumber: mobileNumber });
//             if (!pat) {
//                 return res.status(404).send("Patient not found");
//             }
//             const data = {
//                 name : pat.name,
//                 nationalId: pat.nationalId,
//                 patientId: pat._id,
//                 relation: relation,
//                 gender : pat.gender,  
//             };
//             for(var i = 0 ; i<rPatient.familyMembers?.length! ; i++){
//                 if(rPatient.familyMembers![i].nationalId === data.nationalId){
//                     return res.status(404).send("Patient already a family member");
//                 }
//               }
//                 rPatient.familyMembers?.push(data);
//                 const savedPat = await rPatient.save();
//                 return res.status(200).send(savedPat);
            
//         }
//         if (req.body.email) {
//             const email = req.body.email;
//             const pat = await patient.findOne({ email: email });
//             if (!pat) {
//                 return res.status(404).send("Patient not found");
//             }
//             const data = {
//                 name : pat.name,
//                 nationalId: pat.nationalId,
//                 patientId: pat._id,
//                 relation: relation,
//                 gender : pat.gender,
//             };


//       for(var i = 0 ; i<rPatient.familyMembers?.length! ; i++){
//         if(rPatient.familyMembers![i].nationalId === data.nationalId){
//             found = true;
//         }
//       }
//             if (found) {
//                 return res.status(403).send("Patient already a family member");
//             }
//             else{
//             rPatient.familyMembers?.push(data);
//             const savedPat = await rPatient.save();
//             return res.status(200).send(savedPat);
//             }
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({ message: 'No family members found' });
//     }
// }

const linkfamilyMember = async (req: Request, res: Response) => {
    //console.log(req.body);
    const patId = req.params.id;
    let familyMember: any[] = []; 
    const relation = req.body.relation;
    let found = false ;
    if (relation !== "wife" && relation !== "husband" && relation !== "child" && relation !== "parent" && relation !== "sibling") {
        return res.status(404).json({ message: 'Not a valid relation.' });
    } 
    try {
        const rPatient = await patient.findById(patId);
        if (!rPatient || rPatient === undefined) {
            console.log("no patient" );
            return res.status(404).json({ message: 'Patient not found.' });
        }
        if (req.body.mobileNumber && !req.body.email) {
            const mobileNumber = req.body.mobileNumber;
            const pat = await patient.findOne({ mobileNumber: mobileNumber });
            if (!pat) {
                //console.log("no patient 2");
                return res.status(404).json({ message: 'Patient with this mobile number was not found.' });;
            }
            const data = {
                name : pat.name,
                nationalId: pat.nationalId,
                patientId: pat._id,
                relation: relation,
                gender : pat.gender,  
            };
            for(var i = 0 ; i<rPatient.familyMembers?.length! ; i++){
                if(rPatient.familyMembers![i].nationalId === data.nationalId){
                    return res.status(404).json({ message: 'Patient is already a family member.' });
                }
            }

            //reverse
            let revRelation = "";

            if (relation === "wife") {
                revRelation = "husband";
            } else if (relation === "husband") {
                revRelation = "wife";
            } else if (relation === "child") {
                revRelation = "parent";
            } else if (relation === "parent") {
                revRelation = "child";
            } else if (relation === "sibling") {
                revRelation = "sibling";
            }

            const data2 = {
                name: rPatient.name,
                nationalId: rPatient.nationalId,
                patientId: rPatient._id,
                relation: revRelation,
                gender: rPatient.gender,
            }

            rPatient.familyMembers?.push(data);
            pat.familyMembers?.push(data2);

            const savedPat = await rPatient.save();
            const savedPat2 = await pat.save();

            return res.status(200).send([savedPat, savedPat2]);
            
        }
        if (!req.body.mobileNumber && req.body.email) {
            const email = req.body.email;
            const pat = await patient.findOne({ email: email });
            if (!pat) {
                return res.status(404).json({ message: 'Patient with this email was not found.' });
            }
            const data = {
                name : pat.name,
                nationalId: pat.nationalId,
                patientId: pat._id,
                relation: relation,
                gender : pat.gender,
            };


            for(var i = 0 ; i<rPatient.familyMembers?.length! ; i++){
                if(rPatient.familyMembers![i].nationalId === data.nationalId){
                    found = true;
                }
            }
            if (found) {
                return res.status(404).json({ message: 'Patient is already a family member.' });
            }
            else{
                //reverse
                let revRelation = "";

                if (relation === "wife") {
                    revRelation = "husband";
                } else if (relation === "husband") {
                    revRelation = "wife";
                } else if (relation === "child") {
                    revRelation = "parent";
                } else if (relation === "parent") {
                    revRelation = "child";
                } else if (relation === "sibling") {
                    revRelation = "sibling";
                }

                const data2 = {
                    name: rPatient.name,
                    nationalId: rPatient.nationalId,
                    patientId: rPatient._id,
                    relation: revRelation,
                    gender: rPatient.gender,
                }

                rPatient.familyMembers?.push(data);
                pat.familyMembers?.push(data2);

                const savedPat = await rPatient.save();
                const savedPat2 = await pat.save();

                return res.status(200).send([savedPat, savedPat2]);
            }
        }
        if (req.body.mobileNumber && req.body.email) {
            const mobileNumber = req.body.mobileNumber;
            const email = req.body.email;
            const pat = await patient.findOne({ mobileNumber: mobileNumber, email:email });
            if (!pat) {
                console.log("no patient 3");
                return res.status(404).json({ message: 'No patient with this email and number found.' });
            }
            const data = {
                name : pat.name,
                nationalId: pat.nationalId,
                patientId: pat._id,
                relation: relation,
                gender : pat.gender,  
            };
            for(var i = 0 ; i<rPatient.familyMembers?.length! ; i++){
                if(rPatient.familyMembers![i].nationalId === data.nationalId){
                    
                    return res.status(404).json({ message: 'Patient is already a family member.' });
                }
            }

            //reverse
            let revRelation = "";

            if (relation === "wife") {
                revRelation = "husband";
            } else if (relation === "husband") {
                revRelation = "wife";
            } else if (relation === "child") {
                revRelation = "parent";
            } else if (relation === "parent") {
                revRelation = "child";
            } else if (relation === "sibling") {
                revRelation = "sibling";
            }

            const data2 = {
                name: rPatient.name,
                nationalId: rPatient.nationalId,
                patientId: rPatient._id,
                relation: revRelation,
                gender: rPatient.gender,
            }

            rPatient.familyMembers?.push(data);
            pat.familyMembers?.push(data2);

            const savedPat = await rPatient.save();
            const savedPat2 = await pat.save();

            return res.status(200).send([savedPat, savedPat2]);
            
        }

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'No family members found' });
    }
}



export default {
    createPatient,
    readPatient,
    updatePatient,
    deletePatient,
    addFamilyMember,
    readFamilyMember,
    listPatients,
    selectDoctor,
    selectDoctorByNameAndSpeciality,
    listPatientPackages,
    addPackage,
    addPackageToFamMem,
    deletePackage,
    deletePackageFromFamMem,
    getPackageDiscount,
    listDoctorsBySessionPrice,
    filterDoctor,
    viewMyHealthRecords,
    viewWallet,
    readDocuments,
    addDocument,
    deleteDocument,
    readPath,
    linkfamilyMember,
    listFamilyMembers
};
