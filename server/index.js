import db from './db.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import events from './events.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Gioco dei 4 Feudi API'
  });
});

app.get('/api/game', (req, res) => {
  db.get(
    'SELECT * FROM game WHERE id = 1',
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(row);
    }
  );
});

app.post('/api/game/next-turn', (req, res) => {
  db.get('SELECT * FROM game WHERE id = 1', [], (err, game) => {
    if (err) {
      return res.status(500).json(err);
    }

    const nextFeudoId =
      game.currentFeudoId === 4 ? 1 : game.currentFeudoId + 1;

    db.run(
      'UPDATE game SET currentFeudoId = ? WHERE id = 1',
      [nextFeudoId],
      (err) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          currentFeudoId: nextFeudoId
        });
      }
    );
  });
});

app.post('/api/game/draw-event', (req, res) => {
  const event = events[Math.floor(Math.random() * events.length)];

  db.get('SELECT * FROM game WHERE id = 1', [], (err, game) => {
    if (err) {
      return res.status(500).json(err);
    }

    console.log('Turno di:', game.currentFeudoId);

    db.get(
      'SELECT * FROM feudi WHERE id = ?',
      [game.currentFeudoId],
      (err, feudo) => {
        if (err) {
          return res.status(500).json(err);
        }

        let grainChange = event.grain || 0;
        let knightChange = event.knights || 0;
        let peasantChange = event.peasants || 0;
        let manorChange = event.manors || 0;
        let productiveManorChange = event.productiveManors || 0;

        if (event.requiresProtection) {
          const futurePeasants = feudo.peasants + peasantChange;
          const requiredKnights = Math.ceil(futurePeasants / 20);

          if (feudo.knights < requiredKnights) {
            grainChange = 0;
            knightChange = 0;
            peasantChange = 0;
            manorChange = 0;
            productiveManorChange = 0;
          }
        }

        if (
          event.requiredFeudalType &&
          feudo.feudalType !== event.requiredFeudalType
        ) {
          grainChange = 0;
          knightChange = 0;
          peasantChange = 0;
          manorChange = 0;
          productiveManorChange = 0;
        }

        if (event.protectedByFortification && feudo.fortification > 0) {
          if (grainChange < 0) {
            grainChange = Math.ceil(grainChange / 2);
          }

          knightChange = 0;
          peasantChange = 0;
          productiveManorChange = 0;
        }

        db.run(
          `
          UPDATE feudi
          SET grain = MAX(0, grain + ?),
              knights = MAX(0, knights + ?),
              peasants = MAX(0, peasants + ?),
              manors = MAX(0, manors + ?),
              productiveManors = MAX(0, productiveManors + ?)
          WHERE id = ?
          `,
          [
            grainChange,
            knightChange,
            peasantChange,
            manorChange,
            productiveManorChange,
            feudo.id
          ],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            db.run(
              `
              UPDATE game
              SET lastEvent = ?
              WHERE id = 1
              `,
              [event.name],
              (err) => {
                if (err) {
                  return res.status(500).json(err);
                }

                res.json({
                  event,
                  message:
                    `${feudo.name} pesca ${event.name}: grano ${grainChange}, cavalieri ${knightChange}, contadini ${peasantChange}, mansi ${manorChange}, mansi produttivi ${productiveManorChange}`
                });
              }
            );
          }
        );
      }
    );
  });
});

app.post('/api/game/next-round', (req, res) => {
  db.all(
    'SELECT * FROM feudi ORDER BY grain DESC',
    [],
    (err, orderedFeudi) => {
      if (err) {
        return res.status(500).json(err);
      }

      const rewards = [4, 3, 2, 1];

      let rewardCompleted = 0;

      orderedFeudi.forEach((feudo, index) => {
        db.run(
          'UPDATE feudi SET knights = knights + ? WHERE id = ?',
          [rewards[index], feudo.id],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            rewardCompleted++;

            if (rewardCompleted === orderedFeudi.length) {
              db.run(
                'UPDATE feudi SET knightsSentToKing = 0',
                [],
                (err) => {
                  if (err) {
                    return res.status(500).json(err);
                  }

                  db.run(
                    `
                    UPDATE game
                    SET round = round + 1,
                        currentFeudoId = 1
                    WHERE id = 1
                    `,
                    [],
                    (err) => {
                      if (err) {
                        return res.status(500).json(err);
                      }

                      res.json({
                        message: 'Fine round: cavalieri distribuiti.'
                      });
                    }
                  );
                }
              );
            }
          }
        );
      });
    }
  );
});


