import { useState } from 'react';
import { Card, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';

function FeudoCard(props) {
  const [knightsToKing, setKnightsToKing] = useState(0);

  const enemies = props.allFeudi
    .filter(other => other.id !== props.feudo.id)
    .filter(other => {
      if (props.feudo.name === 'Feudo A' && other.name === 'Feudo C') return false;
      if (props.feudo.name === 'Feudo C' && other.name === 'Feudo A') return false;
      if (props.feudo.name === 'Feudo B' && other.name === 'Feudo D') return false;
      if (props.feudo.name === 'Feudo D' && other.name === 'Feudo B') return false;
      return true;
    });

  return (
    <Card
      className={props.isActive ? 'border-success border-3' : 'border-dark'}
      style={{
        width: props.wide ? '100%' : '220px',
        fontSize: props.wide ? '16px' : '14px'
      }}
    >
      <Card.Body>
        <Card.Title className="text-center fs-4">
          {props.feudo.name}
        </Card.Title>


        <Row className="mb-2">
  <Col xs={props.wide ? 6 : 12}>
    <p className="mb-1">🌾 Grano: {props.feudo.grain}</p>
    <p className="mb-1">👨‍🌾 Contadini: {props.feudo.peasants}</p>
    <p className="mb-1">⚔️ Cavalieri: {props.feudo.knights}</p>
    <p className="mb-1">🏡 Mansi: {props.feudo.manors}</p>
  </Col>

  <Col xs={props.wide ? 6 : 12}>
    <p className="mb-1">🌾 Mansi produttivi: {props.feudo.productiveManors}</p>
    <p className="mb-1">
      {props.feudo.feudalType === 'ecclesiastico'
        ? '⛪ Ecclesiastico'
        : '🏰 Laico'}
    </p>
    <p className="mb-1">🏰 Fortificazioni: {props.feudo.fortification}</p>
  </Col>
</Row>

          

          
        
             
        {props.isActive && (
  <>
    {props.wide ? (
      <>
        <hr />

        <Row className="align-items-end g-2 mb-2">
          <Col md={2}>
            <Form.Label className="small mb-1">👑 Cavalieri al re:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max={props.feudo.knights}
              value={knightsToKing}
              onChange={(e) => setKnightsToKing(Number(e.target.value))}
              size="sm"
            />
          </Col>

          <Col md={2}>
            <Button
              size="sm"
              variant="outline-secondary"
              className="w-100"
              onClick={() => props.serveKing(props.feudo.id, knightsToKing)}
            >
              Invia
            </Button>
          </Col>

          <Col md={3}>
            <Button
              size="sm"
              variant="outline-success"
              className="w-100"
              onClick={() => props.produce(props.feudo.id)}
            >
              🌾 Produci
            </Button>
          </Col>

          <Col md={3}>
            <Button
              size="sm"
              variant="outline-danger"
              className="w-100"
              onClick={() => props.buildFortification(props.feudo.id)}
            >
              🏰 Fortifica
            </Button>
          </Col>

          <Col md={2}>
            <span className="small text-muted">📌 Imprevisto</span>
          </Col>
        </Row>
        <p className="text-start mb-1 fw-bold">
          ⚔ Attacca:
        </p>
        <Row className="align-items-center g-2">
          <Col md={4}>
            <div className="d-flex gap-1">
              {enemies.map(other => (
                <Button
                  key={other.id}
                  size="sm"
                  variant="outline-dark"
                  className="flex-fill"
                  onClick={() => props.attackFeudo(props.feudo.id, other.id)}
                >
                  ⚔ {other.name}
                </Button>
              ))}
            </div>
          </Col>

          <Col md={2}>
            <Button
              size="sm"
              variant="outline-warning"
              className="w-100"
              onClick={() => props.payRansom(props.feudo.id)}
            >
              💰 Riscatto
            </Button>
          </Col>

          <Col md={3}>
            <Button
              size="sm"
              variant="outline-primary"
              className="w-100"
              onClick={() => props.recruitKnight(props.feudo.id)}
            >
              ⚔ Recluta Cavaliere
            </Button>
          </Col>
        </Row>

        <hr />
      </>
    ) : (
      <>
         <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                <span>👑 Cavalieri al re:</span>

                <Form.Control
                  type="number"
                  min="0"
                  max={props.feudo.knights}
                  value={knightsToKing}
                  onChange={(e) => setKnightsToKing(Number(e.target.value))}
                  size="sm"
                  style={{ width: '70px' }}
                />

                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => props.serveKing(props.feudo.id, knightsToKing)}
                >
                  Invia
                </Button>
              </div>

              <hr />

                <div className="d-grid gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => props.produce(props.feudo.id)}
                  >
                    🌾 Produci Raccolto
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => props.buildFortification(props.feudo.id)}
                  >
                    🏰 Costruisci Fortificazione
                  </Button>
                  <div className="text-muted small text-center my-2">
                    📌 Pescare l’imprevisto.
                  </div>
                </div>

                <p className="text-center mb-1">Attacca:</p>

                <ButtonGroup size="sm" className="mb-2 w-100">
                  {enemies.map(other => (
                    <Button
                      key={other.id}
                      variant="outline-dark"
                      onClick={() => props.attackFeudo(props.feudo.id, other.id)}
                    >
                      ⚔ {other.name}
                    </Button>
                  ))}
                </ButtonGroup>

                <div className="d-grid gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => props.payRansom(props.feudo.id)}
                  >
                    💰 Paga riscatto
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => props.recruitKnight(props.feudo.id)}
                  >
                    ⚔ Recluta Cavaliere
                  </Button>
                </div>

              <hr />
      </>
    )}
  </>
)}

                
             
        
      </Card.Body>
    </Card>
  );
}

export default FeudoCard;