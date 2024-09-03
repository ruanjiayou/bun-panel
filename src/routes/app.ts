import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  const docs = await sqliter.find().paging(req.paging());
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
  sqliter.update(`id="${req.params.id}"`, req.body);
  sqliter.db.close(false);
  res.success();
});

router.delete('/:id', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  sqliter.destroy(`id="${req.params.id}"`);
  sqliter.db.close(false);
  res.success();
});



export default router;