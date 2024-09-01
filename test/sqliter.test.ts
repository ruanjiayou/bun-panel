import { expect, test, describe } from "bun:test";

import { Database } from "bun:sqlite";
import Sqlite from "../src/utils/sqliter";

const db = new Database("data/temp.db", { create: true });
db.query(`DROP TABLE IF EXISTS apps`).run();
db.query(`CREATE TABLE IF NOT EXISTS apps(
    id INTEGER PRIMARY KEY,
    name CHAR(100)
  ); `).run();
const sqlite = Sqlite<{ id: number, name: string }>(db, 'apps');

describe("sqlite", () => {

  test('create & drop', async () => {
    const t = Sqlite<{ id: number, name: string, time: Date | string, available: boolean, deleted: number | null, symbol: string | any }>(db, 'temp');
    t.create({ id: 'INTEGER', name: 'CHAR(100)', time: 'CHAR(50)', available: 'INTEGER', deleted: 'INTEGER', symbol: 'CHAR(50)' }, { NE: true });
    t.insertOne({ id: 1, name: 'name', time: new Date(), available: true, deleted: null, symbol: undefined });
    t.drop();
  });

  test("insert", async () => {
    expect(sqlite.insertOne({ id: 1, name: 'first' })).toStrictEqual({ changes: 1, lastInsertRowid: 1 });
  });

  test('find', async () => {
    const docs = await sqlite.find('id=1').select('id,name').order('id ASC').limit(0).skip(0);
    expect(docs.length).toBe(1);
    expect(docs[0].name).toBe('first');
  });

  test('update', async () => {
    await sqlite.update('id=1', { name: 'first update' });
    const docs = await sqlite.find('id=1').limit(1);
    expect(docs.length).toBe(1);
    expect(docs[0].name).toBe('first update');
  });

  test('destroy', async () => {
    await sqlite.destroy('id=1');
    const docs = await sqlite.find('id=1');
    expect(docs.length).toBe(0);
  });

});
