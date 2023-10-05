import express from "express";
import mongoose from 'mongoose';
import axios from 'axios';
import bodyParser from 'body-parser';
import admin from './models/Adminstrator.ts';
import appointment from './models/appointment.ts';
import doctor from './models/Doctor.ts';
import pack from './models/Package.ts';
import user from './models/User.ts';
import dotenv from 'dotenv';

dotenv.config()

mongoose.set('strictQuery', false);
;
const MongoURI = "mongodb+srv://dbuser:987654321@acl.n4q8ykx.mongodb.net/?retryWrites=true&w=majority";


//App variables
const app = express();
const port = process.env.PORT || 8000;


app.get('/', (req,res)=>{
  res.send("hello");
  console.log("hello, world!");
});



mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
  app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
})
.catch(err => console.log(err));