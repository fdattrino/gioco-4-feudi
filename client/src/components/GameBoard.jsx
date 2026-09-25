import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
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
    <Container fluid className="mt-0">
      <Row className="justify-content-center mb-1">
        <Col xs={12} lg={10}>
          {renderFeudo(feudoB, true)}
        </Col>
      </Row>

      <Row className="justify-content-center align-items-start g-1">
        <Col xs={12} md={3}>
          {renderFeudo(feudoA)}
        </Col>

        <Col xs={12} md={5}>
          <Card className="text-center border border-2 border-dark">
            <Card.Body className="p-2">
              <Card.Title as="h2" className="fs-5 mb-1">Centro</Card.Title>
              <label className="btn btn-sm btn-outline-primary">
                📂 Carica partita
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={props.loadSavedGame}
                />
              </label>
              <p className="mb-0 small">📅 Round {props.game ? props.game.round : '...'}</p>
              <p className="mb-0 small">🎲 Evento: {props.game?.lastEvent || 'Nessuno'}</p>
              <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                ⚔ {props.battleMessage || 'Nessuna battaglia'}
              </pre>
              {props.game?.pendingAttackWinnerId && (
              <div className="d-flex gap-2 justify-content-center mb-2">
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={props.takeAttackGrain}
                >
                  🌾 Prendi grano
                </Button>

                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={props.takeAttackManors}
                >
                  🏡 Occupa mansi
                </Button>
              </div>
)}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '4px'
                }}
              >
                <span className="small">
                  👤 Turno: {
                    props.feudi.find(f => f.id === props.game?.currentFeudoId)?.name || '...'
                  }
                </span>

                <Button
                  size="sm"
                  variant="success"
                  onClick={props.nextTurn}
                  disabled={!!props.game?.pendingAttackWinnerId}
                >
                  ✅ Fine turno
                </Button>
              </div>

              {props.game?.pendingAttackWinnerId && (
                <p className="small text-warning text-center mb-1">
                  ⚠ Scegli prima la ricompensa dell'attacco per poter continuare
                </p>
              )}

              <ButtonGroup className="mb-1">
                <Button size="sm" variant="outline-dark" onClick={props.drawEvent}>
                  🎲 Pesca imprevisto
                </Button>

                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={props.nextRound}
                  disabled={!!props.game?.pendingAttackWinnerId}
                >
                  ➡ Fine Round
                </Button>
              </ButtonGroup>

              <br />

              <ButtonGroup className="mb-1">
                <Button size="sm" variant="outline-secondary" onClick={props.resetGame}>
                  🔄 Reset partita
                </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={props.saveGame}
              >
                💾 Salva partita
              </Button>
               
              </ButtonGroup>

              <MapBoard feudi={props.feudi} />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={3}>
          {renderFeudo(feudoC)}
        </Col>
      </Row>

      <Row className="justify-content-center mt-1">
        <Col xs={12} lg={10}>
          {renderFeudo(feudoD, true)}
        </Col>
      </Row>
    </Container>
  );
}

export default GameBoard;


