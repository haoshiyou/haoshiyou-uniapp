import {Contact, Friendship, Message, Room, Wechaty} from 'wechaty';
import {FileBox} from "file-box";
import {ContactSelf} from "wechaty/dist/src/user";
import {ChatRoute, ChatRouter} from "./chat-router";
import {sify} from 'chinese-conv';
import Bottleneck from "bottleneck";
import {ContactType, MessageType} from "wechaty-puppet";
import {Db} from "mongodb";

const cloudinary = require('cloudinary');
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

const greetingMsg = `请问你要加哪个区域的群？
  【南湾西】包含 Palo Alto，Stanford, Mountain View，Sunnyvale，Cupertino 一带
  【南湾东】包含 San Jose，Santa Clara，Milpitas一带
  【东湾】湾东边 Milpitas以北，包括Fremont，Hayward，Berkeley等
  【中半岛】Redwood以北，San Francisco以南
  【三番】旧金山 (San Francisco) 城里，含South San Francisco
  【西雅图】我们新开设了西雅图好室友群，服务大西雅图地区
  【短租】如果你希望在旧金山湾区任意地方内进行3个月以内短租（出租和求租），请加短租群
请回复要加哪个群，例如： 南湾西
 
另外 回复
  【爬山】加入群主的靠谱爬山群，不定期组织湾区附近的爬山活动，认识新朋友
  【买房】了解硅谷买房信息、加入购房群参与讨论，我们的社区老友也将为你提供服务
`;

const hikingRoomId = "6137295298@chatroom";
const buyHouseRoomId = "5975139041@chatroom";

const messageBrokerIsabella = `
各位群友大家好，感谢 我们好室友的老群友、老朋友 Isabella 对好室友项目组的支持。她现在是购房中介(Realtor)，群里也有不少朋友用过 Isabella 的服务，评价很好。
好室友推荐的Real Estate Agent
Isabella Sun (孙静茹)  
Isabella是一名硅谷资深房地产经纪人, 全美top 1% 地产经纪。她居住美国10余年，2013年宾夕法尼亚大学取得硕士学位后来到湾区，目前就职于Coldwell Banker (科威房地产公司，美国最大的地产公司之一)，在Coldwell Banker北加州四五千个agent中，个人排名前25名。Zillow全5星好评（专业房产网站实名成交好评），并且好室友中也有不少人找Isabella买卖过房子，全部5星好评。
联系方式：
Isabella Sun
Mobile: 650.933.8799
Email: isabella.sun@cbnorcal.com
WeChat: IsabellaSun_USA 
`;

