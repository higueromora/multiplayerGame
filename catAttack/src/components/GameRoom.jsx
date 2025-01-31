import { CardContainer } from "./CardContainer";
import { IconsActions } from "./IconsActions";

export const GameRoom = ({
    roomKey,
    onClick,
    resultMessage,
    playerRole,
    cat1,
    cat2,
    onClick2,
    sendMessage,
    atacar,
    contraatacar,
    meditar,
    actionMessage
}) => {
    let resultText = '';
    if (resultMessage[2] == 1 && playerRole == 1) {
        resultText = 'Tú ganas';
    } else if (resultMessage[2] == 2 && playerRole == 2) {
        resultText = 'Tú ganas';
    } else if (resultMessage[2] == "Empate") {
        resultText = 'Empate';
    } else {
        resultText = 'Enemigo gana';
    }

    return (
        <div className="card">
            <div className="top-card">
                <h1>Sala: {roomKey}</h1>
                <button className="leave-room" onClick={onClick}>Salir de la sala</button>
            </div>

            {(resultMessage[0] === 0 || resultMessage[1] === 0) ? (
                <>
                    <CardContainer resultMessage={resultMessage} playerRole={playerRole} cat1={cat1} cat2={cat2} />
                    <p>{resultText}</p>
                    <button className="repeat-Game" onClick={onClick2}>¿Quieres otra partida?</button>
                </>
            ) : (
                <>
                    <CardContainer resultMessage={resultMessage} playerRole={playerRole} cat1={cat1} cat2={cat2} />
                    <IconsActions onClick={sendMessage} atacar={atacar} contraatacar={contraatacar} meditar={meditar} />
                    <footer className="footer_info">
                        <div className="info">Info:
                            {
                                playerRole === 1
                                    ? resultMessage[2]
                                    : resultMessage[3]
                            }
                        </div>
                    </footer>
                    <p style={{ margin: '0px' }}>{actionMessage}</p>
                </>
            )}
        </div>
    );
};
