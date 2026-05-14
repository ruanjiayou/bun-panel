import express from 'express';
import db from '../db'
import protect from 'plugins/protect';
import { omit } from 'lodash';
import { v7 } from 'uuid';

const router = express.Router();

router.get('/', async (req, res) => {
  const docs = await db.engine.findMany({ where: { uid: res.locals.user.id } });
  res.success(docs);
});

router.post('/', protect, async (req, res) => {
  const data = req.body;
  data.id = v7()
  data.uid = res.locals.user.id;
  const engine = await db.engine.count({ where: { name: data.name, uid: res.locals.user.id } })
  if (!engine) {
    const doc = await db.engine.create({ data })
    res.success(doc);
  } else {
    res.fail('已存在');
  }
});

router.put('/:name', protect, async (req, res) => {
  await db.engine.update({ where: { name: req.params.name, uid: res.locals.user.id }, data: omit(req.body, ['id', 'uid']) })
  res.success();
});

router.delete('/:name', protect, async (req, res) => {
  const name = req.params.name;
  if (name !== "engine") {
    await db.engine.delete({ where: { name, uid: res.locals.user.id } })
    res.success();
  } else {
    res.fail('不能删除正在使用的搜索');
  }
});

export default router;