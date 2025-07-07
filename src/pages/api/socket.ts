import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { NextApiResponseWithSocket } from "@/types/socket";
import { setIOInstance } from "@/lib/io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("🔥 Initializing Socket.IO...");

    const io = new Server(res.socket.server, {
      path: "/api/socket", // ⚠️ use the same path as the API route
    });
    setIOInstance(io); // 👈 register the global instance
    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);

      socket.on("join-room", (meetingId) => {
        console.log(`🔗 ${socket.id} joined room ${meetingId}`);
        socket.join(meetingId);
      });

      // example emit
      socket.emit("server-ready", { message: "Welcome 👋" });
    });

    res.socket.server.io = io;
  } else {
    console.log("♻️ Reusing existing Socket.IO server");
  }
  res.end();
};

export default handler;
