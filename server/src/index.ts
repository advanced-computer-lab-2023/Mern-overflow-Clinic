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
import VideoCallRouter from "./routes/VideoCall.js";
import notificationRouter from "./routes/Notification.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import appointment from "./models/appointment.js";
import PaymentController from "./controllers/PaymentController.js";
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);



// const connectDB = require("./config/db");
import dotenv from "dotenv";

import userRoutes from "./routes/User.js";
//const chatRoutes = require("./routes/chatRoutes");
import chatRoutes from "./routes/chatRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";

//const messageRoutes = require("./routes/messageRoutes");



import path from 'path'
import { fileURLToPath } from 'url';



import dayjs from "dayjs";

import { v4 as uuid } from "uuid";



// import isAuthenticated from "./middlewares/permissions/isAuthenticated.js";
// import isAuthorized from "./middlewares/permissions/isAuthorized.js";
// import { UserType } from "./enums/UserTypes.js";


import { google } from "googleapis";

const calendar = google.calendar({
	version: "v3",
	auth: process.env.API_KEY
})

const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
)

const scopes = [
	'https://www.googleapis.com/auth/calendar'
];
const token = "";



mongoose.set("strictQuery", false);

//App variables
const __dirname = process.cwd();
const MongoURI: string = config.mongo.URL;
const app = express();

app.get("/google", (req, res) => {

	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes
	})

	res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
	const code: any = req.query.code;

	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);

	res.send({
		msg: "You have successfully logged in"
	})
})



app.get("/call/:email1/:email2", async (req, res) => {

	console.log("call");
	const { email1, email2 } = req.params;

	console.log(oauth2Client.credentials.access_token);

	const meet = await calendar.events.insert({
		calendarId: "primary",
		auth: oauth2Client,
		conferenceDataVersion: 1,
		requestBody: {
			summary: "Videocall",
			description: `Call between ${email1} and ${email2}`,
			start: {
				dateTime: dayjs(new Date()).toISOString(),
				timeZone: "Africa/Cairo"
			},
			end: {
				dateTime: dayjs(new Date()).add(1, "hour").toISOString(),
				timeZone: "Africa/Cairo"
			},
			conferenceData: {
				createRequest: {
					requestId: uuid()
				}
			},
			attendees: [{
				email: email1,
			},
			{ email: email2 }
			]
		}
	});

	console.log(meet.data.hangoutLink);

	res.status(200).send({
		link: meet.data.hangoutLink
	})

});
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
app.use('/auth', authRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/admins', adminRouter);
app.use('/notifications', notificationRouter);
app.use('/appointments', appointmentRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/packages', packageRouter);
app.use('/create-checkout-session', CCpaymentRouter);
app.use('/walletPayment', walletPaymentRouter);
app.use("/video", VideoCallRouter);

// chat use apis
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use('/contracts', contractRouter);
app.use(cors({ origin: 'http://localhost:3000' }));


// //GET
// app.get("/", (req, res) => {
//   res.send("hello");
//   console.log("hello, world!");
// });

let server;

mongoose
	.connect(MongoURI)
	.then(() => {
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
import axios from "axios";

console.log(server);

export const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3000",
		// credentials: true,
	},
});


io.on("connection", (socket: any) => {
	console.log("Connected to socket.io");
	socket.on("setup", (userData: any) => {
		socket.join(userData);
		socket.emit("connected");
	});
	socket.on("setupNotifications", (userId: string) => {
		console.log("User Joined Notification Room");
		socket.join(userId);
	});

	socket.on("join chat", (room: any) => {
		socket.join(room);
		console.log("User Joined Room: " + room);
	});
	socket.on("typing", (room: any) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room: any) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved: any) => {
		console.log("HALLOO " + newMessageRecieved);
		var chat = newMessageRecieved.chat;

		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((user: any) => {
			if (user._id == newMessageRecieved.sender._id) return;

			socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});
	// we added parameter userData (to be reviewed)
	socket.off("setup", (userData: any) => {
		console.log("USER DISCONNECTED");
		socket.leave(userData);
	});
});


export default app;
