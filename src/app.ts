import express from "express";
import compression from 'compression'
import bodyParser from "body-parser";

import ctx from './plugins/ctx';

import apps from './routes/app';
import groups from './routes/group';
import configs from './routes/config';
import engines from './routes/engine';
import images from './routes/image';
import getLogger from "utils/logger";
import config from './config'

const app = express();
const logger = getLogger('access');
app.set('root_dir', config.root_dir);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// static 是相对 process.cwd()的,use 必须/开头
app.use(express.static(config.root_dir + '/public'));
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100 }));

app.use(ctx);
app.use((req, res, next) => {
  logger.info(req.url);
  next();
})

app.get('/', (req, res) => {
  res.json({ message: 'ok' })
});

app.use('/api/groups', groups);
app.use('/api/apps', apps);
app.use('/api/config', configs);
app.use('/api/engines', engines);
app.use('/api/images', images);

app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404);
    res.end();
  } else {
    next();
  }
})

export default app;