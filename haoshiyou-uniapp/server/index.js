"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require(`dotenv`).config();
const hsy_bot_1 = require("../bot/hsy-bot");
const wechaty_puppet_padpro_1 = require("wechaty-puppet-padpro");
const wechaty_1 = require("wechaty");
const mongodb_1 = require("mongodb");
const express = require('express');
const consola = require('consola');
const log4js = require('log4js');
const logger = log4js.getLogger();
const packageJson = require('../package.json');
logger.level = 'debug';
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');
const asyncHandler = fn => (req, res, next) => Promise
    .resolve(fn(req, res, next))
    .catch(next);
function setupHsyApi(app, mongodb) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiRouter = express();
        apiRouter.get('/', asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.debug(`apiRouter mount at ${apiRouter.mountpath}`);
            let listings = yield mongodb.collection(`HsyListing`).find({}).limit(10);
            res.send('Bot route home');
        })));
        apiRouter.get('/HsyListing/list', asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            logger.debug(`apiRouter mount at ${apiRouter.mountpath}`);
            let listings = yield mongodb.collection(`HsyListing`).find({ status: "active" }, { sort: { updated: -1 } }).limit(10).toArray();
            res.send(listings);
        })));
        app.use(`/api/v1`, apiRouter);
    });
}
function setupBot(app, mongodb) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`Start VueNuxt for haoshiyou-uniapp at version ${packageJson.version}!`);
        const puppet = new wechaty_puppet_padpro_1.PuppetPadpro({
            token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
        });
        const wechaty = new wechaty_1.Wechaty({
            puppet,
        });
        let hsyBot = new hsy_bot_1.HsyBot(wechaty, mongodb);
        yield hsyBot.start();
        let botRouter = express();
        botRouter.get('/', function (req, res) {
            logger.debug(`botRouter mount at ${botRouter.mountpath}`);
            res.send('Bot route home');
        });
        app.use(`/bot`, botRouter);
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const { Nuxt, Builder } = require('nuxt');
        const app = express();
        let client = yield mongodb_1.MongoClient.connect(process.env.MONGODB_URI);
        const mongodb = client.db(process.env.MONGODB_URI.split('/')[-1]);
        // Init Nuxt.js
        const nuxt = new Nuxt(config);
        const { host, port } = nuxt.options.server;
        // Build only in dev mode
        if (config.dev) {
            const builder = new Builder(nuxt);
            yield builder.build();
        }
        else {
            yield nuxt.ready();
        }
        yield setupBot(app, mongodb);
        yield setupHsyApi(app, mongodb);
        // Give nuxt middleware to express
        app.use(nuxt.render);
        // Listen the server
        app.listen(port, host);
        consola.ready({
            message: `Server listening on http://${host}:${port}`,
            badge: true
        });
    });
}
start();
//# sourceMappingURL=index.js.map