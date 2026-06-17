function MapBoard({ feudi }) {
  const colors = {
    'Feudo A': '#f8c471',
    'Feudo B': '#85c1e9',
    'Feudo C': '#82e0aa',
    'Feudo D': '#d7bde2'
  };

  const cells = [];

  feudi.forEach((feudo) => {
    for (let i = 0; i < feudo.manors; i++) {
      cells.push({
        owner: feudo.name,
        productive: i < feudo.productiveManors,
        color: colors[feudo.name] || '#cccccc'
      });
    }
  });

  return (
    <div>
      <h3>Mappa dei mansi</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 22px)',
          gap: '4px',
          justifyContent: 'center'
        }}
      >
        {cells.map((cell, index) => (
          <div
            key={index}
            title={`${cell.owner} ${cell.productive ? 'produttivo' : 'improduttivo'}`}
            style={{
              width: '22px',
              height: '22px',
              backgroundColor: cell.color,
              border: '1px solid black',
              opacity: cell.productive ? 1 : 0.35
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default MapBoard;