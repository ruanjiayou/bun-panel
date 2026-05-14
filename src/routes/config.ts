import express from 'express';
import db from '../db'
import _ from 'lodash';
import protect from 'plugins/protect';
import { v7 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.config.findMany({ where: { uid: res.locals.user.id } })
  res.success(docs);
});

router.put('/', protect, async (req, res) => {
  const configs = req.body;
  for (let i = 0; i < configs.length; i++) {
    const { name, value } = configs[i];
    await db.config.update({ where: { name, uid: res.locals.user.id }, data: { value } })
  }
  res.success();
});

router.put('/:name', protect, async (req, res) => {
  const count = await db.config.count({ where: { name: req.params.name, uid: res.locals.user.id } });
  if (count === 0) {
    await db.config.create({ data: { id: v7(), name: req.params.name, value: req.body.value, title: req.body.title || '', uid: res.locals.user.id } })
  } else {
    await db.config.update({ where: { name: req.params.name, uid: res.locals.user.id }, data: { value: req.body.value } })
  }
  res.success();
});

router.delete('/:name', protect, async (req, res) => {
  await db.config.delete({ where: { name: req.params.name, uid: res.locals.user.id } })
  res.success();
});
export default router;