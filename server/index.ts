require(`dotenv`).config();
import {HsyBot} from "../bot/hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";
import {Db, MongoClient} from "mongodb";
import { async } from "q";

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
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    let listings = {};
    if(req.query.areaEnum != ''){
      listings = await mongodb.collection(`HsyListing`)
      .find({
        "location.hsyGeoAreaEnum": req.query.areaEnum,
        status: "active"
      }, {
        sort: {
          updated: -1
        },
        projection: {
          rawHistory: 0
        }
      })
      .skip(offset)
      .limit(limit)
      .toArray();
    }
    else{
      listings = await mongodb.collection(`HsyListing`)
        .find({
          status: "active"
        }, {
          sort: {
            updated: -1
          },
          projection: {
            rawHistory: 0
          }
        })
        .skip(offset)
        .limit(limit)
        .toArray();
    }
    res.send(listings);
  }));

  apiRouter.get('/HsyListing/:id',  asyncHandler(async (req, res) => {
    logger.debug(`apiRouter mount at ${apiRouter.mountpath}`);
    logger.debug(`Id = ${JSON.stringify(req.params, null, 2)}`);
    let listing = await mongodb.collection(`HsyListing`)
      .findOne({
        _id: req.params.id,
        status: "active" // if a listing is not active, we will not show them
        }, {
          projection: {
            rawHistory: 0
          }
        }
        );
    if (listing) {
      res.send(listing);
    } else {
      // HTTP status 404: NotFound
      res.status(404)
          .send(`HsyListing Id = ${req.params.id} Not found!`);
    }
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
  botRouter.get('/statusz/:freshcap', asyncHandler(async (req, res) => {
    let freshcap = parseInt(req.params.freshcap)
    let myId = wechaty.userSelf().id;
    let wxMetaArray = await mongodb.collection(`WxMeta`).find({_id:`wxId:${myId}`}).toArray();
    if (wxMetaArray.length == 1) {
      let statusJson = wxMetaArray[0];
      let now = new Date();
      let lastKnown = new Date(statusJson.lastKnown);
      statusJson[`freshness`] =  now.getTime() - lastKnown.getTime();
      statusJson[`isFresh`] = statusJson[`freshness`] <= freshcap; // 5min
      res.send(wxMetaArray[0]);
    } else if (wxMetaArray.length == 0) {
      res.send(`{ _id: "wxId:${myId}", status: "unknown" }`);
    }

  }));
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
  if (process.env.ENABLE_BOT) await setupBot(app, mongodb);
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
