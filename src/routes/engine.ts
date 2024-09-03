import express from 'express';
import getDb from 'db';
import Sqlite from 'utils/sqliter';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'engines');
  const docs = await sqliter.find();
  sqliter.db.close(false);
  res.success(docs);
});

router.post('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'engines');
  const data = req.body;
  const engine = await sqliter.findOne(`name="${data.name}"`);
  if (!engine) {
    const doc = await sqliter.insertOne(data);
    res.success(doc);
  } else {
    res.fail('已存在');
  }
  sqliter.db.close(false);

});

router.put('/:name', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'engines');
  sqliter.update(`name="${req.params.name}"`, req.body);
  sqliter.db.close(false);
  res.success();
});

router.delete('/:name', async (req, res) => {
  const name = req.params.name;
  const db = getDb();
  const Sengine = Sqlite(db, 'engines');
  const Sconfig = Sqlite(db, 'configs');
  const engine = await Sconfig.find(`name="engine"`);
  if (!engine) {
    await Sengine.destroy(`name="${name}"`);
    res.success();
  } else {
    res.fail('不能删除正在使用的搜索');
  }
  db.close(false);
});

export default router;