import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import portada from "./assets/portada.jpeg";
import cat1 from "./assets/cat1.jpeg";
import cat2 from "./assets/cat2.jpeg";
import atacar from "./assets/atacar.svg";
import contraatacar from "./assets/contraatacar.svg";
import meditar from "./assets/meditar.svg";

const socket = io.connect("http://localhost:3001"); // Conexión al servidor

function App() {
  const [roomKey, setRoomKey] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [playerRole, setPlayerRole] = useState(""); // Rol del jugador TODO PARA REVISAR JUGADOR
  const [actionMessage, setActionMessage] = useState(""); // Para las acciones enviadas
  const [resultMessage, setResultMessage] = useState(""); // Para el resultado de las acciones
  const [roomMessage, setRoomMessage] = useState("");
  const [byeRoom, setByeRoom] = useState("")
  const [isOpen, setIsOpen] = useState(false);

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
      socket.off("bue_room");
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
      <div>
        <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
          Mostrar Reglas
        </button>

        <div className={`rules_info ${isOpen ? "active" : ""}`}>
          <div className="rules-content">
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </button>
            <h2>Cada jugador empieza con 5 puntos de vida</h2>
            <p>Si los 2 jugadores atacan: ambos reciben un punto de daño</p>
            <p>Si 1 jugador ataca y el otro medita: recibe daño el que medita</p>
            <p>Si 1 jugador ataca y el otro contrataca: recibe daño el que ataca</p>
            <p>Si 1 jugador contrataca y el otro medita: recibe daño el que contrataca</p>
            <p>Si los 2 jugadores contratacan: ambos reciben un punto de daño</p>
            <p>Si los 2 jugadores meditan: no se reciben ningún daño</p>
          </div>
        </div>
      </div>
      {!joinedRoom ? (
        <div className="startRoom">
          <h1>{byeRoom}</h1>
          <input
            className="input-insideRoom"
            type="text"
            placeholder="Ingrese una clave de sala"
            maxLength="6"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
          />
          <button className="linkRoom" onClick={joinRoom}>Unirse a la sala</button>
          <p>{roomMessage}</p>
        </div>
      ) : (

        <div className="card">
          <div className="top-card">
            <h1>Sala: {roomKey}</h1>
            <button className="leave-room" onClick={leaveRoom}>Salir de la sala</button>
          </div>

          {
            (resultMessage[1] || resultMessage[2]) === 0 ?
              <>
                <div className="card-container">
                  <div className="card-containe-div">
                    <h1>Jugador {resultMessage[1] !== undefined ? resultMessage[1] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat2} alt="" /> : <img className="img-player" src={cat1} alt="" />}</h1>
                  </div>
                  <div className="card-containe-div">
                    <h1>Enemigo {resultMessage[2] !== undefined ? resultMessage[2] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat1} alt="" /> : <img className="img-player" src={cat2} alt="" />}</h1>
                  </div>
                </div>
                <p>{resultMessage[0]}</p>
                <button onClick={resetGame}>¿Quieres otra partida?</button>
              </>
              :
              <>
                <div className="card-container">
                  <div className="card-containe-div">
                    <h1>Jugador {resultMessage[1] !== undefined ? resultMessage[1] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat2} alt="" /> : <img className="img-player" src={cat1} alt="" />}</h1>
                  </div>
                  <div className="card-containe-div">
                    <h1>Enemigo {resultMessage[2] !== undefined ? resultMessage[2] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat1} alt="" /> : <img className="img-player" src={cat2} alt="" />}</h1>
                  </div>
                </div>
                <div className="icons-actions">
                  <img data-value="atacar" onClick={sendMessage} src={atacar} alt="Atacar" />
                  <img data-value="contraatacar" onClick={sendMessage} src={contraatacar} alt="contraatacar" />
                  <img data-value="meditar" onClick={sendMessage} src={meditar} alt="meditar" />
                </div>
                <footer className="footer_info">
                  <div className="info">Info: {resultMessage[0]}</div>
                </footer>
                <p style={{ margin: '0px' }} > {actionMessage}</p>
              </>
          }
        </div>
      )}
    </>
  );
}

export default App;
