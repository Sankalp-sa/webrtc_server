"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var room_1 = require("./room");
var app = (0, express_1.default)();
app.get("/health", function (_, res) {
    res.send("Server is running");
});
app.use(cors_1.default);
var port = 8080;
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", function (socket) {
    console.log("a user connected");
    (0, room_1.roomHandler)(socket);
    socket.on("disconnect", function () {
        console.log("user disconnected");
    });
});
server.listen(port, function () {
    console.log("listening on *:".concat(port));
});
