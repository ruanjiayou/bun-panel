import express from 'express';
import db from '../db'
import _ from 'lodash';

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.config.findMany({})
  res.success(docs);
});

router.put('/', async (req, res) => {
  const configs = req.body;
  for (let i = 0; i < configs.length; i++) {
    const { name, value } = configs[i];
    await db.config.update({ where: { name }, data: { value } })
  }
  res.success();
});

router.put('/:name', async (req, res) => {
  const count = await db.config.count({ where: { name: req.params.name } });
  if (count === 0) {
    await db.config.create({ data: { name: req.params.name, value: req.body.value, title: req.body.title || '' } })
  } else {
    await db.config.update({ where: { name: req.params.name }, data: { value: req.body.value } })
  }
  res.success();
});

router.delete('/:name', async (req, res) => {
  await db.config.delete({ where: { name: req.params.name } })
  res.success();
});
export default router;