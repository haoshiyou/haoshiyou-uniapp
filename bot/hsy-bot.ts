import {Contact, Message, Room, Wechaty} from 'wechaty';
import {PuppetPadpro} from 'wechaty-puppet-padpro';
import {ContactSelf} from "wechaty/dist/src/user";
import {ChatRoute, ChatRouter} from "./chat-router";
import {sify} from 'chinese-conv';

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
  constructor(wechaty:Wechaty) {
    this.wechaty = wechaty;
    this.chatRouter = new ChatRouter();
    this.chatRouter.register(new ChatRoute(
      'Ignore',
      (message:Message) => {
        if (message.from().id === this.wechaty.id) {
          return true;
        } else if (message.room() // it's a room TODO test it
          && Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) < 0 // and it is not a HsyRoom
        ) {
          return true;
        } else return false;
      },
      async (message):Promise<void> => {
        // ignore it
        return;
      }));

    this.chatRouter.register(new ChatRoute(
      'JoinHsyRoom',
      function(message:Message) {
        return /^(南湾西|南湾东|中半岛|旧金山|东湾|短租|西雅图|测试)$/.test(sify(message.text()));
      },
      async (message:Message, context) => {
        let roomId = hsyRoomsNameToIdMap[sify(message.text())];
        let room:Room = this.wechaty.Room.load(roomId);
        await room.sync();
        // TODO maybe downsize room
        await room.add(message.from());
      }));

    this.chatRouter.register(new ChatRoute(
      'SeekInstructions',
      function(message:Message) {
        return /你好|hi|请问/.test(sify(message.text()));
    },
      async function(message:Message, context) {
        await message.from().say(`请问你要加哪个群?`); // TODO 加上具体的几个群的名称
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
        console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
      })
      .on('login', (user: ContactSelf) => {
        console.log(`User ${user} logged in`)
      })
      .on('logout', (user: ContactSelf) => {
        console.log(`User ${user} logged out`)
      })
      .on('message', (message: Message) => {
        console.log(`Message: ${message}`);
      })
      .on('room-join', (room: Room, inviteeList: Contact[], inviter: Contact) => {
        // TODO record who invites who and shows the message of bonus

      })
      .start();
  }
}


