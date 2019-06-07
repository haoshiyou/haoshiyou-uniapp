require(`dotenv`).config();
import {HsyBot} from "../bot/hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";
import {Db, MongoClient} from "mongodb";

const express = require('express');
const consola = require('consola');

const log4js = require('log4js');
const logger = log4js.getLogger();
const packageJson = require('../package.json');

logger.level = 'debug';

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next);


async function setupHsyApi(app, mongodb) {
  let apiRouter = express();
  apiRouter.get('/',  asyncHandler(async (req, res) => {
    logger.debug(`apiRouter mount at ${apiRouter.mountpath}`);
    let listings = await mongodb.collection(`HsyListing`).find({}).limit(10);

    res.send('Bot route home');
  }));

  apiRouter.get('/HsyListing/list',  asyncHandler(async (req, res) => {
    logger.debug(`apiRouter mount at ${apiRouter.mountpath}`);
    let listings = await mongodb.collection(`HsyListing`).find({status: "active"}, {sort: {updated: -1}}).limit(10).toArray();

    res.send(listings);
  }));

  app.use(`/api/v1`, apiRouter);
}
async function setupBot(app, mongodb) {
  logger.debug(`Start VueNuxt for haoshiyou-uniapp at version ${packageJson.version}!`);
  const puppet = new PuppetPadpro({
    token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
  });

  const wechaty:Wechaty = new Wechaty({
    puppet,
  });

  let hsyBot = new HsyBot(wechaty, mongodb);
  await hsyBot.start();

  let botRouter = express();
  botRouter.get('/', function (req, res) {
    logger.debug(`botRouter mount at ${botRouter.mountpath}`);
    res.send('Bot route home');
  });
  app.use(`/bot`, botRouter);
}

async function start() {
  const { Nuxt, Builder } = require('nuxt');
  const app = express();

  let client:MongoClient = await MongoClient.connect(process.env.MONGODB_URI);
  const mongodb:Db = client.db(process.env.MONGODB_URI.split('/')[-1]);


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
  await setupBot(app, mongodb);
  await setupHsyApi(app, mongodb);
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
