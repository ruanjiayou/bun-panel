import express from 'express';
import getDb from 'db';
import Sqlite from 'utils/sqliter';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'groups');
  const docs = await sqliter.find().order('nth ASC');
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
  await sqliter.update(`id="${req.params.id}"`, req.body);
  sqliter.db.close(false);
  res.success();
});

router.put('/', async (req, res) => {
  const sqliter = Sqlite<{ nth: number }>(getDb(), 'groups');
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await sqliter.update(`id="${batch[i].id}"`, { nth: batch[i].nth });
  }
  sqliter.db.close(false);
  res.success();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const db = getDb();
  const Sgroup = Sqlite(db, 'groups');
  const Sapp = Sqlite<{}>(db, 'apps');
  await Sgroup.destroy(`id="${id}"`);
  await Sapp.destroy(`gid="${id}"`);
  db.close(false);
  res.success();
});

export default router;