app.post('/api/game/reset', (req, res) => {
 db.run(
  'UPDATE game SET round = 1, lastEvent = NULL, currentFeudoId = 1 WHERE id = 1',
  [],
  (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    db.run(
      `
     UPDATE feudi
    SET grain = 500,
        peasants = 50,
        knights = 6,
        fortification = 0,
        manors = 10,
        productiveManors = 10,
        knightsSentToKing = 0
      `,
      [],
      (err) => {
        if (err) {
          return res.status(500).json(err);
        }

        db.run("UPDATE feudi SET feudalType = 'laico' WHERE name = 'Feudo A'");
        db.run("UPDATE feudi SET feudalType = 'ecclesiastico' WHERE name = 'Feudo B'");
        db.run("UPDATE feudi SET feudalType = 'laico' WHERE name = 'Feudo C'");
        db.run("UPDATE feudi SET feudalType = 'ecclesiastico' WHERE name = 'Feudo D'");

        res.json({ message: 'Partita resettata' });
      }
    );
  });
});

app.post('/api/feudi/:attackerId/attack/:defenderId', (req, res) => {
  const attackerId = req.params.attackerId;
  const defenderId = req.params.defenderId;

  db.get(
    'SELECT * FROM feudi WHERE id = ?',
    [attackerId],
    (err, attacker) => {

      if (err) {
        return res.status(500).json(err);
      }

      db.get(
        'SELECT * FROM feudi WHERE id = ?',
        [defenderId],
        (err, defender) => {

          if (err) {
            return res.status(500).json(err);
          }

          const attackPower =
            attacker.knights;

          const defensePower =
            defender.knights +
            (defender.fortification * 2);

          const objective =
            Math.max(
              1,
              Math.min(
                10,
                5 + (attackPower - defensePower)
              )
            );

          //const finalObjective =
             //Math.max(1, Math.min(10, objective));

          const dice =
             Math.floor(Math.random() * 10) + 1;

          console.log(
            'Attacco:',
            attackPower,
            'Difesa:',
            defensePower,
            'Obiettivo:',
            objective,
            'Dado:',
            dice
          );

          //if (attackPower > defensePower) {
          if (dice <= objective) {
            const grainLoss =
              defender.fortification > 0
                ? 150
                : 300;
            const manorLoss =
              defender.fortification > 0
                ? 2
                : 4;

            db.run(
              `
              UPDATE feudi
              SET grain = grain + ?,
                  manors = manors + ?,
                  productiveManors = productiveManors + ?
              WHERE id = ?
              `,
              [grainLoss, manorLoss, manorLoss, attackerId],
              (err) => {

                if (err) {
                  return res.status(500).json(err);
                }

                db.run(
                  `
                  UPDATE feudi
                  SET grain = MAX(0, grain - ?),
                      manors = MAX(0, manors - ?),
                      productiveManors = MAX(0, productiveManors - ?)
                  WHERE id = ?
                  `,
                  [grainLoss, manorLoss, manorLoss, defenderId],
                  (err) => {

                    if (err) {
                      return res.status(500).json(err);
                    }

                    res.json({
                      result: 'victory',
                      message:
                        defender.fortification > 0
                          ? `${attacker.name} ha vinto. Il difensore perde 150 grano e 2 mansi grazie alla fortificazione.`
                          : `${attacker.name} ha vinto. Il difensore perde 300 grano e 4 mansi.`
                    });

                  }
                );

              }
            );

          } else {

              db.run(
                `
                UPDATE feudi
                SET knights = MAX(0, knights - 2)
                WHERE id = ?
                `,
                [attackerId],
                (err) => {

                  if (err) {
                    return res.status(500).json(err);
                  }

                  res.json({
                    result: 'defeat',
                    attackerId,
                    defenderId,
                    message:
                       `${attacker.name} è stato sconfitto. 2 cavalieri sono stati catturati da ${defender.name}.`
                  });

                }
              );

            }

        }
      );

    }
  );
});

app.post('/api/feudi/:id/pay-ransom', (req, res) => {
  const id = req.params.id;

  db.run(
    `
    UPDATE feudi
    SET grain = grain - 300,
        knights = knights + 2
    WHERE id = ?
      AND grain >= 300
    `,
    [id],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      if (this.changes === 0) {
        return res.json({
          success: false,
          message: 'Grano insufficiente per pagare il riscatto.'
        });
      }

      res.json({
        success: true,
        message: 'Riscatto pagato. I 2 cavalieri sono stati liberati.'
      });

    }
  );
});

app.get('/api/feudi', (req, res) => {
  const sql = 'SELECT * FROM feudi';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Errore nel database' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/feudi/:id/grain', (req, res) => {

  const id = req.params.id;

  const amount = req.body.amount;

  db.run(
    `
    UPDATE feudi
    SET grain = grain + ?
    WHERE id = ?
    `,
    [amount, id],
    function(err){

      if(err){
        res.status(500).json(err);
      }
      else{

        res.json({
          message:'Grano aggiornato'
        });

      }

    }
  );

});

app.post('/api/feudi/:id/recruit-knight', (req, res) => {

  const id = req.params.id;

  db.run(
    `
    UPDATE feudi
    SET grain = grain - 100,
        knights = knights + 1
    WHERE id = ?
      AND grain >= 100
    `,
    [id],
    function(err){

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message: 'Cavaliere reclutato'
      });

    }
  );

});

