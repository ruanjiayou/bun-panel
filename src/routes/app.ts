import express from 'express';
import Sqlite from 'utils/sqliter';
import getDb from 'db';
import type { Response } from '../@types/express';

const router = express.Router();

router.get('/', async (req, res) => {
  const sqliter = Sqlite(getDb(), 'apps');
  const docs = sqliter.find().paging(req.paging());
  sqliter.db.close(false);
  (res as Response).success(docs);
});

router.post('/', async (req, res) => {

});



export default router;