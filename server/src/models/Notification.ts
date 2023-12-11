import { Document, Schema, Model, model, Types } from 'mongoose';


export interface INotification extends Document {
  sender: Types.ObjectId;
  content: string;
  chat?: Types.ObjectId;
  readBy?: (Types.ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User',required:true },
    content: { type: String, trim: true,required:true  },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat',required:false  },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' ,required:true }],
  },
  { timestamps: true }
);

const notificationModel: Model<INotification> = model('Notification', notificationSchema);

export default notificationModel;
