import { Document, Schema, Model, model, Types } from 'mongoose';


export interface INotification extends Document {
  receiver: Types.ObjectId;
  content: string;
  createdAt: Date;
  read: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    receiver: { type: Schema.Types.ObjectId, ref: 'User',required:true },
    content: { type: String, trim: true,required:true  },
    read: { type: Boolean,default: false ,required:true },
  },
  { timestamps: true }
);

const notification: Model<INotification> = model('Notification', notificationSchema);

export default notification;
