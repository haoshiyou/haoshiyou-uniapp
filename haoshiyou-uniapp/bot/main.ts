import {HsyBot} from "./hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";
import {Db, MongoClient} from "mongodb";

require(`dotenv`).config();

let main = async function() {
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

};

main();
