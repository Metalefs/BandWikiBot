// eslint-disable-next-line @typescript-eslint/no-var-requires

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initBot } from './bot';
//import { googleCredentials } from './env';
//import * as fs from "fs";

//const admin = require('firebase-admin');

//fs.writeFileSync('./google-credentials.json', googleCredentials);
// const serviceAccount = require("./google-credentials.json");
// admin.initializeApp({
//   credential: admin.credential.cert('./google-credentials.json')
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await initBot();
  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');
}

bootstrap();