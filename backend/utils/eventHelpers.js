import Activity from "../models/ActivityModel.js";
import Notification from "../models/NotificationModel.js";
import { getIO, getOnlineUsers } from "../config/socket.js";

export const logActivity = async ({
  repoId,
  userId,
  eventType,
  message,
  metadata = {},
}) => {
  return await Activity.create({
    repoId,
    userId,
    eventType,
    message,
    metadata,
  });
};

export const createNotification = async ({
  userId,
  message,
  type,
  repoId = null,
}) => {
  return await Notification.create({
    userId,
    message,
    type,
    repoId,
  });
};

export const emitRepoEvent = (repoId, eventName, payload) => {
  const io = getIO();
  io.to(`repo_${repoId}`).emit(eventName, payload);
};

export const emitUserNotification = (userId, payload) => {
  const io = getIO();
  const onlineUsers = getOnlineUsers();
  const socketId = onlineUsers.get(String(userId));

  if (socketId) {
    io.to(socketId).emit("notification", payload);
  }
};