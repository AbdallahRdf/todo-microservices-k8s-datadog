import { Types } from "mongoose";
import { ITask, Task } from "../models/tasks.model";
import { AppError } from "../utils/AppError";

const getTasks = async (userId: string) => {

    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const tasks = await Task.find({ userId: Types.ObjectId.createFromHexString(userId) }, { __v: 0, userId: 0, createdAt: 0, updatedAt: 0 });
    return tasks;
}

const createTask = async (task: Omit<ITask, "userId">, userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }
    const newTask = await Task.create({
        ...task,
        userId: Types.ObjectId.createFromHexString(userId)
    });
    return newTask;
}

const getTask = async (taskId: string, userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }
    const task = await Task.findOne({ _id: taskId, userId: Types.ObjectId.createFromHexString(userId) }, { __v: 0, userId: 0, createdAt: 0, updatedAt: 0 });
    if (!task)
        throw new AppError("Task not found", 404);
    return task;
}

const updateTask = async (taskId: string, task: Omit<ITask, "userId">, userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }
    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId: Types.ObjectId.createFromHexString(userId) },
        { ...task },
        { new: true, runValidators: true }
    );
    if (!updatedTask)
        throw new AppError("Task not found", 404);
    return updatedTask;
}

const deleteTask = async (taskId: string, userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }
    await Task.findOneAndDelete({ _id: taskId, userId: Types.ObjectId.createFromHexString(userId) });
}

const tasksService = {
    getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}

export default tasksService;