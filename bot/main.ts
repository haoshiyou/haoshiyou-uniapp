import {HsyBot} from "./hsy-bot";
import {PuppetPadpro} from "wechaty-puppet-padpro";
import {Wechaty} from "wechaty";

require(`dotenv`).config();

let main = async function() {
  const puppet = new PuppetPadpro({
    token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
  });

  const wechaty = new Wechaty({
    puppet,
  });

  let hsyBot = new HsyBot(wechaty);
  await hsyBot.start();

};

main();
