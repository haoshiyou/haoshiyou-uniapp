import {HsyBot} from "./hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";
import {Db} from "mongodb";
const MongoClient = require('mongodb').MongoClient;

require(`dotenv`).config();

let main = async function() {
  const puppet = new PuppetPadpro({
    token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
  });

  const wechaty:Wechaty = new Wechaty({
    puppet,
  });

  const mongodb:Db = await MongoClient.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

  let hsyBot = new HsyBot(wechaty, mongodb);
  await hsyBot.start();

};

main();
