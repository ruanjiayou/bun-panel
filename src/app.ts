import express from "express";
import compression from 'compression'
import bodyParser from "body-parser";

import ctx from './plugins/ctx';

import apps from './routes/app';
import groups from './routes/group';
import configs from './routes/config';
import engines from './routes/engine';
import images from './routes/image';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public'));
app.use('/uploads', express.static('data/uploads'));
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100 }));

app.use(ctx);

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