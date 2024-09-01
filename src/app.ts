import express from "express";
import compression from 'compression'
import bodyParser from "body-parser";

import ctx from './plugins/ctx';

import apps from './routes/app';
import groups from './routes/group';
import configs from './routes/config';
import engines from './routes/engine';

const app = express();

app.use(express.static('static'));
app.use(compression());
app.use(bodyParser.json({ limit: '10M' }));
app.use(bodyParser.urlencoded({ limit: '10M' }));

app.use(ctx);

app.get('/', (req, res) => {
  res.json({ message: 'ok' })
});

app.use('/groups', groups);
app.use('/apps', apps);
app.use('/config', configs);
app.use('/engines', engines);

app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404);
    res.end();
  } else {
    next();
  }
})

export default app;