const messageBrokerIsabellaRefer = `
本群有若干群友对Isabella的评价节选如下
J群友：
“...She is very patient with first-time home buyers like me, and knowledgable enough to answer all kinds of questions from me. Also, she gave me a lot of very useful advice on our home purchase, including design and pricing. Moreover, she was very responsive  whenever I asked her for help. Last but not least, she is really good at negotiation. She helped us get a huge discount from the seller prior to closing. Highly recommend! ” 
Y群友：
“...Isabella is very patient and quick in response throughout the process, from open house visits to closing. We are very impressed by her insights into the market and negotiation skills...” 
L群友：
“...She is professional, responsive, and very knowledgeable.  This was not our first home purchase, but even so, we found her guidance and insight to be tremendously valuable.  She also did an amazing job with negotiations --  being proactive, keeping us up to date, and  helping us purchase the home at a fantastic price... ”
Z群友：
“...Isabella is very responsible and responsive throughout the entire process. She is also knowledgeable about all aspects of purchasing a home. Appreciate  her help and highly recommend her...”
Y群友：
“...She was willing to spend large amount of time helping me explore different options. With her expertise and diligence, I was able to find the home best suits my needs...”`;

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
        if (message.from().self()) {
          return true; // yes ignore message from myselfs
        } else if (message.room() // it's a room TOTEST
          && Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) < 0 // and it is not a HsyRoom
        ) {
          return true; // yes, ignore message to unrelated room.
        } else if (message.from().type() !== ContactType.Personal) {
          return true; // yes, ignore message from not personal contacts
        } else if (message.type() !== MessageType.Text && message.type() !== MessageType.Image) {
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
          && (Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) >= 0)  // kick within the room
          && await this.isAdmin(message.from().id) // talk is an admin
      ,
      async (message:Message, context) => {
        // TOTEST
        let mentions:Contact[] = await message.mention(); // we only handle 1 blacklist at a time

        if (mentions.length === 1) {
          let degreeOfExtension = 1;
          let now = new Date();
          let directCauseContact = mentions[0];
          // TOTEST
          await this.mongodb.collection(`CollectionMeta`).findOneAndUpdate(
            {_id: directCauseContact.id},
            {$push: {
                blacklistedRecords:
                  {
                    adminId: message.from().id,
                    timestamp: now,
                    direct: true, // true for direct blacklist, false for indirect blacklist (caused by related user being blacklisted)
                  }
              }
            },
            {upsert:true});

          let related = await this.getRelatedContactSet(directCauseContact.id, degreeOfExtension);

          // TOTEST
          related.forEach(async (contactId:string) => {
            await this.mongodb.collection(`CollectionMeta`).findOneAndUpdate(
              {_id: contactId},
              {$push: {
                  blacklistedRecords:
                    {
                      adminId: message.from().id,
                      timestamp: now,
                      direct: false, // true for direct blacklist, false for indirect blacklist (caused by related user being blacklisted)
                      causeContactId: directCauseContact.id,
                      degreeOfExtension: degreeOfExtension
                    }
                }
              },
              {upsert:true});
            await this.safeKickFromAllHsyRooms(contactId);
          });
        } else {
          // TOTEST
          await message.from().say(`请一次仅仅对一个黑名单进行操作`);
        }
      }));

    this.chatRouter.register(new ChatRoute(
      'AdminKick',
      async (message:Message):Promise<boolean> =>
        /^踢 /.test(sify(message.text()))
        && (Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) >= 0)  // kick within the room
        && await this.isAdmin(message.from().id) // talk is an admin,
      ,
      async (message:Message, context) => {
        // TOTEST
        let mentions = await message.mention();
        mentions.forEach(async (contact:Contact) => {
          await this.safeKickFromAllHsyRooms(contact.id);
        });

      }));

    this.chatRouter.register(new ChatRoute(
      'AdminAnnounce',
      async (message:Message):Promise<boolean> =>
        /^公告 /.test(sify(message.text()))
        && message.to().self()  // talk directly to myself
        && await this.isAdmin(message.from().id) // talk is an admin,
      ,
      async (message:Message, context) => {
        let content = message.text().slice(3); // anything after "公告 "
        // TOTEST
        await Promise.all(Object.keys(hsyRoomsIdToNameMap).map(async (roomId) => {
          let room:Room = this.wechaty.Room.load(roomId);
          await room.sync();
          await this.limiter.schedule(async () => {
            await room.say(content);
          });
        }));
      }));

    this.chatRouter.register(new ChatRoute(
      'JoinHsyRoom',
      async (message:Message) => {
        return message.to().self() &&  // only messsage to me
          /(南湾西|南湾东|中半岛|三藩|三番|旧金山|东湾|短租|西雅图|测试)/.test(sify(message.text()));
      },
      async (message:Message, context) => {
        for (let roomId of Object.keys(hsyRoomsIdToNameMap)) {
          if (new RegExp(`${roomId}`).compile().test(sify(message.text()))) {
            let roomId = hsyRoomsNameToIdMap[sify(message.text())];

            await this.limiter.schedule(async () => {
              let room:Room = this.wechaty.Room.load(roomId);
              await room.sync();
              await this.maybeDownsize(room);
              await room.add(message.from());
            });
            return ;
          }
        }
      }));

    this.chatRouter.register(new ChatRoute(
      'JoinHiking',
      async (message:Message) => {
        return message.to().self() && /爬山/.test(sify(message.text()));
      },
      async (message:Message, context) => {
        await this.limiter.schedule(async () => {
          await message.from().say(`欢迎加入群主组织的另一个社区：靠谱™ 爬山群，群主载南和群里的各靠谱队长将不定期组织爬山活动`);        await message.from().say(`欢迎加入`);
        });
        let room = this.wechaty.Room.load(hikingRoomId);
        await room.sync();
        await this.limiter.schedule(async () => {
          await room.add(message.from());
        });
      }));

    this.chatRouter.register(new ChatRoute(
      'BuyHouse',
      async (message:Message) => {
        return message.to().self() && /买房|购房/.test(sify(message.text()));
      },
      async (message:Message, context) => {
        await this.limiter.schedule(async () => {
          await message.from().say(messageBrokerIsabella);
          await message.from().say(messageBrokerIsabellaRefer);
        });
        let room = this.wechaty.Room.load(buyHouseRoomId);
        await room.sync();

        await this.limiter.schedule(async () => {
          await room.add(message.from());
          await message.from().say(`欢迎加入我们好室友™买房群的讨论`);
        });
      }));

    this.chatRouter.register(new ChatRoute(
      'SeekInstructions',
      async (message:Message) =>
        message.to().self() &&
        /租|加|求|租|加|求|請問|请问|好室友|hi|hello|您好|你好|喂/.test(sify(message.text())) &&
        message.text().length < 8
    ,
      async (message:Message, context) => {
        await this.limiter.schedule(async () => {
          await message.from().say(greetingMsg);
        });
    }));
    this.chatRouter.register(new ChatRoute(
      'PostListing',
      async (message:Message) =>
        message.room() &&
        Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) >= 0 && // must be in a HSY room
        message.type() === MessageType.Text,
      async (message:Message, context) => {
        let filebox = await message.toFileBox();
        let imageId = await this.uploadImage(filebox);

        // TOTEST
        await this.mongodb.collection(`HsyListing`).findOneAndUpdate(
          {_id: `wxId:${message.from().id}`},
          {
            $push: {
              imageIds: imageId,
            },
            $set: {
              updated: new Date(), // TOTEST
            },
            $setOnInsert: {
              status: "active", // TOTEST
            }
          },
          {upsert:true});
      }));
    this.chatRouter.register(new ChatRoute(
      'PostImage',
      async (message:Message) =>
        message.room() &&
        Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) >= 0 && // must be in a HSY room
        message.type() === MessageType.Image,
      async (message:Message, context) => {
        let filebox = await message.toFileBox();
        let imageId = await this.uploadImage(filebox);

        // TOTEST
        await this.mongodb.collection(`HsyListing`).findOneAndUpdate(
          {_id: `wxId:${message.from().id}`},
          {
            $push: {
              imageIds: imageId,
            },
            $set: {
              updated: new Date(), // TOTEST
            },
            $setOnInsert: {
              status: "active", // TOTEST
            }
          },
          {upsert:true});
      }));

    this.chatRouter.register(new ChatRoute(
      'PostImage',
      async (message:Message) =>
        message.room() &&
        Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) >= 0 && // must be in a HSY room
        message.type() === MessageType.Image,
      async (message:Message, context) => {
        let filebox = await message.toFileBox();
        let imageId = await this.uploadImage(filebox);

        // TOTEST
        await this.mongodb.collection(`HsyListing`).findOneAndUpdate(
          {_id: `wxId:${message.from().id}`},
          {
            $push: {
              imageIds: imageId,
            },
            $set: {
              updated: new Date(), // TOTEST
            },
            $setOnInsert: {
              status: "active", // TOTEST
            }
          },
          {upsert:true});
      }));
  }

  public async getHsyRooms():Promise<Room[]> {
    // TOTEST
    let allRoomIds = Object.keys(hsyRoomsIdToNameMap);
    return Promise.all(allRoomIds.map(async roomId => {
      let room:Room = this.wechaty.Room.load(roomId);
      await room.sync();
      return room;
    }));

  }
  public async safeKickFromAllHsyRooms(contactId:string) {
    // TOTEST
    let contact:Contact = this.wechaty.Contact.load(contactId);
    await contact.sync();
    let allHsyRooms:Room[] = await this.getHsyRooms();
    await Promise.all(allHsyRooms.map(async (room) => {
      await this.saveKickFromRoom(room, contact);
    }));
  };

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
        logger.debug(`handled message ${JSON.stringify(message, null, 2)} with routeName ${routeName}`);
      })
      .on('friendship', async (friendship: Friendship) => {
        logger.debug(`Received friendship ${friendship}`);
        if (await this.isBlacklisted(friendship.contact().id)) {
          logger.warn(`Ignoring friendship from contact ${friendship.contact()}`);
        } else {
          await friendship.accept();
          logger.debug(`Accepted friendship ${friendship}`);
          await this.limiter.schedule(async () => {
            await friendship.contact().say(greetingMsg);
          });

          // TOTEST
          await this.mongodb.collection(`ContactMeta`).findOneAndUpdate(
            {
              _id: friendship.contact().id},
            {
              $push: {
                friendship: {
                  type: `friend`,
                  timestamp: new Date(0)
                }
              }
            },
            {upsert: true});
        }
      })
      .on('room-join', async (room: Room, inviteeList: Contact[], inviter: Contact) => {
        // TOTEST record who invites who and shows the message of bonus
        if (Object.keys(hsyRoomsIdToNameMap).indexOf(room.id) >= 0 /* belongs to Hsy*/) {
          logger.info(`Recording room-join for ${room}, inviteeList = ${inviteeList}, inviter = ${inviter}`);
          let now = new Date();
          let promises = [];
          for (let invitee of inviteeList) {
            promises.push(await this.mongodb.collection(`ContactMeta`).findOneAndUpdate(
              {_id: inviter.id},
              {
                $push: {
                  invited: {
                    inviteeId: invitee.id,
                    timestamp: now,
                    roomId: room.id
                  }
                }
              },
              {upsert: true}));
            promises.push(await this.mongodb.collection(`ContactMeta`).findOneAndUpdate(
              {_id: invitee.id},
              {
                $push: {
                  invitedBy: {
                    inviterId: inviter.id,
                    timestamp: now,
                    roomId: room.id
                  }
                }
              },
              {upsert: true}));
            // invited: [{
            //   inviteeId: "string",
            //   timestamp: "datetime",
            //   roomId: "string"
            // }],
            //   invitedBy: [{
            //   inviterId: "string",
            //   timestamp: "datetime",
            //   roomId: "string"
            // }],
          }
          await Promise.all(promises);
          await this.limiter.schedule(async () => {
            await room.say(
              `欢迎${inviteeList.map((c:Contact) => c.name()).join(', ')}的加入，感谢${inviter.name()}的邀请，你们各自获得了100点的好室友点数。至于点数能做什么，敬请期待(重复邀请不重复发放)`);
          });
        } else {
          logger.debug(`Ignoring room-join for ${room}, inviteeList = ${inviteeList}, inviter = ${inviter}`);
        }
      })
      .start();
  }

  /**
   * Check if user is admin, only hardcoded
   * @param contactId
   */
  private isAdmin(contactId:string):boolean {
    return HARDCODED_ADMINS.indexOf(contactId) >= 0;
  }

  /**
   * Check if user is whitelisted, only hardcoded
   * @param contactId
   */
  private isWhitelistedNonAdmin(contactId:string):boolean {
    return HARDCODED_WHITELIST.indexOf(contactId) >= 0;
  }

  /**
   * Check if user is blacklisted, query both local hard-coded and storage
   * @param id
   */
  private async isBlacklisted(contactId:string):Promise<boolean> {
    // TOTEST
    let contactMetas = await this.mongodb.collection(`ContactMeta`)
      .find({_id: contactId}).toArray();
    console.assert(contactMetas.length == 0 || contactMetas.length == 1,
      `Should return ind 0 or 1 contact`);
    return (contactMetas.length == 1 && contactMetas[0][`isBlacklisted`]);
  }

  private isGoodNickname(nickname:string):boolean {
    return /^(招|求|介|管)-/.test(nickname);
  }

  /**
   * Given a doc of ContactMeta, get all 1 degree related contact ids.
   */
  private getRelatedContactsBySingleContactMeta(meta:any):Set<string> {
    // TOTEST
    let contactIds = [];
    if (meta.invitedBy) {
      contactIds = contactIds.concat(meta.invitedBy.map(info => info.inviterId));
    }
    if (meta.invited) {
      contactIds = contactIds.concat(meta.invited.map(info => info.inviteeId));
    }
    return new Set(contactIds);
  }
  private async getRelatedContactSet(contactId:string, degreeOfExtension:number = 0):Promise<Set<string>> {
    // TOTEST
    let relatedSet:Set<string> = new Set([contactId]);
    if (degreeOfExtension == 0) return relatedSet;

    // Calculating locally, I know, it's very hacky. Given our users will be 10K ~ 50K in the near future, it's fine.

    let allContacts = await this.mongodb.collection(`ContactMeta`).find().toArray();
    let remainingDegree = degreeOfExtension;
    while (remainingDegree > 0) {
      logger.debug(`Expand another degree ${degreeOfExtension-remainingDegree}`);

      // TOTEST
      let newContactSet = new Set(allContacts
        .filter(meta => relatedSet.has(meta._id))
        .flatMap(meta => Array.from(this.getRelatedContactsBySingleContactMeta(meta)))
        .filter(_contactId => !relatedSet.has(_contactId)));
      relatedSet = new Set([...relatedSet, ...newContactSet]);
      remainingDegree--;
    }
  }

  private async saveKickFromRoom(room:Room, contact:Contact) {
    if (contact.self() || this.isAdmin(contact.id) || this.isWhitelistedNonAdmin(contact.id)) {
      logger.warn(`trying to safe kick a contact ${contact} from room ${room}, but ignored`);
    } else {
      await this.limiter.schedule(async () => {
        await room.del(contact);
      });
    }
  }

  private async maybeDownsize(room:Room):Promise<boolean> {
    const DOWNSIZE_THRESHOLD = 475;
    let members:Contact[] = await room.memberAll();
    if (members.length >= DOWNSIZE_THRESHOLD) {
      let allCandidates:Contact[] = members.slice(0, members.length - 50)
        .filter(async (c:Contact) => (this.isAdmin(c.id) || this.isWhitelistedNonAdmin(c.id))); // we protect the latested 50 candidates
      let badNickUsers:Contact[] = allCandidates.filter(async (c:Contact) => (!this.isGoodNickname(await room.alias(c)))).slice(0, 25);
      let oldUsers:Contact[] = allCandidates.filter(c => badNickUsers.indexOf(c) <0).slice(0, 50 - badNickUsers.length);
      await this.limiter.schedule(async () => {
        await room.say(`不好意思群满了，我们清理一下给新的朋友腾位置。优先清理没有按照格式(例如:"招-mtv-5.1-王小明")修改取昵称的朋友。有需求可以重新加机器人入群`);
      });
      badNickUsers.forEach(async (contact:Contact) => await this.saveKickFromRoom(room, contact));
      oldUsers.forEach(async (contact:Contact) => await this.saveKickFromRoom(room, contact));

      await this.limiter.schedule(async () => {
        await room.say(`清理完毕`);
      });
      return true;
    }
    return false;
  }

  /**
   *
   * @param filebox
   * @returns string of public Id from Cloudinary Image
   */
  public async uploadImage(filebox:FileBox):Promise<string> {
    // TOTEST
    let filename = `/tmp/file`;
    await filebox.toFile(filename);
    let res = await cloudinary.v2.uploader.upload(filename, {
      transformation: [
        {quality:`auto:eco`, crop:`limit`, width: `1080`, height: `4000`}
      ],
      format: 'jpg'
    });
    return res.publicId;
  }

}


