import express from 'express';
import db from '../db'

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.app.findMany({ orderBy: { nth: 'asc' } })
  res.success(docs);
});

router.post('/', async (req, res) => {
  const doc = await db.app.create({ data: req.body });
  res.success(doc);
});

router.put('/:id', async (req, res) => {
  await db.app.update({ where: { id: req.params.id }, data: req.body })
  res.success();
});

router.put('/', async (req, res) => {
  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    await db.app.update({ where: { id: batch[i].id }, data: { nth: batch[i].nth } })
  }
  res.success();
})

router.delete('/:id', async (req, res) => {
  await db.app.delete({ where: { id: req.params.id } })
  res.success();
});



export default router;