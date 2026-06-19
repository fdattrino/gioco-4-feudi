import { Card } from 'react-bootstrap';

function MapBoard({ feudi }) {
  const colors = {
    'Feudo A': '🟨',
    'Feudo B': '🟦',
    'Feudo C': '🟩',
    'Feudo D': '🟪'
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title className="text-center">
          Mappa Mansi
        </Card.Title>

        {feudi.map(feudo => (
          <div key={feudo.id} className="mb-1">
            <strong>{feudo.name}: </strong>

            <span style={{ fontSize: '20px', letterSpacing: '2px' }}>
              {Array.from({ length: feudo.productiveManors }).map((_, index) => (
                <span key={index}>
                  {colors[feudo.name]}
                </span>
              ))}
            </span>

            {feudo.manors > feudo.productiveManors && (
              <span style={{ fontSize: '20px', letterSpacing: '2px', opacity: 0.4 }}>
                {Array.from({
                  length: feudo.manors - feudo.productiveManors
                }).map((_, index) => (
                  <span key={index}>⬛</span>
                ))}
              </span>
            )}
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}

export default MapBoard;