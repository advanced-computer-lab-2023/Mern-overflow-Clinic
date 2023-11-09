import mongoose, { Schema, Types ,model, connect } from 'mongoose';

export interface IFile {
    patient: Types.ObjectId;
    doctor: Types.ObjectId;
    filename: string;
    path: string;
}

// 2. Create a Schema corresponding to the document interface.
const FileSchema = new Schema<IFile>({
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    filename: [{ type: String, required: false }],
    path: { type: String, required: true },
});

// 3. Create a Model.
const File = model<IFile>('File', FileSchema);


export default mongoose.model<IFile>("File", FileSchema);