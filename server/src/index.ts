import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config/config.js";
import authRouter from "./routes/Auth.js";
import doctorRouter from "./routes/Doctors.js";
import patientRouter from "./routes/Patients.js";
import adminRouter from "./routes/Admins.js";
import appointmentRouter from "./routes/Appointments.js";
import prescriptionRouter from "./routes/Prescriptions.js";
import packageRouter from "./routes/Package.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// import isAuthenticated from "./middlewares/permissions/isAuthenticated.js";
// import isAuthorized from "./middlewares/permissions/isAuthorized.js";
// import { UserType } from "./enums/UserTypes.js";

mongoose.set("strictQuery", false);

//App variables
const MongoURI: string =
  config.mongo.URL ||
  "mongodb+srv://dbuser:987654321@acl.n4q8ykx.mongodb.net/?retryWrites=true&w=majority";
const app = express();

const port: number = config.server.port || 8000;
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//ROUTERS
app.use("/auth", authRouter);
app.use("/doctors", doctorRouter);
app.use("/patients", patientRouter);
app.use("/admins", adminRouter);
app.use("/appointments", appointmentRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/packages", packageRouter);

//GET
app.get("/", (req, res) => {
  res.send("hello");
  console.log("hello, world!");
});

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

export default app;
