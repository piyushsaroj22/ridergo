import { Socket } from "socket.io";

export const joinAccountRoom = (
  socket: Socket,
  accountType: "User" | "Driver",
  accountId: string,
) => {
  const room = `${accountType}:${accountId}`;

  socket.join(room);

  console.log(`${socket.id} joined room ${room}`);
};

export const leaveAccountRoom = (
  socket: Socket,
  accountType: "User" | "Driver",
  accountId: string,
) => {
  const room = `${accountType}:${accountId}`;

  socket.leave(room);

  console.log(`${socket.id} left room ${room}`);
};
