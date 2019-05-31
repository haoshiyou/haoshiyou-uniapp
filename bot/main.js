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
const hsy_bot_1 = require("./hsy-bot");
const wechaty_puppet_padpro_1 = require("wechaty-puppet-padpro");
const wechaty_1 = require("wechaty");
const mongodb_1 = require("mongodb");
require(`dotenv`).config();
let main = function () {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
};
main();
//# sourceMappingURL=main.js.map