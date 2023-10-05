import express from 'express';
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import Package from './models/Package'


dotenv.config();

const app = express();
const PORT = 8000;
const mongoUrl: string = process.env.MONGO_URI!;


// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello, World! This is your Express server.');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });