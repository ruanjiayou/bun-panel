import express from 'express';
import getDb from 'db';
import Sqlite from 'utils/sqliter';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'groups');
  const docs = await sqliter.find();
  sqliter.db.close(false);
  res.success(docs);
});

router.post('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'groups');
  const data = req.body;
  data.id = v4();
  const doc = await sqliter.insertOne(data);
  sqliter.db.close(false);
  res.success(doc);
});

router.put('/:id', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'groups');
  sqliter.update(`id="${req.params.id}"`, req.body);
  sqliter.db.close(false);
  res.success();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const db = getDb();
  const Sgroup = Sqlite(db, 'groups');
  const Sapp = Sqlite<{}>(db, 'apps');
  const apps = await Sapp.find(`gid="${id}"`) as {}[];
  if (apps.length === 0) {
    await Sgroup.destroy(`id="${id}"`);
  }
  db.close(false);
  res.success();
});

export default router;