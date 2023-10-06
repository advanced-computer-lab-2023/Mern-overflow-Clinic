import express from "express";
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import admin from './models/Adminstrator.ts';
import appointment from './models/appointment.ts';
import doctor from './models/Doctor.ts';
import pack from './models/Package.ts';
import user from './models/Patient.ts';
import config from './config/config.ts';

mongoose.set('strictQuery', false);

const MongoURI:string = config.mongo.URL;


//App variables
const app = express();
const port:number = config.server.port;



app.get('/', (req,res)=>{
  res.send("hello");
  console.log("hello, world!");
});



mongoose.connect(MongoURI).then(()=>{
	console.log("MongoDB is now connected!")
// Starting server
  	app.listen(port, () => {
    	console.log(`Listening to requests on http://localhost:${port}`);
  	});
}).catch(err => console.log(err));