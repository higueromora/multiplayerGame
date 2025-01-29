export const StartRoom = ({ byeRoom, roomKey, onChange, joinRoom, roomMessage }) => {
    return (
        <div className="startRoom">
            <h1>{byeRoom}</h1>
            <input
                className="input-insideRoom"
                type="text"
                placeholder="Ingrese una clave de sala"
                maxLength="6"
                value={roomKey}
                onChange={(e) => onChange(e.target.value)}
            />
            <button className="linkRoom" onClick={joinRoom}>Unirse a la sala</button>
            <p>{roomMessage}</p>
        </div>
    );
};
