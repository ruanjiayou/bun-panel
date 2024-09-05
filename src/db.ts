import { Database } from "bun:sqlite";
import Sqlite from "./utils/sqliter";
import { v4 } from "uuid";

const isExists = Bun.file('data/panel.db').size !== 0;

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
  url_lan: 'CHAR(300)',
  url_wan: 'CHAR(300)',
  type: 'INTEGER',
  // 1 _blank 2 _self
  open: 'INTEGER',
  nth: 'INTEGER'
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
if (!isExists) {
  // { title, network, show_search, background_url, footer, engine }
  Sqlite(db, 'configs').insertOne({ name: 'title', title: '标题', value: 'Bun-Panel' });
  // LAN/WAN
  Sqlite(db, 'configs').insertOne({ name: 'network', title: '网络模式', value: 'LAN' });
  Sqlite(db, 'configs').insertOne({ name: 'engine', title: ' 搜索引擎', value: 'bing' });
  // 1 / 0
  Sqlite(db, 'configs').insertOne({ name: 'show_search', title: '显示搜索', value: '1' });
  Sqlite(db, 'configs').insertOne({ name: 'background_url', title: '壁纸', value: '/uploads/cf03e199-aa4b-4787-aa44-b479eb008abb.jpg' });
  Sqlite(db, 'configs').insertOne({ name: 'footer', title: '页脚', value: 'easy' });

  Sqlite(db, 'engines').insertOne({ name: 'bing', title: '必应', icon: '/uploads/bing.png', url: 'https://cn.bing.com/search?q=' });
  Sqlite(db, 'engines').insertOne({ name: 'google', title: '谷歌', icon: '/uploads/google.png', url: 'https://google.com/search?q=' });
  Sqlite(db, 'engines').insertOne({ name: 'baidu', title: '百度', icon: '/uploads/baidu.png', url: 'https://baidu.com/search?q=' });

  const group = Sqlite<{ id: string, nth: number, name: string, fold: number }>(db, 'groups').insertOne({ id: v4(), nth: 1, name: '常用', fold: 0 });

  Sqlite(db, 'apps').insertOne({ id: v4(), gid: group.id, name: 'youtube', desc: '', cover: '', url_wan: 'https://youtube.com', type: 1, open: 1, nth: 1, url_lan: '' });
}
db.close(false);

export default function getDb() {
  return new Database("data/panel.db", { create: true });
};