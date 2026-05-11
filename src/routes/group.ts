import express from 'express';
import db from '../db'

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.group.findMany({ orderBy: { nth: 'asc' } })
  res.success(docs);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const doc = await db.group.create({ data: data })
  res.success(doc);
});

router.put('/:id', async (req, res) => {
  await db.group.update({ where: { id: req.params.id }, data: req.body })
  res.success();
});

router.put('/', async (req, res) => {
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await db.group.update({ where: { id: batch[i].id }, data: { nth: batch[i].nth } })
  }
  res.success();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await db.app.deleteMany({ where: { gid: id } })
  await db.group.delete({ where: { id } })
  res.success();
});

export default router;