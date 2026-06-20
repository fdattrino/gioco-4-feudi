import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('gioco4feudi.sqlite', (err) => {
  if (err) {
    console.error('Errore apertura database:', err.message);
  } else {
    console.log('Database SQLite collegato');
  }
});

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS feudi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grain INTEGER NOT NULL,
    peasants INTEGER NOT NULL,
    knights INTEGER NOT NULL,
    fortification INTEGER NOT NULL,
    manors INTEGER NOT NULL,
    productiveManors INTEGER DEFAULT 10,
    feudalType TEXT DEFAULT 'laico'
  )
`);

  db.get('SELECT COUNT(*) AS total FROM feudi', [], (err, row) => {
    if (row.total === 0) {
      const sql = `
        INSERT INTO feudi
        (name, grain, peasants, knights, fortification, manors, productiveManors, feudalType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [
  'Feudo A',
  500,
  50,
  6,
  0,
  10,
  10,
  'laico'
]);

db.run(sql, [
  'Feudo B',
  500,
  50,
  6,
  0,
  10,
  10,
  'ecclesiastico'
]);

db.run(sql, [
  'Feudo C',
  500,
  50,
  6,
  0,
  10,
  10,
  'laico'
]);

db.run(sql, [
  'Feudo D',
  500,
  50,
  6,
  0,
  10,
  10,
  'ecclesiastico'
]);

      console.log('Feudi iniziali creati');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS game (
      id INTEGER PRIMARY KEY,
      round INTEGER NOT NULL,
      lastEvent TEXT,
      currentFeudoId INTEGER
    )
  `);
  db.run(`
    ALTER TABLE feudi
    ADD COLUMN manors INTEGER DEFAULT 0
  `, () => {});

  db.run(`
    ALTER TABLE feudi
    ADD COLUMN knightsSentToKing INTEGER DEFAULT 0
  `, () => {});

  db.run(`
    ALTER TABLE game
    ADD COLUMN lastEvent TEXT
  `, () => {});

  db.run(`
    ALTER TABLE game
    ADD COLUMN currentFeudoId INTEGER
  `, () => {});

  db.run(`
    ALTER TABLE feudi
    ADD COLUMN productiveManors INTEGER DEFAULT 10
  `, () => {});

  db.run(`
    ALTER TABLE feudi
    ADD COLUMN feudalType TEXT DEFAULT 'laico'
  `, () => {});

  db.run(`
  ALTER TABLE game
  ADD COLUMN pendingAttackWinnerId INTEGER
`, () => {});

db.run(`
  ALTER TABLE game
  ADD COLUMN pendingAttackLoserId INTEGER
`, () => {});

db.run(`
  ALTER TABLE game
  ADD COLUMN pendingAttackGrainLoss INTEGER
`, () => {});

db.run(`
  ALTER TABLE game
  ADD COLUMN pendingAttackManorLoss INTEGER
`, () => {});

  db.get('SELECT COUNT(*) AS total FROM game', [], (err, row) => {
    if (row.total === 0) {
      db.run(
        'INSERT INTO game (id, round, lastEvent, currentFeudoId) VALUES (?, ?, ?, ?)',
        [1, 1, null, 1]
      );

      console.log('Round iniziale creato');
    } else {
      db.run(`
        UPDATE game
        SET currentFeudoId = COALESCE(currentFeudoId, 1)
        WHERE id = 1
      `);
    }
  });
});

export default db;