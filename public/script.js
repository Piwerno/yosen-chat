const socket = io();

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const pseudoInput = document.getElementById("pseudoInput");
const messagesDiv = document.getElementById("messages");

sendBtn.addEventListener("click", envoyerMessage);

messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        envoyerMessage();
    }
});

function envoyerMessage() {
    const pseudo = pseudoInput.value.trim();
    const texte = messageInput.value.trim();

    if (!pseudo || !texte) return;

    socket.emit("message", { pseudo, texte });
    messageInput.value = "";
}

socket.on("message", msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<strong>${msg.pseudo}</strong> (${msg.heure})<br>${msg.texte}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
