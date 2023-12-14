import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config/config.js";
import authRouter from "./routes/Auth.js";
import doctorRouter from "./routes/Doctors.js";
import patientRouter from "./routes/Patients.js";
import adminRouter from "./routes/Admins.js";
import contractRouter from "./routes/Contracts.js";
import appointmentRouter from "./routes/Appointments.js";
import prescriptionRouter from "./routes/Prescriptions.js";
import packageRouter from "./routes/Package.js";
import CCpaymentRouter from "./routes/Payment.js";
import walletPaymentRouter from "./routes/WalletPayment.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import appointment from "./models/appointment.js";
import PaymentController from "./controllers/PaymentController.js";
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

import path from "path";
import { fileURLToPath } from "url";

// import isAuthenticated from "./middlewares/permissions/isAuthenticated.js";
// import isAuthorized from "./middlewares/permissions/isAuthorized.js";
// import { UserType } from "./enums/UserTypes.js";

mongoose.set("strictQuery", false);

//App variables
const __dirname = process.cwd();
const MongoURI: string = config.mongo.URL;
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1/"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};
app.use(cors(corsOptions));

const port: number = config.server.port;
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static("./src/uploads"));
//app.use(express.static(path.join(__dirname, './uploads')));

app.use(cookieParser());


//ROUTERS
app.use("/auth", authRouter);
app.use("/doctors", doctorRouter);
app.use("/patients", patientRouter);
app.use("/admins", adminRouter);
app.use("/appointments", appointmentRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/packages", packageRouter);
app.use("/create-checkout-session", CCpaymentRouter);
app.use("/walletPayment", walletPaymentRouter);

app.use("/contracts", contractRouter);

// //GET
// app.get("/", (req, res) => {
//   res.send("hello");
//   console.log("hello, world!");
// });

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


// Payment part 
/*const itemsToBePaid = new Map([
    // assuming user selected an entry appointmnet of his appointmnets and it is passed in the request body 
        [1,{priceInCents: , name: "appointment fees"}]
    ])
/*/

export default app;
