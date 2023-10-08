import mongoose, {Document, Schema, model} from "mongoose";

interface IUser extends Document {
    username:string;
    passwordHash: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true , unique: true },
    passwordHash:{ type: String, required: true },  
})

const User = model<IUser>('User', userSchema);

export default mongoose.model<IUser>("User", userSchema);