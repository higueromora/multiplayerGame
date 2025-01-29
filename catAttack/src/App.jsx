import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import portada from "./assets/portada.jpeg";
import cat1 from "./assets/cat1.jpeg";
import cat2 from "./assets/cat2.jpeg";
import atacar from "./assets/atacar.svg";
import contraatacar from "./assets/contraatacar.svg";
import meditar from "./assets/meditar.svg";
import { StartRoom } from "./components/StartRoom";
import { RulesModal } from "./components/RulesModal";
import { GameRoom } from "./components/GameRoom";

const socket = io.connect("http://localhost:3001"); // Conexión al servidor

function App() {
  const [roomKey, setRoomKey] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [playerRole, setPlayerRole] = useState(""); // Rol del jugador TODO PARA REVISAR JUGADOR
  const [actionMessage, setActionMessage] = useState(""); // Para las acciones enviadas
  const [resultMessage, setResultMessage] = useState(""); // Para el resultado de las acciones
  const [roomMessage, setRoomMessage] = useState("");
  const [byeRoom, setByeRoom] = useState("")

  // Cuando el jugador decide salir de la sala
  const leaveRoom = () => {
    socket.emit("leave_room", roomKey);
  };

  useEffect(() => {
    socket.on("leave_room", () => {
      console.log("Has salido de la sala.");
      setRoomKey("");
      setJoinedRoom(false);
      setPlayerRole("");
      setActionMessage("");
      setResultMessage("");
      setRoomMessage("");
    });

    socket.on("bye_room", (data) => {
      setByeRoom(data);
      console.log(data);
    });

    return () => {
      socket.off("leave_room");
      socket.off("bye_room");
    };
  }, []);

  const sendMessage = (e) => {
    const message = e.target.getAttribute('data-value');
    if (message !== "") {
      socket.emit("send_message", { message: message, room: roomKey });
      setActionMessage(`Realizaste la acción: ${message}`);
    }
  };

  const joinRoom = () => {
    if (roomKey !== "") {
      socket.emit("join_room", roomKey);
      setByeRoom("");
    }
  };

  const resetGame = () => {
    socket.emit('reset_game', roomKey)
  }

  useEffect(() => {
    socket.on("receive_result", (result) => {
      setResultMessage(result);
      setActionMessage("");
    });

    socket.on("reset_game", () => {
      setResultMessage("");
      setActionMessage("");
    });

    socket.on("receive_key", (data) => {
      if (data === "Sala llena") {
        setRoomMessage("La sala está llena, intenta con otra clave.");
        setRoomKey("");
      } else {
        setJoinedRoom(true);
        setRoomMessage(data);
        setPlayerRole(data[1]);
      }
    });

    return () => {
      socket.off("receive_result");
      socket.off("receive_key");
    };
  }, [roomKey]);

  return (

    <>
      <h1 className="Title">Cat Attack</h1>
      <img className="portada-img" src={portada} alt="" />
      <RulesModal />

      {!joinedRoom ? (
        <StartRoom
          byeRoom={byeRoom}
          roomKey={roomKey}
          onChange={setRoomKey}
          joinRoom={joinRoom}
          roomMessage={roomMessage}
        />
      ) : (

        <GameRoom
          roomKey={roomKey}
          onClick={leaveRoom}
          resultMessage={resultMessage}
          playerRole={playerRole}
          cat1={cat1}
          cat2={cat2}
          onClick2={resetGame}
          sendMessage={sendMessage}
          atacar={atacar}
          contraatacar={contraatacar}
          meditar={meditar}
          actionMessage={actionMessage}
        />

      )}
    </>
  );
}

export default App;
