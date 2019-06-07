require(`dotenv`).config();
import {HsyBot} from "../bot/hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";
import {Db, MongoClient} from "mongodb";

const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const log4js = require('log4js');
const logger = log4js.getLogger();
var packageJson = require('../package.json');

logger.level = 'debug';

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  logger.debug(`Start VueNuxt for haoshiyou-uniapp at version ${packageJson.version}!`);
  const puppet = new PuppetPadpro({
    token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
  });

  const wechaty:Wechaty = new Wechaty({
    puppet,
  });

  let client:MongoClient = await MongoClient.connect(process.env.MONGODB_URI);
  const mongodb:Db = client.db(process.env.MONGODB_URI.split('/')[-1]);
  let hsyBot = new HsyBot(wechaty, mongodb);
  await hsyBot.start();

  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build()
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start();
