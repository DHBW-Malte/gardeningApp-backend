const newSensorBuffer = {};

function notifyClients(userId, message) {
    if (!ioInstance) return;
    ioInstance.to(`user:${userId}`).emit(message.type, message);
}

function setPendingSensor(userId, message) {
    newSensorBuffer[userId] = message;
}

function handleClientReady(socket) {
    socket.on("client-ready", (userId) => {
        const message = newSensorBuffer[userId];
        if (message) {
            console.log(`[Socket] Emitting buffered NEW_SENSOR for user ${userId}`);
            socket.to(`user:${userId}`).emit(message.type, message);
            delete newSensorBuffer[userId];
        }
    });
}

function initSocketIO(io) {
    ioInstance = io;
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-user-room", (userId) => {
            socket.join(`user:${userId}`);
            console.log(`Socket ${socket.id} joined room user:${userId}`);
        });

        handleClientReady(socket);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

module.exports = {
    initSocketIO,
    notifyClients,
    setPendingSensor,
};
