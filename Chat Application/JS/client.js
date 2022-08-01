const socket = io("http://localhost:8000");

// Get DOM elements in respective Js variables
const form = document.getElementById("send");
const messageInput = document.getElementById("message");
const messageContainer = document.querySelector(".message");

// Audio that will play on receiving messages
var audio = new Audio("../notify.mp3");
// Function which will append event info to the contaner
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("msg");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask new user for his/her name and let the server know
let name = prompt("Enter your name to join :");
socket.emit("new-user-joined", name);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  if (name) {
    if(name){
    append(`${name} joined`, "center");
  }
  }
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  if (data.name) {
    append(`${data.name}: ${data.message}`, "left");
  }
});

// If a user leaves the chat, append the info to the container
socket.on("joined", (users) => {
  for (user in users) {
    if (user != socket.id) {
      if (users[user]) {
        append(`${users[user]} is joined`, "center");
      }
    } else {
      continue;
    }
  }
});

socket.on("left", (name) => {
  if (name) {
    append(`${name} left`, "center");
  }
});

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message == "people.show()" || message == "people.show") {
    socket.emit("show", message);
  } else {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
  }
  messageInput.value = "";
});
