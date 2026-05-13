import express from 'express';
import db from '../db'
import { v7 } from 'uuid';
import multer from 'multer';
import { copyFile, rename, unlink } from "node:fs/promises";
import mime from 'mime/lite';
import path from 'node:path';
import config from '../config';

const router = express.Router();
const upload = multer({ dest: path.join(config.root_dir, '/data/.tmp') });

router.get('/', async (req, res) => {
  const pagination = req.paging();
  const docs = await db.image.findMany({
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
  });
  res.success(docs);
});

router.post('/', upload.single('image'), async (req, res) => {
  const id = v7();
  const data = {
    id,
    title: req.body.title || '',
    filepath: `/images/panel/${id}.`,
    created_time: new Date().toISOString(),
  }
  if (req.file) {
    data.filepath += mime.getExtension(req.file.mimetype);
    await copyFile(req.file.path, path.join(config.static_dir, data.filepath));
    try {
      await unlink(req.file.path);
    } catch (e) {
      console.log(e);
    }
  } else {
    return res.fail()
  }
  const doc = await db.image.create({ data })
  res.success(doc);
});

router.delete('/:id', async (req, res) => {
  const doc = await db.image.findFirst({ where: { id: req.params.id } })
  if (doc) {
    const fullpath = path.join(config.static_dir, doc.filepath);
    if (await Bun.file(fullpath).exists()) {
      await unlink(fullpath);
    }
    await db.image.delete({ where: { id: req.params.id } })
  }
  res.success();
});



export default router;