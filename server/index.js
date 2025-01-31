const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const roomData = {};

io.on("connection", (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  // Maneja el envío de acciones
  socket.on("send_message", (data) => {
    const { message, room } = data;

    if (!roomData[room]) {
      return; // Si la sala no existe, no hacer nada
    }

    const roomInfo = roomData[room];

    // Almacena la acción del jugador
    roomInfo.actions[socket.id] = message;

    // Verifica si ambas acciones están presentes
    if (Object.keys(roomInfo.actions).length === 2) {
      const [player1, player2] = roomInfo.players; // Orden de los jugadores
      const action1 = roomInfo.actions[player1];
      const action2 = roomInfo.actions[player2];

      if (action1 === "atacar" && action2 === "atacar") {
        roomInfo.pv[player1] -= 1;
        roomInfo.pv[player2] -= 1;
      } else if (action1 === "atacar" && action2 === "contraatacar") {
          roomInfo.pv[player1] -= 1;
      } else if (action1 === "atacar" && action2 === "meditar") {
          roomInfo.pv[player2] -= 1;
      } else if (action1 === "contraatacar" && action2 === "atacar") {
          roomInfo.pv[player2] -= 1;
      } else if (action1 === "contraatacar" && action2 === "meditar") {
          roomInfo.pv[player1] -= 1;
      } else if (action1 === "contraatacar" && action2 === "contraatacar") {
          roomInfo.pv[player1] -= 1;
          roomInfo.pv[player2] -= 1;
      } else if (action1 === "meditar" && action2 === "atacar") {
          roomInfo.pv[player1] -= 1;
      } else if (action1 === "meditar" && action2 === "contraatacar") {
          roomInfo.pv[player2] -= 1;
      } else if (action1 === "meditar" && action2 === "meditar") {
          // No se recibe daño
      }
    

      if (roomInfo.pv[player1] === 0 && roomInfo.pv[player2] === 0) {
        io.to(room).emit("receive_result", [
          roomInfo.pv[player1],
          roomInfo.pv[player2],
          "Empate"
        ]);

      } else if (roomInfo.pv[player1] === 0) {
        io.to(room).emit("receive_result", [
          roomInfo.pv[player1],
          roomInfo.pv[player2],
          2
        ]);

      } else if (roomInfo.pv[player2] === 0) {
        io.to(room).emit("receive_result", [
          roomInfo.pv[player1], 
          roomInfo.pv[player2],
          1
        ]);
      } else {
        io.to(room).emit("receive_result", [
          roomInfo.pv[player1],
          roomInfo.pv[player2],
          `Jugador (${action1}) y enemigo (${action2})`,
           `Jugador  (${action2}) enemigo (${action1})`
        ]);
      }
      
    
      // Limpia las acciones después de procesarlas
      roomInfo.actions = {};
    }
  });

  socket.on("reset_game", (roomKey) => {
    if (!roomData[roomKey]) return;

    const roomInfo = roomData[roomKey];
    roomInfo.players.map((player) => {
      roomInfo.pv[player] = 5
    })

    io.to(roomKey).emit("reset_game");

  })

  socket.on("leave_room", (roomKey) => {
    if (!roomData[roomKey]) return;

    // Eliminar al jugador de la lista de jugadores
    const indexPlayer = roomData[roomKey].players.indexOf(socket.id);
    if (indexPlayer !== -1) {
      roomData[roomKey].players.splice(indexPlayer, 1);
    }

    // Eliminar los datos del jugador (puntos de vida, acciones)
    delete roomData[roomKey].pv[socket.id];
    delete roomData[roomKey].actions[socket.id];

    // Notificar al jugador que salió
    io.to(roomKey).emit("leave_room");

    // Notificar al jugador que se queda en la sala (si hay uno)
    if (roomData[roomKey].players.length === 1) {
      const remainingPlayer = roomData[roomKey].players[0];
      io.to(remainingPlayer).emit(
        "bye_room",
        "El otro jugador abandonó la sala. La sala será cerrada ahora."
      );
    }

    // Eliminar la sala inmediatamente después de que un jugador se haya ido
    delete roomData[roomKey];
    console.log(`Sala ${roomKey} eliminada porque un jugador abandonó.`);


  });

  

  // Maneja la unión a una sala
  socket.on("join_room", (roomKey) => {
    if (!roomData[roomKey]) {
      roomData[roomKey] = { players: [], actions: {}, pv: {} }; // Inicializa la sala
    }

    const roomInfo = roomData[roomKey];

    // Limita la sala a 2 jugadores
    if (roomInfo.players.length >= 2) {
      socket.emit("receive_key", "Sala llena");
    } else {
      roomInfo.players.push(socket.id); // Añade al jugador a la lista de la sala
      roomInfo.pv[socket.id]= 5;
      socket.join(roomKey);

      const playerNumber = roomInfo.players.length; // Identifica al jugador (1 o 2)
      socket.emit("receive_key", [roomKey, playerNumber]);
      // socket.emit("receive_key", `Unido a la sala ${roomKey} como Jugador ${playerNumber}`);
    }
  });

  
});

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
