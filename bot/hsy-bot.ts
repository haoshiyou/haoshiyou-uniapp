import {Contact, Message, Room, Wechaty} from 'wechaty';
import {ContactSelf} from "wechaty/dist/src/user";
import {ChatRoute, ChatRouter} from "./chat-router";
import {sify} from 'chinese-conv';
import Bottleneck from "bottleneck";
import {ContactType} from "wechaty-puppet";

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

/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
export class HsyBot {

  private wechaty:Wechaty;
  private qrcode: string;
  private chatRouter:ChatRouter;
  private limiter = new Bottleneck({
    minTime: 1500
  });

  constructor(wechaty:Wechaty) {
    this.wechaty = wechaty;
    this.chatRouter = new ChatRouter();
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
        logger.debug(`handled with name ${routeName}`);
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
  public async isAdmin(id:string):Promise<boolean> {

    // TODO impl
    return false;
  }

  /**
   * Check if user is whitelisted, query both local hard-coded and storage
   * @param id
   */
  public async isWhitelisted(id:string):Promise<boolean> {
    // TODO impl
    return false;
  }

  /**
   * Check if user is blacklisted, query both local hard-coded and storage
   * @param id
   */
  public async isBlacklisted(id:string):Promise<boolean> {
    // TODO impl
    return false;
  }

  public static isGoodNickname(nickname:string):boolean {
    // TODO impl
    return false;
  }

  public async getRelatedUsers(id:string, degreeOfExtension:number = 0):Promise<Array<string>> {
    // TODO impl
    return [];
  }

}


