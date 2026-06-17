import { useEffect, useState } from 'react';
import FeudoCard from './components/FeudoCard';
import GameBoard from './components/GameBoard';




function App() {
  const [game, setGame] = useState(null);
  const [feudi, setFeudi] = useState([]);
  const [eventMessage, setEventMessage] = useState('');
  const [battleMessage, setBattleMessage] = useState('');

const attackFeudo = (attackerId, defenderId) => {
  fetch(`http://localhost:3001/api/feudi/${attackerId}/attack/${defenderId}`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      setBattleMessage(data.message);
      loadFeudi();
    });
};

  const loadFeudi = () => {
  fetch('http://localhost:3001/api/feudi')
    .then(response => response.json())
    .then(data => setFeudi(data));
};

  const loadGame = () => {
    fetch('http://localhost:3001/api/game')
      .then(response => response.json())
      .then(data => setGame(data));
      {/*then(data => setFeudi(data));*/}
  };

  useEffect(() => {
  loadFeudi();
  loadGame();
}, []);


  const resetGame = () => {
  fetch('http://localhost:3001/api/game/reset', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(() => {
      loadGame();
      loadFeudi();
      setBattleMessage('');
    });
};
  const nextRound = () => {
  fetch('http://localhost:3001/api/game/next-round', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      setBattleMessage(data.message);
      loadGame();
      loadFeudi();
    });
};

  const addGrain = (id) => {
    fetch(`http://localhost:3001/api/feudi/${id}/grain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 100
      })
    })
      .then(response => response.json())
      .then(() => loadFeudi());
  };

  const recruitKnight = (id) => {
  fetch(`http://localhost:3001/api/feudi/${id}/recruit-knight`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(() => loadFeudi());
};
const buildFortification = (id) => {

  fetch(
    `http://localhost:3001/api/feudi/${id}/build-fortification`,
    {
      method: 'POST'
    }
  )
    .then(response => response.json())
    .then(() => loadFeudi());

};

const produce = (id) => {
  fetch(`http://localhost:3001/api/feudi/${id}/produce`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {

      setBattleMessage(
        `🌾 Produzione: ${data.produzione}
    🌱 Semina: -${data.semina}
    ⚔ Mantenimento: -${data.mantenimento}
    ✅ Guadagno netto: +${data.guadagnoNetto}`
      );

      loadFeudi();

    });
};

const payRansom = (id) => {
  fetch(
    `http://localhost:3001/api/feudi/${id}/pay-ransom`,
    {
      method: 'POST'
    }
  )
    .then(response => response.json())
    .then(data => {
      setBattleMessage(data.message);
      loadFeudi();
    });
};

const nextTurn = () => {
  fetch('http://localhost:3001/api/game/next-turn', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(() => loadGame());
};

const serveKing = (id) => {

  fetch(
    `http://localhost:3001/api/feudi/${id}/serve-king`,
    {
      method: 'POST'
    }
  )
    .then(response => response.json())
    .then(data => {

      setBattleMessage(data.message);

      loadFeudi();

    });

};

const drawEvent = () => {
  fetch('http://localhost:3001/api/game/draw-event', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      setBattleMessage(data.message);
      loadGame();
      loadFeudi();
    });
};

  return (
  <>
   <h1
  style={{
    fontSize: '32px',
    textAlign: 'center',
    margin: '5px 0 10px 0'
  }}
>
  Gioco dei 4 Feudi
</h1>
    <GameBoard
      feudi={feudi}
      game={game}
      addGrain={addGrain}
      recruitKnight={recruitKnight}
      buildFortification={buildFortification}
      produce={produce}
      nextRound={nextRound}
      resetGame={resetGame}
      battleMessage={battleMessage}
      attackFeudo={attackFeudo}
      nextTurn={nextTurn}
      serveKing={serveKing}
      drawEvent={drawEvent}
      payRansom={payRansom}
    />
  </>
);

    
  
}

export default App;