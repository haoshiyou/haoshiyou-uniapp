import {Contact, Message, Room, Wechaty} from 'wechaty';
import {ContactSelf} from "wechaty/dist/src/user";
import {ChatRoute, ChatRouter} from "./chat-router";
import {sify} from 'chinese-conv';
import Bottleneck from "bottleneck";
import {ContactType} from "wechaty-puppet";
import {Db, MongoClient} from "mongodb";

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const hsyRoomsNameToIdMap = { /*key=GroupName, value=chatroomId*/
  测试: "7046190982@chatroom",  // : "【好室友】测试群",
  西雅图: "28795198@chatroom",    // : "【好室友】西雅图租房群(试运行)",
  短租: "384195587@chatroom",   // : "【好室友】短租 - 流动群",
  东湾: "348466485@chatroom",   // : "【好室友】东湾租房群",
  三番: "1136072@chatroom",    // : "【好室友】三番租房群旧金山sf城内",
  南湾西: "544705980@chatroom",   // : "【好室友】南湾西PA-MTV-SV租房群",
  南湾东: "106702284@chatroom",   // : "【好室友】南湾东 MPTS-SJ租房群",
  中半岛: "314160598@chatroom",   // : "【好室友】中半岛租房群",
};

const hsyRoomsIdToNameMap = {
  "7046190982@chatroom": "测试",  // : "【好室友】测试群",
  "28795198@chatroom": "西雅图",    // : "【好室友】西雅图租房群(试运行)",
  "384195587@chatroom": "短租",   // : "【好室友】短租 - 流动群",
  "348466485@chatroom": "东湾",   // : "【好室友】东湾租房群",
  "1136072@chatroom": "三番",    // : "【好室友】三番租房群旧金山sf城内",
  "544705980@chatroom": "南湾西",   // : "【好室友】南湾西PA-MTV-SV租房群",
  "106702284@chatroom": "南湾东",   // : "【好室友】南湾东 MPTS-SJ租房群",
  "314160598@chatroom": "中半岛",   // : "【好室友】中半岛租房群",
};

const HARDCODED_ADMINS = [
  // from 大军团
  "haoshiyou-bot",
  "haoshiyou-admin",
  "haoshiyou-bot2",
  "xinbenlv", // zzn, zainan
  "xiaowusheng", // 易耿超
  "wxid_wl56wlfbwn512", // 刘宵含
  "wxid_5ma39vrqixyn11", // 杜秋莎
  "wxid_g7tm5wadh8ug11",  // 周琳
  "wxid_2psmr08jb8yu22", // haoshiyou-bot2
  "wxid_i5nvum6hqzt312", // 杜秋莎2
  "shohoku11wrj", // 翁仁杰
  "chenleidan", // 陈镭丹
  "wxid_pq2et5qivaut11", // 汪沛沛
  "amy-mido", // 黄元蕾
  "lijiaqi", // Jack Li
  "adamzhu1986", // 朱旭东
  "wxid_9i3qe4iaistq22", // haoshiyou-bot
  "wxid_mp4e78qq2fl222", // 助理载
  "wxid_mqu5m5dvx9i822", // 非高仿
  "a38372624", // WilliamChen
  "angela0622sx", // 雷梦雪
  "wxid_zvjlfty9zs7f11", // KittyHe
];

const HARDCODED_WHITELIST = [
  // from 测试群
  "xiaowusheng", // gengchao
  "shohoku11wrj", // renjie
  "wxid_2psmr08jb8yu22", // haoshiyou-admin
  "wxid_5ma39vrqixyn11", // shasha 杜秋莎
  "wxid_9i3qe4iaistq22", // haoshiyou-bot
  "wxid_mp4e78qq2fl222", // haoshiyou-bot2
  "xinbenlv", // xinbenlv
  "wxid_mqu5m5dvx9i822", // xinbenlv-g
];


/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
export class HsyBot {

  private wechaty:Wechaty;
  private qrcode: string;
  private chatRouter:ChatRouter;
  private mongodb:Db;
  private limiter = new Bottleneck({
    minTime: 1500
  });

  constructor(wechaty:Wechaty, mongodb:Db) {
    this.wechaty = wechaty;
    this.chatRouter = new ChatRouter();
    this.mongodb = mongodb;
    this.chatRouter.register(new ChatRoute(
      'Ignore',
      async (message:Message) => {
        if (message.from().id === this.wechaty.id) {
          return true; // yes ignore message from myselfs
        } else if (message.room() // it's a room TODO test it
          && Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) < 0 // and it is not a HsyRoom
        ) {
          return true; // yes, ignore message to unrelated room.
        } else if (message.from().type() !== ContactType.Personal) {
          return true; // yes, ignore message from not personal contacts
        }
        else return false;
      },
      async (message):Promise<void> => {
        // ignoring it, does nothing, oh, maybe simply logging?
        return;
      }));

    this.chatRouter.register(new ChatRoute(
      'AdminBlacklist',
      async (message:Message):Promise<boolean> =>
          /^加黑 /.test(sify(message.text()))
          && message.to().id === this.wechaty.userSelf().id // talk directly to myself
          && await this.isAdmin(message.from().id) // talk is an admin
      ,
      async (message:Message, context) => {
        // TODO impl
      }));

    this.chatRouter.register(new ChatRoute(
      'AdminKick',
      async (message:Message):Promise<boolean> =>
        /^踢 /.test(sify(message.text()))
        && message.to().id === this.wechaty.userSelf().id // talk directly to myself
        && await this.isAdmin(message.from().id) // talk is an admin,
      ,
      async (message:Message, context) => {
        // TODO impl
      }));