app.post('/api/feudi/:id/build-fortification', (req, res) => {

  const id = req.params.id;

  db.run(
    `
    UPDATE feudi
    SET grain = grain - 300,
        fortification = fortification + 1
    WHERE id = ?
      AND grain >= 300
    `,
    [id],
    function(err) {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: 'Fortificazione costruita'
      });

    }
  );

});

app.post('/api/feudi/:id/produce', (req, res) => {

  const id = req.params.id;

  db.get(
    'SELECT * FROM feudi WHERE id = ?',
    [id],
    (err, feudo) => {

      if (err) {
        return res.status(500).json(err);
      }

      const produzione =
        200 + 100 + (feudo.productiveManors * 20);

      const semina = 50;

      const raccolto =
        produzione - semina;

      const mantenimento =
        20 + (feudo.knights * 40);

      const guadagnoNetto =
        raccolto - mantenimento;

      db.run(
        `
        UPDATE feudi
        SET grain = grain + ?
        WHERE id = ?
        `,
        [guadagnoNetto, id],
        function(err) {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            produzione,
            semina,
            mantenimento,
            guadagnoNetto
          });

        }
      );

    }
  );

});

app.post('/api/feudi/:id/serve-king', (req, res) => {
  const id = req.params.id;
  const knightsSent = Number(req.body.knightsSent || 0);

  db.get(
    'SELECT * FROM feudi WHERE id = ?',
    [id],
    (err, feudo) => {
      if (err) {
        return res.status(500).json(err);
      }

      const minKnights = Math.ceil(feudo.peasants / 20);
      const availableKnights = feudo.knights - minKnights;

      if (knightsSent < 1) {
        return res.json({
          success: false,
          message: '👑 Servigi al Re\nNon hai inviato cavalieri.'
        });
      }

      if (knightsSent > availableKnights) {
        return res.json({
          success: false,
          message: `👑 Servigi al Re\nPuoi inviare al massimo ${availableKnights} cavalieri. Devi lasciarne ${minKnights} a difesa.`
        });
      }

      const diceResults = [];
        let successes = 0;
        let losses = 0;

        for (let i = 1; i <= knightsSent; i++) {
          const dice = Math.floor(Math.random() * 6) + 1;

          if (dice % 2 === 0) {
            successes++;

            diceResults.push(
              `Cavaliere ${i}: dado ${dice} → successo`
            );
          } else {
            losses++;

            diceResults.push(
              `Cavaliere ${i}: dado ${dice} → perduto`
            );
          }
        }
      const grainGain = successes * 100;
      const peasantsGain = successes * 5;
      const manorsGain = successes;
      const knightsLost = losses;

      db.run(
        `
        UPDATE feudi
        SET grain = grain + ?,
            peasants = peasants + ?,
            manors = manors + ?,
            productiveManors = productiveManors + ?,
            knights = MAX(0, knights - ?)
        WHERE id = ?
        `,
        [
          grainGain,
          peasantsGain,
          manorsGain,
          manorsGain,
          knightsLost,
          id
        ],
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,
            message:
              `👑 Servigi al Re\n` +
              `Cavalieri inviati: ${knightsSent}\n\n` +
              diceResults.join('\n') +
              `\n\nSuccessi: ${successes}\n` +
              `Perdite: ${losses}\n\n` +
              `+${grainGain} grano\n` +
              `+${peasantsGain} contadini\n` +
              `+${manorsGain} mansi\n` +
              `-${knightsLost} cavalieri`
          });
        }
      );
    }
  );
});

const PORT = 3001;

app.get('/api/save-game', (req, res) => {
  db.get('SELECT * FROM game WHERE id = 1', [], (err, game) => {
    if (err) {
      return res.status(500).json(err);
    }

    db.all('SELECT * FROM feudi', [], (err, feudi) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        savedAt: new Date().toISOString(),
        game,
        feudi
      });
    });
  });
});

app.post('/api/load-game', (req, res) => {
  const save = req.body;

  if (!save.game || !save.feudi) {
    return res.status(400).json({
      message: 'File di salvataggio non valido.'
    });
  }

  db.run(
    `
    UPDATE game
    SET round = ?,
        lastEvent = ?,
        currentFeudoId = ?
    WHERE id = 1
    `,
    [
      save.game.round,
      save.game.lastEvent,
      save.game.currentFeudoId
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      let completed = 0;

      save.feudi.forEach((feudo) => {
        db.run(
          `
          UPDATE feudi
          SET grain = ?,
              peasants = ?,
              knights = ?,
              fortification = ?,
              manors = ?,
              productiveManors = ?,
              knightsSentToKing = ?,
              feudalType = ?
          WHERE id = ?
          `,
          [
            feudo.grain,
            feudo.peasants,
            feudo.knights,
            feudo.fortification,
            feudo.manors,
            feudo.productiveManors,
            feudo.knightsSentToKing || 0,
            feudo.feudalType,
            feudo.id
          ],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            completed++;

            if (completed === save.feudi.length) {
              res.json({
                message: 'Partita caricata correttamente.'
              });
            }
          }
        );
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});