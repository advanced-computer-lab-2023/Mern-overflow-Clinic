import mongoose, { Model } from 'mongoose';
import Patient from '../../models/Patient.js'; // Import your user model and interface
import config from '../../config/config.js';
const mongoUrl: string = config.mongo.URL!;



test('should save a new user',async () => {
    // let userModel = User;
    await mongoose.connect(mongoUrl);
    const newPatient = new Patient({
        username: 'testpatient',
        name: 'Test Patient',
        email: 'tesst@gmail.com',
        passwordHash: '123456',
        dateOfBirth: new Date('1999-01-01'),
        gender: 'male',
      mobileNumber: '01000000000',
      emergencyContact: {
          name: 'father',
          mobileNumber: '01000000001'
      }
  });
  const savedPatient = await newPatient.save();
  expect(savedPatient.username).toBe('testpatient');
});


// describe('User Model', () => {
//     let UserModel = Model<IUser>

//     beforeAll(() => {
//         UserModel = User;
//     });

//     it('should save a new user', async () => {
//         const newUser = new UserModel({
//           	username: 'testuser',
//           	name: 'Test User',
//           	email: 'tesst@gmail.com',
//           	passwordHash: '123456',
//           	dateOfBirth: new Date('1999-01-01'),
//           	gender: 'male',
//             mobileNumber: '01000000000',
// 			emergencyContact: {
// 				name: 'father',
// 				mobileNumber: '01000000001'
// 			}
//         });
//         const savedPatient = await newUser.save();
//         expect(savedPatient.username).toBe('testuser');
//         // Add more assertions as needed
//     });

//     //   it('should not allow saving a user with invalid data', async () => {
//     //     const invalidUser = new UserModel({
//     //       // Provide invalid data
//     //     });

//     //     let error;
//     //     try {
//     //       await invalidUser.save();
//     //     } catch (e) {
//     //       error = e;
//     //     }

//     //     expect(error).toBeDefined();
//     //     // Add more assertions to check the specific validation errors
//     //   });

//     // Add more test cases as needed
// });
