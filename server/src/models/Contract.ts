import mongoose, {Schema,Types, model} from "mongoose";


interface IContract {
    doctor: Types.ObjectId;
    admin: Types.ObjectId;
    date: Date;
    clinicMarkup: number;
    status:string;
}

const contractSchema = new Schema<IContract>({
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    admin: { type: Schema.Types.ObjectId, ref: "Adminstrator", required: true },
    date: { type: Date, required: true },
    clinicMarkup: { type: Number, required: true , min:0,max:100},
    status: { type: String, required: true, lowercase: true, enum: ['accepted', 'rejected','pending'], default: 'pending'},
})

const Contract = model<IContract>('Contract', contractSchema);


export default mongoose.model<IContract>("Contract", contractSchema);
