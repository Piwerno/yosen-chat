let pseudoUtilisateur = "";
const socket = io();
const notifSound = new Audio("notif.mp3");

// Demande autorisation notification
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

function afficherMessage({ pseudo, texte, heure }) {
    const messages = document.getElementById("messages");
    const div = document.createElement("div");

    const isMe = pseudo === pseudoUtilisateur;
    div.className = "message " + (isMe ? "droite" : "gauche");

    div.innerHTML = `<strong>${pseudo}</strong> <small>${heure}</small><br>${texte}`;

    if (!isMe) {
        div.classList.add("notif");
        notifSound.play().catch(()=>{});

        if (document.hidden && Notification.permission === "granted") {
            new Notification("💬 Nouveau message", {
                body: `${pseudo} : ${texte}`
            });
        }
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function envoyerMessage() {
    const pseudo = document.getElementById("pseudoInput").value.trim();
    const texte = document.getElementById("messageInput").value.trim();
    if (!pseudo || !texte) return;

    pseudoUtilisateur = pseudo;
    socket.emit("message", { pseudo, texte });
    document.getElementById("messageInput").value = "";
}

socket.on("message", afficherMessage);

socket.on("messageHistory", history => {
    history.forEach(afficherMessage);
});

document.getElementById("messageInput").addEventListener("keypress", e => {
    if (e.key === "Enter") envoyerMessage();
});

document.getElementById("mainMenuBtn").onclick = () => {
    const menu = document.getElementById("mainMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
};

function supprimerTousMessages() {
    document.getElementById("messages").innerHTML = "";
}

function afficherAide() {
    alert("💬 Chat temps réel\nNotifications activées 🔔");
}
