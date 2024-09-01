import { Database } from "bun:sqlite";
import Sqlite from "./utils/sqliter";

const db = new Database("data/panel.db", { create: true });
Sqlite(db, 'groups').create({
  id: 'INTERGER PRIMARY KEY',
  index: 'INTEGER',
  name: 'CHAR(50)',
  fold: "INTEGER"
});
Sqlite(db, 'apps').create({
  id: 'INTEGER PRIMARY KEY',
  gid: 'INTEGER',
  name: 'CHAR(100)',
  desc: 'CHAR(100)',
  cover: 'CHAR(300)',
  url: 'CHAR(300)',
  type: 'INTEGER',
  open: 'INTEGER',
  url_internal: 'CHAR(300)',
  bg_url: 'CHAR(300)',
  bg_color: 'CHAR(50)',
});
Sqlite(db, 'engines').create({
  id: 'INTEGER',
  name: 'CHAR(100)',
  inuse: 'INTEGER'
});
Sqlite(db, 'config').create({
  mode: 'CHAR(10)',
  engine_id: 'INTEGER',
  title: 'CHAR(100)',
  logo: 'CHAR(300)',
  bg: 'CHAR(300)',
});
db.close(false);

export default function getDb() {
  return new Database("data/panel.db", { create: true });
};