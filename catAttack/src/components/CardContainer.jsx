export const CardContainer = ({ resultMessage, playerRole, cat1, cat2 }) => {
    if (playerRole === 1) {
        return (
            <div className="card-container">
                <div className="card-containe-div">
                    <h1>
                        Jugador {resultMessage[0] ?? 5}❤️
                        <img className="img-player" src={cat2} alt="" />
                    </h1>
                </div>
                <div className="card-containe-div">
                    <h1>
                        Enemigo {resultMessage[1] ?? 5}❤️
                        <img className="img-player" src={cat1} alt="" />
                    </h1>
                </div>
            </div>
        );
    } else {
        return (
            <div className="card-container">
                <div className="card-containe-div">
                    <h1>
                        Jugador {resultMessage[1] ?? 5}❤️
                        <img className="img-player" src={cat1} alt="" />
                    </h1>
                </div>
                <div className="card-containe-div">
                    <h1>
                        Enemigo {resultMessage[0] ?? 5}❤️
                        <img className="img-player" src={cat2} alt="" />
                    </h1>
                </div>
            </div>
        );
    }
};
