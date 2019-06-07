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
const { Nuxt, Builder } = require('nuxt');
const app = express();
const log4js = require('log4js');
const logger = log4js.getLogger();
var packageJson = require('../package.json');
logger.level = 'debug';
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`Start VueNuxt for haoshiyou-uniapp at version ${packageJson.version}!`);
        const puppet = new wechaty_puppet_padpro_1.PuppetPadpro({
            token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
        });
        const wechaty = new wechaty_1.Wechaty({
            puppet,
        });
        let client = yield mongodb_1.MongoClient.connect(process.env.MONGODB_URI);
        const mongodb = client.db(process.env.MONGODB_URI.split('/')[-1]);
        let hsyBot = new hsy_bot_1.HsyBot(wechaty, mongodb);
        yield hsyBot.start();
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