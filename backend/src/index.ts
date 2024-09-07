import app from './app';
import config from './config';

import { runMigrations } from './database';

(async () => {
  await runMigrations()
  app.listen(config.port, () => {
    console.log(`http://localhost:${config.port}`)
  })
})()

