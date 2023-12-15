<p align="center">
    <img width="100" src="https://i.imgur.com/M5HToBU.png" alt="logo">
</p>

# El7a2ny Clinic App

El7a2ny Clinic is a comprehensive healthcare platform that caters to the diverse needs of doctors and patients, offering an integrated suite of features tailored to each user group. Doctors benefit from tools to streamline their practice, from updating professional information and managing appointments to accessing patient records, prescribing medications, and conducting video calls. Patients experience a user-friendly interface, allowing them to manage health records, schedule appointments, subscribe to health packages, and interact with healthcare providers through secure chat and video calls. The platform prioritizes efficiency, accessibility, and transparent communication, empowering healthcare stakeholders in their respective roles.

## Badges

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23EFD81D.svg?style=for-the-badge&logo=javascript&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React.js](https://img.shields.io/badge/react-%235ED3F3.svg?style=for-the-badge&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Stripe](https://img.shields.io/badge/stripe-%235469D4.svg?style=for-the-badge&logo=stripe&logoColor=white)
![JEST](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%231D63ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/postman-%23F76935.svg?style=for-the-badge&logo=postman&logoColor=white)
![NPM](https://img.shields.io/badge/npm-%23C53635.svg?style=for-the-badge&logo=npm&logoColor=white)

## Table of Contents

-   [Build Status 🔨](#build-status-)
-   [Code Style 📜](#code-style-)
-   [Demo \& Screenshots 📸](#demo--screenshots-)
-   [Tech Stack 🧰🔧](#tech-stack-)
-   [Features ✨](#features-)
-   [Code Examples 👉](#code-examples-)
-   [Installation 📥](#installation-)
-   [How to Use ❓](#how-to-use-)
-   [API Reference 📖](#api-reference-)
-   [Tests 🧪](#tests-)
-   [Contribute 🤝](#contribute-)
-   [Credits 🙏](#credits-)
-   [Authors 🧑‍💻️](#authors-️)
-   [License ⚖️](#license-️)

## Build Status 🔨

- The project is currently in development.
- The project needs to be deployed through a cloud service.
- The project needs more thorough testing.
- Need to add screenshots, code examples, and tests to the README

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Code Style 📜

The code style used is `eslint` and [`prettier`](https://prettier.io/docs/en/). The code style is enforced using `pre-commit` hooks

To use the code style we follow, run these commands

Install pre-commit package by running

```bash
> pip install pre-commit
```

Once installed, run the following for a one-time setup

```bash
> pre-commit install
```

You will then need to run the following command each time before your next commit attempt

```javascript
> npx prettier . --write
```

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Demo & Screenshots 📸

<details>
<summary>Authentication</summary>

| ![Sign in Page](https://github.com/advanced-computer-lab-2023/Mern-overflow-Pharmacy/assets/97978852/79045f97-1651-4a3d-81d0-70beb62bfe28) |
|:---:|
| <p style="text-align:center">Sign In Page</p>|

| ![Patient Registration](https://github.com/advanced-computer-lab-2023/Mern-overflow-Pharmacy/assets/97978852/f68625a2-1893-41e2-bf83-107cee344989) |
|:---:|
| <p style="text-align:center">Patient Registration</p>|

</details>


<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Tech Stack 🧰🔧

**Client:** React, Redux, Material-UI, JavaScript

**Server:** Node, Express, MongoDB, Mongoose, TypeScript, JWT, Stripe API, Postman, Jest

**General:** Docker, Git & GitHub, VSCode

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Features ✨

<details>
<summary> Guests can </summary>

-   Sign in to their account
-   Sign up as a patient
-   Request to sign up as a doctor
-   Reset forgotten password through OTP sent to email
</details>

<details>
<summary> Logged in System Users can </summary>

-   Change their password
-   Sign out
</details>

<details>
<summary> Admins can </summary>

-   Add another admin with a set username and password
-   Remove doctor/admin from the system
-   View all information uploaded by doctors who applied to join the platform
-   Accept or reject doctor proposals
-   Add/Update/Delete health packages with different price ranges
-   View a total sales report based on a chosen month
-   View information about any user on the system
</details>

<details>
<summary> Doctors can </summary>

-   Update their information (email, hourly rate, affiliation)
-   View and accept employment contract
-   Add their available time slots for appointments
-   Filter appointments by date/status
-   View information and health records of patients registered with them
-   View all new and old prescriptions and their statuses
-   View a list of all their patients
-   Search for a patient using their name
-   Filter patients based on upcoming appointments
-   Receive notifications of their appointments on the system and by mail
-   View a list of all their upcoming/past appointments
-   Filter appointments by date or status
-   Reschedule an appointment for a patient
-   Cancel an appointment
-   Receive notifications about canceled or rescheduled appointments on the system and by mail
-   Schedule a follow-up for a patient
-   Add / Delete medicine to/from the prescription from the pharmacy platform
-   Add / Update dosage for each medicine added to the prescription
-   Download the selected prescription (PDF)
-   Add new health records for a patient
-   Start / End a video call with a patient
-   Chat with a patient
-   Add a patient's prescription
-   Update a patient's prescription before it is submitted to the pharmacy
-   Accept or revoke a follow-up session request from a patient
-   View the amount in their wallet
</details>

<details>
<summary> Patients can </summary>

-   Upload/remove documents (PDF, JPEG, JPG, PNG) for their medical history
-   View uploaded health records
-   Add family members to the system
-   Link another existing patient's account as a family member
-   View registered family members
-   Choose to pay for their appointments using a wallet or credit card
-   Enter credit card details and pay for an appointment using Stripe
-   Filter appointments by date/status
-   View all new and old prescriptions and their statuses
-   View health package options and details
-   Subscribe to a health package for themselves and their family members
-   Pay for the chosen health package using the wallet or credit card
-   View subscribed health packages for themselves and their family members
-   View the status of their health care package subscription
-   Cancel a subscription to a health package
-   View a list of all doctors along with their specialty, and session price (based on subscribed health package if any)
-   Search for a doctor by name and/or specialty
-   Filter a doctor by specialty and/or availability on a certain date and at a specific time
-   View details about a specific selected doctor
-   Select an appointment date and time for themselves or for a family member
-   Receive a notification of their appointment on the system and by mail
-   View a list of their upcoming/past appointments
-   Filter appointments by date or status
-   Reschedule an appointment for themselves or for a family member
-   Cancel an appointment for themselves or for a family member
-   Receive notification about canceled or rescheduled appointments on the system and by mail
-   View a list of all their prescriptions
-   Filter prescriptions based on date or doctor or fulfillment status
-   View the details of a selected prescription
-   Pay directly for the prescription items by wallet or credit card
-   Download a prescription (PDF)
-   Start / End a video call with a doctor
-   Chat with a doctor
-   Request a follow-up to a previous appointment for themselves or a family member
-   Receive a refund in their wallet when a doctor cancels an appointment
-   View the amount in their wallet
</details>

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Code Examples 👉

<details>
<summary> Delete an Admin from System </summary>

```javascript
const deleteAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  const adminToDelete = adminstrator
    .findByIdAndDelete({ _id: id })
    .then((adminToDelete) => {
      res.status(200).json(adminToDelete);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
```

</details>

<details>
<summary> Create an Appointment </summary>

```javascript
const createAppointment = async (req: Request, res: Response) => {
  req.body.duration = 1;
  req.body.status = "upcoming";
  req.body.appointmentType = "regular";
  const patientEmail = await Users.findById(req.body.patient).then(
    (pat) => pat?.email,
  );
  const doctorEmail = await Users.findById(req.body.doctor).then(
    (doc) => doc?.email,
  );

  if (patientEmail === undefined || doctorEmail === undefined) {
    return res.status(400).json();
  }
  const newApt = appointment
    .create(req.body)
    .then((newApt) => {
      const subject = "Appointment Booked";
      let html = `Hello patient, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ny Clinic xoxo.`;
      sendMailService.sendMail(patientEmail, subject, html);
      html = `Hello doctor, \n A new appointment was booked with date ${req.body.date}. \n Please be on time. \n With Love, \n El7a2ny Clinic xoxo.`;
      sendMailService.sendMail(doctorEmail, subject, html);
      return res.status(200).json(newApt);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};
```

</details>

<details>
<summary> Create Contract </summary>

```javascript
const createContract = async (req: Request, res: Response) => {
    req.body.date = Date.now();
    req.body.admin = req.params.id;

    const newContract = contract
    .create(req.body)
    .then((newContract) => {
        return res.status(200).json(newContract);
    })
    .catch((err) => {
        return res.status(400).json(err);
    });
}
```

</details>

<details>
<summary> Add Admin Form Component</summary>

```javascript
<Box component="form" onSubmit={handleSubmit(onSubmit)}>
    <TextField label="Username" />
    <TextField label="Email" />
    <TextField label="Password" />
    <Button type="submit" variant="outlined">
        Add Admin
    </Button>
</Box>
```

</details>

<details>
<summary>AppBar Component</summary>

```javascript
<AppBar position="static">
  <Toolbar>
    <IconButton>
      <MenuIcon />
    </IconButton>
    <Typography>
      {props.title}
    </Typography>
    <Button type="button" color="inherit" onClick={handleLogout}>
      {" "}
      Log out{" "}
    </Button>
  </Toolbar>
</AppBar>
```

</details>

 <p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Installation 📥

Clone the project

```bash
> git clone https://github.com/advanced-computer-lab-2023/Mern-overflow-Clinic
```

Go to the project directory

```bash
> cd Mern-overflow-Clinic
```

Install dependencies

```bash
> cd server && npm i && cd -
> cd client && npm i && cd -
```

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## How to Use ❓

<details open>
<summary>Using Docker</summary>

First, you need to build the container. You need to do this the first time only.

```bash
> make build
```

Start the back-end

```bash
> make up
```

Start the client side

```bash
> make f-up
```

</details>

<details>
<summary>Manually</summary>

Start the back-end server

```bash
> cd server && npm run dev
```

Start the client side

```bash
> cd client && npm start
```
</details>

### Environment Variables 📃

To run this project, you will need to add the following environment variables to your `server/.env` file. You can find an environment variables file example in `server/.env.example`

`MONGO_URI`

`PORT`

`JWT_SECRET`

`EMAIL`

`EMAILPASSWORD`

 <p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## API Reference 📖

<details>
    <summary>Authentication routes</summary>

|method|route|returns|
|--|--|--|
|POST|```/auth/login/```|Log in|
|POST|```/auth/logout/```|Log out|
|POST|```/auth/reset/```|Reset Password|
|POST|```/auth/resetwithtoken/```|Reset Password with Token|
|POST|```/auth/change/```|Change Password|
</details>

<details>
    <summary>Admin routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/admins/```|View all admins|
|POST|```/admins/:id/createContract```|Create a contract|
|POST|```/admins/```|Create an admin|
|POST|```/admins/acceptDoctorRequest/```|Accept a doctor request|
|POST|```/admins/rejectDoctorRequest/```|Reject a doctor request|
|DELETE|```/admins/:id/```|Delete an admin|
</details>

<details>
    <summary>Doctor routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/doctors/```|View all doctors|
|GET|```/doctors/pendingDoctors/```|View all pending doctors|
|GET|```/doctors/:id/```|View all details about a doctor|
|GET|```/doctors/:id/slots/```|View all slots of a doctor|
|GET|```/doctors/:id/completedAppointments/```|View all completed appointments of a doctor|
|GET|```/doctors/:id/```|View details of a doctor|
|GET|```/doctors/:id/wallet/```|View wallet amount of a doctor|
|GET|```/doctors/:id/patients/```|View all patients of a doctor|
|GET|```/doctors/:id/registeredPatients/```|View all patients having upcoming appointment with a doctor|
|GET|```/doctors/:id/patients/:pId/```|View all details about a patient by Id|
|GET|```/doctors/:id/search/```|View all details about a patient by name|
|GET|```/doctors/:id/res/```|View all patients having non-cancelled appointment with a doctor|
|GET|```/doctors/:dId/search/```|Patients can view details of a selected doctor|
|GET|```/doctors/doctorsSearch/```|Patients can search for a doctor by name or speciality|
|POST|```/doctors/```|Create a doctor|
|POST|```/doctors/filter/```|View doctors based on specialization|
|POST|```/doctors/:id/addHealthRecord/```|Add a health record|
|POST|```/doctors/:id/createFollowup/```|View doctors based on specialization|
|PUT|```/doctors/:id/```|Update a doctor's details|
|PUT|```/doctors/:id/acceptContract```|Accept a contract|
|PUT|```/doctors/:id/rejectContract/```|Reject a contract|
|PUT|```/doctors:id/addSlots/```|Add slots for a doctor|
|DELETE|```/doctors:id/```|Delete a doctor|
</details>

<details>
    <summary>Patient routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/patients/```|View all patients|
|GET|```/patients/:id/```|View all details about a patient|
|GET|```/patients/:id/family/```|View all family members of a patient|
|GET|```/patients/:id/relatives/```|???|
|GET|```/patients/:id/price/```|View doctors by session price|
|GET|```/patients/:id/prescriptions/```|View a patient's prescriptions|
|GET|```/patients/:id/packages/```|View a patient's packages|
|GET|```/patients/:id/packages/:pId/discount```|View a patient's package discount|
|GET|```/patients/:id/wallet/```|View a patient's wallet amount|
|GET|```/patients/:id/documents/```|View a patient's documents|
|GET|```/patients/:id/document/```|View a patient's document|
|GET|```/patients/:id/healthRecords/```|View a patient's health records|
|POST|```/patients/```|Create a patient|
|POST|```/patients/:id/familyMember/```|Add a family member to a patient|
|POST|```/patients/linkfamilyMember/```|Link a patient's account to another patient's family|
|POST|```/patients/:id/documents/```|Add a document to a patient's account|
|POST|```/patients/:id/packages/:packageId```|Add a package to a patient's account|
|POST|```/patients:id/packages/:pId/:packageId/```|Add a package to a family member|
|POST|```/patients/:id/prescriptionsFilter/```|Filter a patient's prescriptions|
|DELETE|```/patients/:id/```|Delete a patient|
|DELETE|```/patients/:id/documents/```|Delete a document|
|DELETE|```/patients/:id/packages/```|Delete a package|
|DELETE|```/patients/:id/packages/pId/```|Delete a package from a family member|
</details>

<details>
    <summary>Package routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/packages/```|View all packages|
|GET|```/packages/:id/```|View details of a package|
|POST|```/packages/```|Create a package|
|PUT|```/packages/:id/```|Update details of a package|
|DELETE|```/packages/:id/```|Delete a package|
</details>

<details>
    <summary>Contract routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/contracts/:id/```|Read a contract|
|PUT|```/contracts/```|Update a contract|
|DELETE|```/contracts/```|Delete a contract|
</details>

<details>
    <summary>Appointment routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/appointments/```|View all appointments|
|GET|```/appointments/:id/```|View details of an appointment|
|GET|```/appointments/all/:id/```|???|
|POST|```/appointments/```|Create an appointment|
|POST|```/appointments/filter/:id/```|Filter appointments|
|POST|```/appointments/update/```|Update an appointment|
|POST|```/appointments/createAppointmentsForRelations/```|Create an appointment for a family member|
|DELETE|```/appointments/:id/```|Delete an appointment|
</details>

<details>
    <summary>Prescription routes</summary>

|method|route|returns|
|--|--|--|
|GET|```/prescriptions/:id```|View details of a prescription|
|POST|```/prescriptions/```|Create a prescription|
|PUT|```/prescriptions/:id```|Update details of a prescription|
|DELETE|```/prescriptions/:id```|Delete a prescription|
</details>

<details>
    <summary>Payment routes</summary>

|method|route|returns|
|--|--|--|
|POST|```/create-checkout-session/appointments/```|Pay for an appointment using credit card|
|POST|```/create-checkout-session/healthPackages/```|Pay for a health package using credit card|
|POST|```/walletPayment/appointments/```|Pay for an appointment using wallet|
|POST|```/walletPayment/healthPackages/```|Pay for a health package using wallet|
</details>

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Tests 🧪

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Contribute 🤝

Contributions are always welcome!

### Getting Started

1. Fork the repository
2. Clone the repository
3. Install dependencies
4. Create a new branch
5. Make your changes
6. Commit and push your changes
7. Create a pull request
8. Wait for your pull request to be reviewed and merged

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Please read the full text so that you can understand what actions will and will not be tolerated.

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Credits 🙏

-   [JWT docs](https://jwt.io/introduction)
-   [Stripe docs](https://stripe.com/docs)
-   [Node.js docs](https://nodejs.org/en/docs/)
-   [Express.js docs](https://expressjs.com/en/4x/api.html)
-   [React.js docs](https://legacy.reactjs.org/docs/getting-started.html)
-   [MongoDB docs](https://www.mongodb.com/docs/)
-   [Mongoose docs](https://mongoosejs.com/docs/)
-   [SimpliLearn Blog about MERN](https://www.simplilearn.com/tutorials/mongodb-tutorial/what-is-mern-stack-introduction-and-examples)
-   [MERN Stack | GeeksforGeeks](https://www.geeksforgeeks.org/mern-stack/)
-   [MongoDB guide to MERN](https://www.mongodb.com/languages/mern-stack-tutorial)
-   [NetNinja MERN playlist](https://www.youtube.com/watch?v=98BzS5Oz5E4&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE)
-   [MERN stack tutorial | freeCodecAmp](https://www.youtube.com/watch?v=-42K44A1oMA)

 <p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## Authors 🧑‍💻️

| [Abdelrahman Saleh](https://github.com/19AbdelrahmanSalah19) | [Ahmed Wael](https://github.com/ahmedwael216) | [John Fayez](https://www.github.com/john-roufaeil)  | [Logine Mohamed](https://github.com/logine20)  | [Mohamed Mohey](https://github.com/mmi333) |
| ------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------- | -------------------------------------- | ------------------------------------------ |
| [Ahmed Yasser](https://github.com/ahmedyasser07)             | [Alaa Aref](https://github.com/AlaM-01)       | [Ibrahim Soltan](https://github.com/Ibrahim-Soltan) | [Omar Wael](https://github.com/o-wael) | [Mohamed Elsheka](https://github.com/MOHAMEDELSHEKHA)                            |

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>

## License ⚖️

- This software product is open source under the [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/) License.

- Stripe is licensed under the Apache License 2.0 

<p align="right" title="Return to Table of Contents"> <a href="#table-of-contents">&#11014;</a></p>
