import { Database } from "bun:sqlite";
import Sqlite from "./utils/sqliter";

const db = new Database("data/panel.db", { create: true });
Sqlite(db, 'groups').create({
  id: 'CHAR(40) PRIMARY KEY',
  nth: 'INTEGER',
  name: 'CHAR(50)',
  fold: "INTEGER"
});

Sqlite(db, 'apps').create({
  id: 'CHAR(40) PRIMARY KEY',
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

Sqlite(db, 'images').create({
  id: 'CHAR(40)',
  title: 'CHAR(100)',
  filepath: 'CHAR(300)',
  created_time: 'CHAR(50)',
});

Sqlite(db, 'engines').create({
  name: 'CHAR(100)',
  title: 'CHAR(100)',
  icon: 'CHAR(300)',
  url: 'CHAR(300)',
});
Sqlite(db, 'configs').create({
  name: 'CHAR(100)',
  title: 'CHAR(100)',
  value: 'CHAR(300)',
});
db.close(false);

export default function getDb() {
  return new Database("data/panel.db", { create: true });
};