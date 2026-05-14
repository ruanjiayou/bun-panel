import express from 'express';
import db from '../db'
import { omit } from 'lodash';
import { v7 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.group.findMany({ where: { uid: res.locals.user.id }, orderBy: { nth: 'asc' } })
  res.success(docs);
});

router.post('/', async (req, res) => {
  const data = req.body;
  data.id = v7();
  data.uid = res.locals.user.id;
  const doc = await db.group.create({ data: data })
  res.success(doc);
});

router.put('/:id', async (req, res) => {
  await db.group.update({ where: { id: req.params.id, uid: res.locals.user.id }, data: omit(req.body, ['id', 'uid']) })
  res.success();
});

router.put('/', async (req, res) => {
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await db.group.update({ where: { id: batch[i].id, uid: res.locals.user.id }, data: { nth: batch[i].nth } })
  }
  res.success();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await db.app.deleteMany({ where: { gid: id, uid: res.locals.user.id } })
  await db.group.delete({ where: { id, uid: res.locals.user.id } })
  res.success();
});

export default router;