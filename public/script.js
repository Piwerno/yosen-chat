const socket = io();

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const pseudoInput = document.getElementById("pseudoInput");
const messagesDiv = document.getElementById("messages");

// Son notification
const notifSound = new Audio("notif.mp3");

// Demande autorisation notification navigateur
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Envoyer message
sendBtn.addEventListener("click", envoyerMessage);
messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") envoyerMessage();
});

function envoyerMessage() {
    const pseudo = pseudoInput.value.trim();
    const texte = messageInput.value.trim();
    if (!pseudo || !texte) return;

    socket.emit("message", { pseudo, texte });
    messageInput.value = "";
}

// Recevoir message
socket.on("message", msg => {
    const div = document.createElement("div");
    div.className = "message";

    const isMe = msg.pseudo === pseudoInput.value.trim();
    if (isMe) {
        div.classList.add("droite"); // message à droite
    } else {
        div.classList.add("gauche"); // message à gauche
    }

    div.innerHTML = `<strong>${msg.pseudo}</strong> (${msg.heure})<br>${msg.texte}`;

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Notifications pour les messages des autres
    if (!isMe) {
        notifSound.play().catch(()=>{});
        if (document.hidden && Notification.permission === "granted") {
            new Notification("💬 Nouveau message", {
                body: `${msg.pseudo} : ${msg.texte}`
            });
        }
    }
});
