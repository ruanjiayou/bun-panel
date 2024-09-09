import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import { v4 } from 'uuid';
import multer from 'multer';
import { copyFile, rename, unlink } from "node:fs/promises";


const router = express.Router();
const upload = multer({ dest: 'data/.tmp' });

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'images');
  const docs = await sqliter.find().paging(req.paging());
  sqliter.db.close(false);
  res.success(docs);
});

router.post('/', upload.single('image'), async (req, res) => {
  const sqliter = Sqlite(getDb(), 'images');
  const id = v4();
  const data = {
    id,
    title: req.body.title || '',
    filepath: `/uploads/${id}.jpg`,
    created_time: new Date().toISOString(),
  }
  if (req.file) {
    await copyFile(req.file.path, "data" + data.filepath);
    try {
      await unlink(req.file.path);
    } catch (e) {
      console.log(e);
    }
  }
  const doc = sqliter.insertOne(data);
  sqliter.db.close(false);
  res.success(doc);
});

router.delete('/:id', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'images');
  const doc = await sqliter.findOne(`id="${req.params.id}"`);
  if (doc) {
    if (await Bun.file(doc.filepath).exists()) {
      await unlink(doc.filepath);
    }
    await sqliter.destroy(`id="${req.params.id}"`);
  }
  sqliter.db.close(false);
  res.success();
});



export default router;