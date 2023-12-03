import mongoose, { Schema } from "mongoose";

// interface MedicineImage {
//     data: Buffer;
//     contentType: string;
//     filename: string;
// }

interface Details{
    description: string;
    activeIngredients: string[];
}

export interface Imedicine {
    name: string;
    medicinalUse: string;
    details: Details;
    price: number;
    availableQuantity: number;
    sales : number ;
    image: string;
    overTheCounter: boolean;
    isArchived: boolean;
}

const medicineSchema = new Schema<Imedicine>({
    name: { type: String, required: true, unique: true },
    medicinalUse: { type: String, required: true},
    details: {
        description: { type: String, required: true },
        activeIngredients: [{ type: String, required: true }],
    },
    price: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    sales: { type: Number, required: true },
    image: { type: String, required: true, unique: true }
        // data: { type: Buffer, required: false, },
        // contentType: { type: String, required: false, },
        // filename: { type: String,required: false,},
    ,
    overTheCounter: {type: Boolean, required: true},
    isArchived: {type: Boolean, required: true, default: false}
})


medicineSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.name = this.name.toLowerCase();
    }
    if (this.isModified('medicinalUse')) {
        this.medicinalUse = this.medicinalUse.toLowerCase();
    }
    next();
});

const Medicine = mongoose.model<Imedicine>('Medicine', medicineSchema);


export default Medicine;



