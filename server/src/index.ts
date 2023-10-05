import express from "express";
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import addPatient from './controller/userController.ts'
import patient from './models/Patient.ts';
import exp from "constants";
import { Request, Response } from 'express';

dotenv.config()

mongoose.set('strictQuery', false);

const MongoURI:string = "mongodb+srv://dbuser:987654321@acl.n4q8ykx.mongodb.net/?retryWrites=true&w=majority"!;


//App variables
const app = express();
const port:number = parseInt(process.env.PORT!) as number || 8000;

//app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
// app.use(express.json);

//GET 
app.get('/', (req,res)=>{
  res.send("hello");
  console.log("hello, world!");
});




//POST
app.post("/addPatient", (req:Request,res:Response)=>{
  console.log("");
  console.log("");
  console.log("=");
  console.log(req.body);
  console.log(req.body.username);
  console.log(req.body.username!);
  
  const newPatient = new patient(
    {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        mobileNumber: req.body.mobileNumber,
        emergencyContact: req.body.emergencyContact
    }
    )
    
    newPatient.save().then((result)=>{
        res.send(result);
    }).catch((err)=>{
        //console.log(err);
    });
});


//DELETE



mongoose.connect(MongoURI).then(()=>{
	console.log("MongoDB is now connected!")
// Starting server
  	app.listen(port, () => {
    	console.log(`Listening to requests on http://localhost:${port}`);
  	});
}).catch(err => console.log(err));