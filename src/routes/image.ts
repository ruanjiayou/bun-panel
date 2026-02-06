import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import { v4 } from 'uuid';
import multer from 'multer';
import { copyFile, rename, unlink } from "node:fs/promises";
import mime from 'mime/lite';
import path from 'node:path';
import config from '../config';

const router = express.Router();
const upload = multer({ dest: path.join(config.root_dir, '/data/.tmp') });

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
    filepath: `/uploads/${id}.`,
    created_time: new Date().toISOString(),
  }
  if (req.file) {
    data.filepath += mime.getExtension(req.file.mimetype);
    await copyFile(req.file.path, path.join(config.root_dir, 'public', data.filepath));
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
    const fullpath = path.join(config.root_dir, 'public', doc.filepath);
    if (await Bun.file(fullpath).exists()) {
      await unlink(fullpath);
    }
    await sqliter.destroy(`id="${req.params.id}"`);
  }
  sqliter.db.close(false);
  res.success();
});



export default router;