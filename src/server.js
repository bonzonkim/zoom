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
const wsServer = new Server(httpServer);

function publicRooms(){
    const {
        sockets: {
        adapter: {sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Jone Doe"
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    //"emit" and "on" first argument has to be the same name(string) event의 이름
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
        });
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname;
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
