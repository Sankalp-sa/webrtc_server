"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var rooms = {};
var chats = {};
var roomHandler = function (socket) {
    var createRoom = function () {
        var roomId = (0, uuid_1.v4)();
        rooms[roomId] = {};
        socket.emit("room-created", { roomId: roomId });
        console.log("user created the room");
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, peerId = _a.peerId, userName = _a.userName;
        if (!rooms[roomId])
            rooms[roomId] = {};
        if (!chats[roomId])
            chats[roomId] = [];
        socket.emit("get-messages", chats[roomId]);
        console.log("user joined the room", roomId, peerId, userName);
        rooms[roomId][peerId] = { peerId: peerId, userName: userName };
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId: peerId, userName: userName });
        socket.emit("get-users", {
            roomId: roomId,
            participants: rooms[roomId],
        });
        socket.on("disconnect", function () {
            console.log("user left the room", peerId);
            leaveRoom({ roomId: roomId, peerId: peerId });
        });
    };
    var leaveRoom = function (_a) {
        var peerId = _a.peerId, roomId = _a.roomId;
        // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    };
    var startSharing = function (_a) {
        var peerId = _a.peerId, roomId = _a.roomId;
        console.log({ roomId: roomId, peerId: peerId });
        socket.to(roomId).emit("user-started-sharing", peerId);
    };
    var stopSharing = function (roomId) {
        socket.to(roomId).emit("user-stopped-sharing");
    };
    var addMessage = function (roomId, message) {
        console.log({ message: message });
        if (chats[roomId]) {
            chats[roomId].push(message);
        }
        else {
            chats[roomId] = [message];
        }
        socket.to(roomId).emit("add-message", message);
    };
    var changeName = function (_a) {
        var peerId = _a.peerId, userName = _a.userName, roomId = _a.roomId;
        if (rooms[roomId] && rooms[roomId][peerId]) {
            rooms[roomId][peerId].userName = userName;
            socket.to(roomId).emit("name-changed", { peerId: peerId, userName: userName });
        }
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
    socket.on("send-message", addMessage);
    socket.on("change-name", changeName);
};
exports.roomHandler = roomHandler;
