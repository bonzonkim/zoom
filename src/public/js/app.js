const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

function backendDone(msg){
    console.log(`The Backend says: ${msg}`);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    //emit and on first argument has to be the same name(string)
    socket.emit("enter_room",input.value , backendDone);
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
