import {HsyBot} from "./hsy-bot";

require(`dotenv`).config();

let main = async function() {
  let hsyBot = new HsyBot();
  hsyBot.start();
};

main();
