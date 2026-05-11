import express from 'express';
import db from '../db'

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.engine.findMany({});
  res.success(docs);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const engine = await db.engine.count({ where: { name: data.name } })
  if (!engine) {
    const doc = await db.engine.create({ data })
    res.success(doc);
  } else {
    res.fail('已存在');
  }
});

router.put('/:name', async (req, res) => {
  await db.engine.update({ where: { name: req.params.name }, data: req.body })
  res.success();
});

router.delete('/:name', async (req, res) => {
  const name = req.params.name;
  if (name !== "engine") {
    await db.engine.delete({ where: { name } })
    res.success();
  } else {
    res.fail('不能删除正在使用的搜索');
  }
});

export default router;