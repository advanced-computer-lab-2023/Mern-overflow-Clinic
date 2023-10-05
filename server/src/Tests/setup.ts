import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoUrl: string = process.env.MONGO_URI!;


beforeAll(async () => {
  await mongoose.connect(mongoUrl);
});

afterAll(async () => {
  await mongoose.disconnect();
});
