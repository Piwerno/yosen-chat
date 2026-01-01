let pseudoUtilisateur = localStorage.getItem("pseudo") || "";
const socket = io();

// Couleurs par pseudo
const colors = {};
const palette = [
    "linear-gradient(135deg, #f97316, #facc15)",
    "linear-gradient(135deg, #4ade80, #22c55e)",
    "linear-gradient(135deg, #3b82f6, #6366f1)",
    "linear-gradient(135deg, #ec4899, #f43f5e)",
    "linear-gradient(135deg, #8b5cf6, #a78bfa)"
];

function getPseudoColor(pseudo) {
    if (!colors[pseudo]) {
        colors[pseudo] = palette[Math.floor(Math.random() * palette.length)];
    }
    return colors[pseudo];
}

// Affichage des messages
function afficherMessage({ pseudo, texte, image, heure }) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "message";

    if (pseudo === pseudoUtilisateur) {
        div.classList.add("droite");
    } else {
        div.classList.add("gauche");
        if (!image) div.style.background = getPseudoColor(pseudo);
    }

    let content = `<strong style="background: ${getPseudoColor(pseudo)}; -webkit-background-clip: text; color: transparent;">${pseudo}</strong> <small>(${heure})</small><br>`;
    if (texte) content += texte;
    if (image) content += `<br><img src="${image}" style="max-width:200px; border-radius:12px;">`;

    div.innerHTML = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Envoyer un message texte
function envoyerMessage() {
    if (!pseudoUtilisateur) {
        pseudoUtilisateur = prompt("Quel est ton pseudo ?") || "Invité";
        localStorage.setItem("pseudo", pseudoUtilisateur);
    }

    const texte = document.getElementById("messageInput").value.trim();
    if (!texte) return;

    const now = new Date();
    const heure = now.getHours().toString().padStart(2,"0") + ":" +
                  now.getMinutes().toString().padStart(2,"0");

    socket.emit("message", { pseudo: pseudoUtilisateur, texte, image: null, heure });
    document.getElementById("messageInput").value = "";
}

// Envoyer une photo
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const now = new Date();
        const heure = now.getHours().toString().padStart(2,"0") + ":" +
                      now.getMinutes().toString().padStart(2,"0");

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

function supprimerTousMessages() { document.getElementById("messages").innerHTML = ""; }
function changerTheme() { document.body.classList.toggle("dark"); }
function afficherAide() { alert("💬 Chat temps réel Node.js\nCréé par toi 😎"); }
