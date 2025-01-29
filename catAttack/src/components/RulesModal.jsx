import { useState } from "react";

export const RulesModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
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
    );
};
