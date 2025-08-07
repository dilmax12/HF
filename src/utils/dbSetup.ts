import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';

const adapter = new LocalStorage('forjador-db');
const db = low(adapter);

db.defaults({
  heroes: [],
  missions: [],
}).write();

export default db;