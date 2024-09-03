import { expect, test, describe } from "bun:test";

import { Database } from "bun:sqlite";

const db = new Database("data/temp.db", { create: true });
db.query(`DROP TABLE IF EXISTS apps`).run();
db.query(`CREATE TABLE IF NOT EXISTS apps(
    id INTEGER PRIMARY KEY,
    name CHAR(100),
    title CHAR(100)
  ); `).run();

describe("sqlite", () => {
  test("insert", async () => {
    const result = db.query(`INSERT INTO apps (id,name) VALUES(1, "导航")`).run();
    expect(result).toStrictEqual({ changes: 1, lastInsertRowid: 1 });
  });
  test("count", async () => {
    const v = db.query(`SELECT COUNT(*) as count FROM apps WHERE name="导航"`).get()
    console.log(v)
    expect(v).toStrictEqual({ count: 1 });
  });
});
