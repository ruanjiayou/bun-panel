import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  const docs = await sqliter.find().order('nth ASC');
  sqliter.db.close(false);
  res.success(docs);
});

router.post('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  const data = req.body;
  data.id = v4();
  const doc = sqliter.insertOne(data);
  sqliter.db.close(false);
  res.success(doc);
});

router.put('/:id', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  await sqliter.update(`id="${req.params.id}"`, req.body);
  sqliter.db.close(false);
  res.success();
});

router.put('/', async (req, res) => {
  const sqliter = Sqlite<{ nth: number }>(getDb(), 'apps');
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await sqliter.update(`id="${batch[i].id}"`, { nth: batch[i].nth });
  }
  sqliter.db.close(false);
  res.success();
})

router.delete('/:id', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  await sqliter.destroy(`id="${req.params.id}"`);
  sqliter.db.close(false);
  res.success();
});



export default router;