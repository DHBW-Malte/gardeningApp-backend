let ioInstance = null;

function initSocketIO(io) {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-user-room", (userId) => {
            socket.join(`user:${userId}`);
            console.log(`Socket ${socket.id} joined room user:${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

function notifyClients(userId, message) {
    if (!ioInstance) return;
    ioInstance.to(`user:${userId}`).emit("MOISTURE_UPDATE", message);
}

module.exports = {
    initSocketIO,
    notifyClients
};
