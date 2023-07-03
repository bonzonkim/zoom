import http from 'http';
//import WebSocket from 'ws';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views/"); 
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(_req,res) => res.render("home"));
app.get("/*", (_req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsWerver = new Server(httpServer);

wsWerver.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    //emit and on first argument has to be the same name(string)
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye");
        });
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    });
});

//const socketList = [];
//
//const wss = new WebSocket.Server({ server });
//wss.on("connection", (socket) => {
//    socketList.push(socket);
//    socket["nickname"] = "Jone Doe";
//    console.log("connected to the browser");
//    socket.on("close", () => console.log("disconnected from the Browser"));
//    socket.on("message", (message) => {
//        const parsed = JSON.parse(message);
//        switch(parsed.type){
//            case "new_message":
//                socketList.forEach(aSocket =>
//                    aSocket.send(`${socket.nickname}: ${parsed.payload}`));
//            case "nickname":
//                socket["nickname"] = parsed.payload;
//        }
//    });
//});
httpServer.listen(3000, handleListen);


{
    type:"message";
    payload:"hello everyone!";
}

{
    type:"nickname";
    payload:"kelly";
}
