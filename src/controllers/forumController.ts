// forumController.ts
import { Request, Response } from 'express';
import Thread from '../models/Thread';
import { io } from '../server';

// GET all threads with pagination
export const getAllThreads = async (req: Request, res: Response) => {
  const { id: courseId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  const threads = await Thread.find({ courseId })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const total = await Thread.countDocuments({ courseId });

  return res.status(200).json({
    total,
    page: pageNumber,
    limit: limitNumber,
    threads
  });
};

// GET single thread with paginated replies
export const getThreadById = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const thread = await Thread.findById(threadId);
  if (!thread) return res.status(404).json({ message: 'Thread not found' });

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  const totalReplies = thread.replies.length;
  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;

  const replies = thread.replies.slice(start, end);

  return res.status(200).json({
    threadId: thread._id,
    title: thread.title,
    content: thread.content,
    createdBy: thread.createdBy,
    createdAt: thread.createdAt,
    replies,
    totalReplies,
    page: pageNumber,
    limit: limitNumber
  });
};

// POST create new thread
export const createThread = async (req: Request, res: Response) => {
  const { id: courseId } = req.params;
  const { title, content } = req.body;
  const createdBy = req.user.id; // Ensure middleware sets req.user

  const newThread = await Thread.create({
    courseId,
    title,
    content,
    createdBy
  });

  io.emit('newThread', newThread);

  return res.status(201).json(newThread);
};

// POST reply to thread
export const postReply = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { content } = req.body;
  const createdBy = req.user.id;

  const thread = await Thread.findById(threadId);
  if (!thread) return res.status(404).json({ message: 'Thread not found' });

  const newReply = {
    replyId: crypto.randomUUID(),
    content,
    createdBy,
    votes: { up: 0, down: 0 },
    createdAt: new Date()
  };

  thread.replies.unshift(newReply);
  await thread.save();

  io.emit('newReply', { threadId, reply: newReply });

  return res.status(201).json(newReply);
};
