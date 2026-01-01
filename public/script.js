let pseudoUtilisateur = "";
const socket = io();

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const pseudoInput = document.getElementById("pseudoInput");
const sendBtn = document.getElementById("sendBtn");

function afficherMessage({ pseudo, texte, heure }) {
    const div = document.createElement("div");
    div.className = "message";

    if (pseudo === pseudoUtilisateur) {
        div.classList.add("droite");
    } else {
        div.classList.add("gauche");
    }

    div.innerHTML = `
        <strong>${pseudo}</strong>
        <small>${heure}</small><br>
        ${texte}
    `;

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function envoyerMessage() {
    const pseudo = pseudoInput.value.trim();
    const texte = messageInput.value.trim();

    if (!pseudo || !texte) return;

    pseudoUtilisateur = pseudo;

    socket.emit("message", {
        pseudo,
        texte
    });

    messageInput.value = "";
}

sendBtn.addEventListener("click", envoyerMessage);

messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        envoyerMessage();
    }
});

socket.on("message", msg => {
    afficherMessage(msg);
});

socket.on("messageHistory", history => {
    history.forEach(msg => afficherMessage(msg));
});
