import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT
  );
`);

const insertRow = async (msg, clientOffset) => {
  const result = await db.run(
    'INSERT INTO messages (content, client_offset) VALUES (?, ?)',
    msg,
    clientOffset,
  );

  return result;
};

const forEachRowWithIdGreaterThan = async (serverOffset, callback) => {
  await db.each(
    'SELECT id, content FROM messages WHERE id > ?',
    [serverOffset || 0],
    callback,
  );
};

export default {
  insertRow,
  forEachRowWithIdGreaterThan,
};
