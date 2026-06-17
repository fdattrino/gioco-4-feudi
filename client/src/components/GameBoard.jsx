import FeudoCard from './FeudoCard';
import MapBoard from './MapBoard';
function GameBoard(props) {
  const feudoA = props.feudi.find(f => f.name === 'Feudo A');
  const feudoB = props.feudi.find(f => f.name === 'Feudo B');
  const feudoC = props.feudi.find(f => f.name === 'Feudo C');
  const feudoD = props.feudi.find(f => f.name === 'Feudo D');

  const renderFeudo = (feudo, wide = false) => {
  if (!feudo) return null;

  return (
    <FeudoCard
      feudo={feudo}
      wide={wide}
      addGrain={props.addGrain}
      recruitKnight={props.recruitKnight}
      buildFortification={props.buildFortification}
      produce={props.produce}
      allFeudi={props.feudi}
      attackFeudo={props.attackFeudo}
      isActive={feudo.id === props.game?.currentFeudoId}
      nextTurn={props.nextTurn}
      serveKing={props.serveKing}
      payRansom={props.payRansom}
    />
  );
};

  return (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '280px 420px 280px',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '10px'
    }}
  >
    <div></div>

    <div style={{ width: '900px', gridColumn: '1 / 4' }}>
      {renderFeudo(feudoB, true)}
    </div>

    <div>{renderFeudo(feudoA)}</div>

    <div
      style={{
        border: '2px dashed black',
        padding: '15px',
        textAlign: 'center',
        minWidth: '380px'
      }}
    >
      <h2>Centro</h2>

      <p>📅 Round {props.game ? props.game.round : '...'}</p>
      <p>🎲 Evento: {props.game?.lastEvent || 'Nessuno'}</p>
      <p>⚔ {props.battleMessage || 'Nessuna battaglia'}</p>

      <p>
        👤 Turno: {
          props.feudi.find(f => f.id === props.game?.currentFeudoId)?.name || '...'
        }
      </p>

      <button onClick={props.drawEvent}>
        🎲 Pesca imprevisto
      </button>

      <button onClick={props.nextRound}>
        ➡ Fine Round
      </button>

      <br />

      <button onClick={props.resetGame}>
        🔄 Reset partita
      </button>

      <MapBoard feudi={props.feudi} />
    </div>

    <div>{renderFeudo(feudoC)}</div>

    <div style={{ width: '900px', gridColumn: '1 / 4' }}>
      {renderFeudo(feudoD, true)}
    </div>
  </div>
);
}

export default GameBoard;
