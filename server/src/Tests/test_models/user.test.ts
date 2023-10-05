import { Model } from 'mongoose';
import User, { IUser } from '../../models/User'; // Import your user model and interface

describe('User Model', () => {
    // let UserModel = Model<IUser>

    beforeAll(() => {
        // UserModel = User;
    });

    it('should save a new user', async () => {
        // const newUser = new UserModel({
        //   username: 'testuser',
        //   name: 'Test User',
        //   // ...other properties
        // });
        // const savedUser = await newUser.save();
        console.log("here")
        // expect(savedUser.username).toBe('testuser');
        // Add more assertions as needed
    });

    //   it('should not allow saving a user with invalid data', async () => {
    //     const invalidUser = new UserModel({
    //       // Provide invalid data
    //     });

    //     let error;
    //     try {
    //       await invalidUser.save();
    //     } catch (e) {
    //       error = e;
    //     }

    //     expect(error).toBeDefined();
    //     // Add more assertions to check the specific validation errors
    //   });

    // Add more test cases as needed
});
