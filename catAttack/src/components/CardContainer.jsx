

export const CardContainer = ({ resultMessage, playerRole, cat1, cat2 }) => {
    return (
        <div className="card-container">
            <div className="card-containe-div">
                <h1>Jugador {resultMessage[1] !== undefined ? resultMessage[1] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat2} alt="" /> : <img className="img-player" src={cat1} alt="" />}</h1>
            </div>
            <div className="card-containe-div">
                <h1>Enemigo {resultMessage[2] !== undefined ? resultMessage[2] : 5}❤️ {playerRole === 1 ? <img className="img-player" src={cat1} alt="" /> : <img className="img-player" src={cat2} alt="" />}</h1>
            </div>
        </div>
    )
}
