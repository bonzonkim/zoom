const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}


socket.addEventListener("open", () => {
    console.log("connected to the Server !");
})


socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});


socket.addEventListener("close", () => {
    console.log("disconnected from Server");
})

//message
messageForm.addEventListener("submit",(event) => {
    event.preventDefault();
    const input =  messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
});

//nickname
nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
})