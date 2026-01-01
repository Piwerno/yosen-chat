let pseudoUtilisateur = "";
const socket = io();

const colors = {};
const palette = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function getColor(pseudo) {
    if (!colors[pseudo]) {
        colors[pseudo] = palette[Math.floor(Math.random() * palette.length)];
    }
    return colors[pseudo];
}

function afficherMessage({ pseudo, texte, heure }) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "message";

    if (pseudo === pseudoUtilisateur) {
        div.classList.add("droite");
    } else {
        div.classList.add("gauche");
        div.style.background = getColor(pseudo);
    }

    div.innerHTML = `
        <strong>${pseudo}</strong> <small>(${heure})</small><br>
        ${texte}
    `;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function envoyerMessage() {
    const pseudo = document.getElementById("pseudoInput").value.trim();
    const texte = document.getElementById("messageInput").value.trim();
    if (!pseudo || !texte) return;

    pseudoUtilisateur = pseudo;

    const now = new Date();
    const heure = now.getHours().toString().padStart(2, "0") + ":" +
                  now.getMinutes().toString().padStart(2, "0");

    socket.emit("message", { pseudo, texte, heure });
    document.getElementById("messageInput").value = "";
}

socket.on("message", msg => {
    afficherMessage(msg);
});

document.getElementById("messageInput").addEventListener("keypress", e => {
    if (e.key === "Enter") envoyerMessage();
});

// Menu principal
document.getElementById("mainMenuBtn").onclick = () => {
    const menu = document.getElementById("mainMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

function supprimerTousMessages() {
    document.getElementById("messages").innerHTML = "";
}

function changerTheme() {
    document.body.classList.toggle("dark");
}

function afficherAide() {
    alert("💬 Chat temps réel Node.js\nCréé par toi 😎");
}
