import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config/config.js";
import authRouter from "./routes/Auth.js";
import doctorRouter from "./routes/Doctors.js";
import patientRouter from "./routes/Patients.js";
import adminRouter from "./routes/Admins.js";
import contractRouter from "./routes/Contracts.js"
import appointmentRouter from "./routes/Appointments.js";
import prescriptionRouter from "./routes/Prescriptions.js";
import packageRouter from "./routes/Package.js";
import CCpaymentRouter from "./routes/Payment.js";
import walletPaymentRouter from "./routes/WalletPayment.js";
import cors from "cors";
import cookieParser from "cookie-parser";import appointment from "./models/appointment.js";
import PaymentController from "./controllers/PaymentController.js";
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// const connectDB = require("./config/db");
import dotenv from "dotenv";

import userRoutes from "./routes/User.js";
//const chatRoutes = require("./routes/chatRoutes");
import chatRoutes from "./routes/chatRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";

//const messageRoutes = require("./routes/messageRoutes");
import MessageModel from "./models/messageModel.js";


import path from 'path'
import { fileURLToPath } from 'url';






// import isAuthenticated from "./middlewares/permissions/isAuthenticated.js";
// import isAuthorized from "./middlewares/permissions/isAuthorized.js";
// import { UserType } from "./enums/UserTypes.js";


mongoose.set("strictQuery", false);

//App variables
const __dirname = process.cwd();
const MongoURI: string =
  config.mongo.URL ;
const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://127.0.0.1/"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  };
app.use(cors(corsOptions));


const port: number = config.server.port ;
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static('./src/uploads'));
//app.use(express.static(path.join(__dirname, './uploads')));


app.use(cookieParser());

//ROUTERS
app.use('/auth', authRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/admins', adminRouter);
app.use('/appointments', appointmentRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/packages', packageRouter);
app.use('/create-checkout-session', CCpaymentRouter);
app.use('/walletPayment', walletPaymentRouter);

// chat use apis
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use('/contracts',contractRouter);

// //GET
// app.get("/", (req, res) => {
//   res.send("hello");
//   console.log("hello, world!");
// });

let server;

mongoose
  .connect(MongoURI)
  .then(() => 
  {
    console.log("MongoDB is now connected!");
    // Starting server
   
    })
  .catch((err) => console.log(err));
  server = app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`)
  });


// Payment part 
/*const itemsToBePaid = new Map([
    // assuming user selected an entry appointmnet of his appointmnets and it is passed in the request body 
        [1,{priceInCents: , name: "appointment fees"}]
    ])
/*/


 // to accept json data

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
// app.use(notFound);
// app.use(errorHandler);




import { Server } from "socket.io";

console.log(server);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});


io.on("connection", (socket:any) =>
 {
  console.log("Connected to socket.io");
  socket.on("setup", (userData:any) => {
    socket.join(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room:any) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room:any) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room:any) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved:any) => {
    console.log("HALLOO "+newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user:any) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
// we added parameter userData (to be reviewed)
  socket.off("setup", (userData:any) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData);
  });
});



export default app;
