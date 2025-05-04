// Thread.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Reply {
  replyId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  votes: {
    up: number;
    down: number;
  };
}

export interface IThread extends Document {
  courseId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  replies: Reply[];
}

const ReplySchema = new Schema<Reply>({
  replyId: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  }
});

const ThreadSchema = new Schema<IThread>({
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema]
});

const Thread = mongoose.model<IThread>('Thread', ThreadSchema);
export default Thread;