    this.chatRouter.register(new ChatRoute(
      'AdminAnnounce',
      async (message:Message):Promise<boolean> =>
        /^公告 /.test(sify(message.text()))
        && message.to().id === this.wechaty.userSelf().id // talk directly to myself
        && await this.isAdmin(message.from().id) // talk is an admin,
      ,
      async (message:Message, context) => {
        // TODO impl
      }));

    this.chatRouter.register(new ChatRoute(
      'JoinHsyRoom',
      async (message:Message) => {
        return /^(南湾西|南湾东|中半岛|旧金山|东湾|短租|西雅图|测试)$/.test(sify(message.text()));
      },
      async (message:Message, context) => {
        for (let roomId of Object.keys(hsyRoomsIdToNameMap)) {
          if (new RegExp(`${roomId}`).compile().test(sify(message.text()))) {
            let roomId = hsyRoomsNameToIdMap[sify(message.text())];

            await this.limiter.schedule(async () => {
              let room:Room = this.wechaty.Room.load(roomId);
              await room.sync();
              // TODO add maybe downsize room
              await room.add(message.from());
            });
            return ;
          }
        }
      }));

    this.chatRouter.register(new ChatRoute(
      'SeekInstructions',
      async (message:Message) => {
        return /租|加|求|租|加|求|請問|请问|好室友|hi|hello|您好|你好|喂/.test(sify(message.text()));
    },
      async (message:Message, context) => {
        await this.limiter.schedule(async () => {

          await message.from().say(`
          请问你要加哪个区域的群？
            【南湾西】包含 Palo Alto，Stanford, Mountain View，Sunnyvale，Cupertino 一带
            【南湾东】包含 San Jose，Santa Clara，Milpitas一带
            【东湾】湾东边 Milpitas以北，包括Fremont，Hayward，Berkeley等
            【中半岛】Redwood以北，San Francisco以南
            【三番】旧金山 (San Francisco) 城里，含South San Francisco
            【西雅图】我们新开设了西雅图好室友群，服务大西雅图地区
            【短租】如果你希望在旧金山湾区任意地方内进行3个月以内短租（出租和求租），请加短租群
          请回复要加哪个群，例如： 南湾西
          `);
        });
    }));
  }

  public async stop(): Promise<void> {
    return this.wechaty.stop();
  }

  public async start(): Promise<void> {
    return this.wechaty
      .on('scan', (qrcode: string, status) => {
        this.qrcode = qrcode;
        require('qrcode-terminal').generate(qrcode, {small: true});
        logger.debug(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
      })
      .on('login', (user: ContactSelf) => {
        logger.debug(`User ${user} logged in`)
      })
      .on('logout', (user: ContactSelf) => {
        logger.debug(`User ${user} logged out`)
      })
      .on('message', async (message: Message) => {
        logger.debug(`Route and handling message: ${message}`);
        let routeName = await this.chatRouter.process(message);
        logger.debug(`handled message ${message} with routeName ${routeName}`);
      })
      .on('room-join', (room: Room, inviteeList: Contact[], inviter: Contact) => {
        // TODO record who invites who and shows the message of bonus
      })
      .start();
  }

  /**
   * Check if user is admin, query both local hard-coded and storage
   * @param id
   */
  public async isAdmin(contactId:string):Promise<boolean> {

    if (HARDCODED_ADMINS.indexOf(contactId) >= 0) return true;
    let contactMetas = await this.mongodb.collection(`ContactMeta`)
      .find({_id: contactId}).toArray();
    console.assert(contactMetas.length == 0 || contactMetas.length == 1,
      `Should return ind 0 or 1 contact`);
    return (contactMetas.length == 1 && contactMetas[0][`isAdmin`]);
  }

  /**
   * Check if user is whitelisted, query both local hard-coded and storage
   * @param id
   */
  public async isWhitelistedNonAdmin(contactId:string):Promise<boolean> {
    if (HARDCODED_WHITELIST.indexOf(contactId) >= 0) return true;
    let contactMetas = await this.mongodb.collection(`ContactMeta`)
      .find({_id: contactId}).toArray();
    console.assert(contactMetas.length == 0 || contactMetas.length == 1,
      `Should return ind 0 or 1 contact`);
    return (contactMetas.length == 1 && contactMetas[0][`isWhitelisted`]);
  }

  /**
   * Check if user is blacklisted, query both local hard-coded and storage
   * @param id
   */
  public async isBlacklisted(contactId:string):Promise<boolean> {
    let contactMetas = await this.mongodb.collection(`ContactMeta`)
      .find({_id: contactId}).toArray();
    console.assert(contactMetas.length == 0 || contactMetas.length == 1,
      `Should return ind 0 or 1 contact`);
    return (contactMetas.length == 1 && contactMetas[0][`isBlacklisted`]);
  }

  public static isGoodNickname(nickname:string):boolean {
    return /^(招|求|介|管)-/.test(nickname);
  }

  public async getRelatedUsers(id:string, degreeOfExtension:number = 0):Promise<Array<string>> {
    // TODO impl
    return [];
  }

  public async saveKickFromRoom(room:Room, contact:Contact) {
    if ((await this.isAdmin(contact.id)) || (await this.isWhitelistedNonAdmin(contact.id))) {
      await this.limiter.schedule(async () => {
        await room.del(contact);
      });
    } else {
      logger.warn(`trying to safe kick a contact ${contact} from room ${room}, but ignored`);
    }
  }

}


