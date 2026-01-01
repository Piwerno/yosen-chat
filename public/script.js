let pseudoUtilisateur = localStorage.getItem("pseudo") || "";
const socket = io();

const colors = {};
const palette = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function getColor(pseudo) {
    if (!colors[pseudo]) {
        colors[pseudo] = palette[Math.floor(Math.random() * palette.length)];
    }
    return colors[pseudo];
}

function afficherMessage({ pseudo, texte, image, heure }) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "message";

    if (pseudo === pseudoUtilisateur) {
        div.classList.add("droite");
    } else {
        div.classList.add("gauche");
        if (!image) div.style.background = getColor(pseudo);
    }

    let content = `<strong>${pseudo}</strong> <small>(${heure})</small><br>`;
    if (texte) content += texte;
    if (image) content += `<br><img src="${image}" style="max-width:200px; border-radius:12px;">`;

    div.innerHTML = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function envoyerMessage() {
    if (!pseudoUtilisateur) {
        pseudoUtilisateur = prompt("Quel est ton pseudo ?") || "Invité";
        localStorage.setItem("pseudo", pseudoUtilisateur);
    }

    const texte = document.getElementById("messageInput").value.trim();
    if (!texte) return;

    const now = new Date();
    const heure = now.getHours().toString().padStart(2, "0") + ":" +
                  now.getMinutes().toString().padStart(2, "0");

    socket.emit("message", { pseudo: pseudoUtilisateur, texte, image: null, heure });
    document.getElementById("messageInput").value = "";
}

// Envoi d'image
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const now = new Date();
        const heure = now.getHours().toString().padStart(2, "0") + ":" +
                      now.getMinutes().toString().padStart(2, "0");

        socket.emit("message", {
            pseudo: pseudoUtilisateur,
            texte: null,
            image: reader.result,
            heure
        });
    };
    reader.readAsDataURL(file);
    imageInput.value = "";
});

// Socket.io
socket.on("message", msg => afficherMessage(msg));

// Enter pour envoyer message
document.getElementById("messageInput").addEventListener("keypress", e => {
    if (e.key === "Enter") envoyerMessage();
});

// Menu
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
