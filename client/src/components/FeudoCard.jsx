function FeudoCard(props) {
  return (
    <div
      style={{
      border: props.isActive ? '3px solid green' : '1px solid black',
      margin: '5px',
      padding: '8px',
      width: props.wide ? '900px' : '200px',
      textAlign: 'center',
      fontSize: '18px'
    }}
    >
    <h3>{props.feudo.name}</h3>
      

      <div
  style={{
    display: props.wide ? 'grid' : 'block',
    gridTemplateColumns: props.wide ? '1fr 1fr' : undefined,
    gap: '20px',
    textAlign: 'left'
  }}
>
  <div>
    <p>🌾 Grano: {props.feudo.grain}</p>
    <p>👨‍🌾 Contadini: {props.feudo.peasants}</p>
    <p>⚔️ Cavalieri: {props.feudo.knights}</p>
    <p>🏡 Mansi: {props.feudo.manors}</p>
  </div>

  <div>
    <p>🌾 Mansi produttivi: {props.feudo.productiveManors}</p>

    <p>
      {props.feudo.feudalType === 'ecclesiastico'
        ? '⛪ Ecclesiastico'
        : '🏰 Laico'}
    </p>

    <p>🏰 Fortificazioni: {props.feudo.fortification}</p>
  </div>
</div>
      <div
  style={{
    display: props.wide ? 'grid' : 'block',
    gridTemplateColumns: props.wide ? '1fr 1fr 1fr 1fr' : undefined,
    gap: '10px',
    marginTop: '10px'
  }}
>
  <button
    disabled={!props.isActive}
    onClick={() => props.addGrain(props.feudo.id)}
  >
    +100 Grano
  </button>

  <button
    disabled={!props.isActive}
    onClick={() => props.recruitKnight(props.feudo.id)}
  >
    ⚔ Recluta Cavaliere
  </button>

  <button
    disabled={!props.isActive}
    onClick={() => props.buildFortification(props.feudo.id)}
  >
    🏰 Costruisci Fortificazione
  </button>

  <button
    disabled={!props.isActive}
    onClick={() => props.produce(props.feudo.id)}
  >
    🌾 Produci Raccolto
  </button>
</div>
      

      {props.isActive && (
        <>

        <hr />

          <button
              onClick={() => props.serveKing(props.feudo.id)}
            >
              👑 Servigi al Re
          </button>
          <hr />

          <p>Attacca:</p>

          {props.allFeudi
            .filter(other => other.id !== props.feudo.id)
            .filter(other => {
              if (props.feudo.name === 'Feudo A' && other.name === 'Feudo C') {
                return false;
              }

              if (props.feudo.name === 'Feudo C' && other.name === 'Feudo A') {
                return false;
              }

              if (props.feudo.name === 'Feudo B' && other.name === 'Feudo D') {
                return false;
              }

              if (props.feudo.name === 'Feudo D' && other.name === 'Feudo B') {
                return false;
              }

              return true;
            })
            .map(other => (
              <button
                key={other.id}
                onClick={() => props.attackFeudo(props.feudo.id, other.id)}
              >
                ⚔ {other.name}
              </button>
            ))}
          <button onClick={() => props.payRansom(props.feudo.id)}>
            💰 Paga riscatto
          </button>

          <hr />

          <button onClick={props.nextTurn}>
            ✅ Fine turno
          </button>
        </>
      )}
    </div>
  );
}

export default FeudoCard;