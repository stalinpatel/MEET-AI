// lib/io.ts
import type { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export function setIOInstance(serverIO: IOServer) {
  io = serverIO;
}

export function getIOInstance(): IOServer {
  if (!io) throw new Error("❌ Socket.IO server not initialized");
  return io;
}
