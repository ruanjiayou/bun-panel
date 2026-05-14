import express from 'express';
import db from '../db'
import protect from 'plugins/protect';
import { omit } from 'lodash';

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.app.findMany({ where: { uid: res.locals.user.id }, orderBy: { nth: 'asc' } })
  res.success(docs);
});

router.post('/', protect, async (req, res) => {
  const data = req.body;
  data.uid = res.locals.user.id;
  const doc = await db.app.create({ data });
  res.success(doc);
});

router.put('/:id', protect, async (req, res) => {
  await db.app.update({ where: { id: req.params.id, uid: res.locals.user.id }, data: omit(req.body, ['id', 'uid']) })
  res.success();
});

router.put('/', protect, async (req, res) => {
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await db.app.update({ where: { id: batch[i].id, uid: res.locals.user.id }, data: { nth: batch[i].nth } })
  }
  res.success();
})

router.delete('/:id', protect, async (req, res) => {
  await db.app.delete({ where: { id: req.params.id, uid: res.locals.user.id } })
  res.success();
});



export default router;