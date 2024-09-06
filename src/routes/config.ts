import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import _ from 'lodash';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'configs');
  const arr = await sqliter.find();
  res.success(arr);
});

router.put('/', async (req, res) => {
  const configs = req.body;
  const sqliter = Sqlite<{ title: string, name: string, value: number | string }>(getDb(), 'configs');
  for (let i = 0; i < configs.length; i++) {
    const { name, value } = configs[i];
    await sqliter.update(`name="${name}"`, { value });
  }
  sqliter.db.close(false);
  res.success();
});

router.put('/:name', async (req, res) => {
  const sqliter = Sqlite<{ title: string, name: string, value: number | string }>(getDb(), 'configs');
  const count = await sqliter.count(`name="${req.params.name}"`);

  if (count === 0) {
    await sqliter.insertOne({ name: req.params.name, value: req.body.value, title: req.body.title || '' })
  } else {
    await sqliter.update(`name="${req.params.name}"`, { value: req.body.value })
  }
  sqliter.db.close(false);
  res.success();
});

router.delete('/:name', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'configs');
  await sqliter.destroy(`name="${req.params.name}"`);
  sqliter.db.close(false);
  res.success();
});
export default router;