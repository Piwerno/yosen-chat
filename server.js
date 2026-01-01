const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const messages = [];

io.on("connection", socket => {
    console.log("Utilisateur connecté");

    // envoyer l’historique au nouveau
    socket.emit("messageHistory", messages);

    socket.on("message", msg => {
        // horodatage serveur
        const now = new Date();
        msg.heure = now.getHours().toString().padStart(2, "0") + ":" +
                    now.getMinutes().toString().padStart(2, "0");

        messages.push(msg);
        if (messages.length > 100) messages.shift(); // garder 100 derniers

        io.emit("message", msg); // broadcast
    });

    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté");
    });
});

server.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});
