

export const IconsActions = ({ onClick, atacar, contraatacar, meditar }) => {
    return (
        <div className="icons-actions">
            <img data-value="atacar" onClick={onClick} src={atacar} alt="Atacar" />
            <img data-value="contraatacar" onClick={onClick} src={contraatacar} alt="contraatacar" />
            <img data-value="meditar" onClick={onClick} src={meditar} alt="meditar" />
        </div>
    )
}
