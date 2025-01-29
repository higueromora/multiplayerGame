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
    return (
        <div className="card">
            <div className="top-card">
                <h1>Sala: {roomKey}</h1>
                <button className="leave-room" onClick={onClick}>Salir de la sala</button>
            </div>

            {(resultMessage[1] || resultMessage[2]) === 0 ? (
                <>
                    <CardContainer resultMessage={resultMessage} playerRole={playerRole} cat1={cat1} cat2={cat2} />
                    <p>{resultMessage[0]}</p>
                    <button onClick={onClick2}>¿Quieres otra partida?</button>
                </>
            ) : (
                <>
                    <CardContainer resultMessage={resultMessage} playerRole={playerRole} cat1={cat1} cat2={cat2} />
                    <IconsActions onClick={sendMessage} atacar={atacar} contraatacar={contraatacar} meditar={meditar} />
                    <footer className="footer_info">
                        <div className="info">Info: {resultMessage[0]}</div>
                    </footer>
                    <p style={{ margin: '0px' }}>{actionMessage}</p>
                </>
            )}
        </div>
    );
};
