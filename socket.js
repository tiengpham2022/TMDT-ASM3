let io;
const socket = require("socket.io");

module.exports = {
  init: (httpServer) => {
    io = new socket.Server(httpServer, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
