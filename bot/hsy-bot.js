"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chat_router_1 = require("./chat-router");
var chinese_conv_1 = require("chinese-conv");
var bottleneck_1 = require("bottleneck");
var wechaty_puppet_1 = require("wechaty-puppet");
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
var hsyRoomsNameToIdMap = {
    测试: "7046190982@chatroom",
    西雅图: "28795198@chatroom",
    短租: "384195587@chatroom",
    东湾: "348466485@chatroom",
    三番: "1136072@chatroom",
    南湾西: "544705980@chatroom",
    南湾东: "106702284@chatroom",
    中半岛: "314160598@chatroom",
};
var hsyRoomsIdToNameMap = {
    "7046190982@chatroom": "测试",
    "28795198@chatroom": "西雅图",
    "384195587@chatroom": "短租",
    "348466485@chatroom": "东湾",
    "1136072@chatroom": "三番",
    "544705980@chatroom": "南湾西",
    "106702284@chatroom": "南湾东",
    "314160598@chatroom": "中半岛",
};
var greetingMsg = "\u8BF7\u95EE\u4F60\u8981\u52A0\u54EA\u4E2A\u533A\u57DF\u7684\u7FA4\uFF1F\n  \u3010\u5357\u6E7E\u897F\u3011\u5305\u542B Palo Alto\uFF0CStanford, Mountain View\uFF0CSunnyvale\uFF0CCupertino \u4E00\u5E26\n  \u3010\u5357\u6E7E\u4E1C\u3011\u5305\u542B San Jose\uFF0CSanta Clara\uFF0CMilpitas\u4E00\u5E26\n  \u3010\u4E1C\u6E7E\u3011\u6E7E\u4E1C\u8FB9 Milpitas\u4EE5\u5317\uFF0C\u5305\u62ECFremont\uFF0CHayward\uFF0CBerkeley\u7B49\n  \u3010\u4E2D\u534A\u5C9B\u3011Redwood\u4EE5\u5317\uFF0CSan Francisco\u4EE5\u5357\n  \u3010\u4E09\u756A\u3011\u65E7\u91D1\u5C71 (San Francisco) \u57CE\u91CC\uFF0C\u542BSouth San Francisco\n  \u3010\u897F\u96C5\u56FE\u3011\u6211\u4EEC\u65B0\u5F00\u8BBE\u4E86\u897F\u96C5\u56FE\u597D\u5BA4\u53CB\u7FA4\uFF0C\u670D\u52A1\u5927\u897F\u96C5\u56FE\u5730\u533A\n  \u3010\u77ED\u79DF\u3011\u5982\u679C\u4F60\u5E0C\u671B\u5728\u65E7\u91D1\u5C71\u6E7E\u533A\u4EFB\u610F\u5730\u65B9\u5185\u8FDB\u884C3\u4E2A\u6708\u4EE5\u5185\u77ED\u79DF\uFF08\u51FA\u79DF\u548C\u6C42\u79DF\uFF09\uFF0C\u8BF7\u52A0\u77ED\u79DF\u7FA4\n\u8BF7\u56DE\u590D\u8981\u52A0\u54EA\u4E2A\u7FA4\uFF0C\u4F8B\u5982\uFF1A \u5357\u6E7E\u897F\n \n\u53E6\u5916 \u56DE\u590D\n  \u3010\u722C\u5C71\u3011\u52A0\u5165\u7FA4\u4E3B\u7684\u9760\u8C31\u722C\u5C71\u7FA4\uFF0C\u4E0D\u5B9A\u671F\u7EC4\u7EC7\u6E7E\u533A\u9644\u8FD1\u7684\u722C\u5C71\u6D3B\u52A8\uFF0C\u8BA4\u8BC6\u65B0\u670B\u53CB\n  \u3010\u4E70\u623F\u3011\u4E86\u89E3\u7845\u8C37\u4E70\u623F\u4FE1\u606F\u3001\u52A0\u5165\u8D2D\u623F\u7FA4\u53C2\u4E0E\u8BA8\u8BBA\uFF0C\u6211\u4EEC\u7684\u793E\u533A\u8001\u53CB\u4E5F\u5C06\u4E3A\u4F60\u63D0\u4F9B\u670D\u52A1\n";
var hikingRoomId = ""; // TODO add hikningRoomId
var buyHouseRoomId = ""; //TODO add buyHouseRoomId
var messageBrokerIsabella = "\n\u5404\u4F4D\u7FA4\u53CB\u5927\u5BB6\u597D\uFF0C\u611F\u8C22 \u6211\u4EEC\u597D\u5BA4\u53CB\u7684\u8001\u7FA4\u53CB\u3001\u8001\u670B\u53CB Isabella \u5BF9\u597D\u5BA4\u53CB\u9879\u76EE\u7EC4\u7684\u652F\u6301\u3002\u5979\u73B0\u5728\u662F\u8D2D\u623F\u4E2D\u4ECB(Realtor)\uFF0C\u7FA4\u91CC\u4E5F\u6709\u4E0D\u5C11\u670B\u53CB\u7528\u8FC7 Isabella \u7684\u670D\u52A1\uFF0C\u8BC4\u4EF7\u5F88\u597D\u3002\n\u597D\u5BA4\u53CB\u63A8\u8350\u7684Real Estate Agent\nIsabella Sun (\u5B59\u9759\u8339)  \nIsabella\u662F\u4E00\u540D\u7845\u8C37\u8D44\u6DF1\u623F\u5730\u4EA7\u7ECF\u7EAA\u4EBA, \u5168\u7F8Etop 1% \u5730\u4EA7\u7ECF\u7EAA\u3002\u5979\u5C45\u4F4F\u7F8E\u56FD10\u4F59\u5E74\uFF0C2013\u5E74\u5BBE\u5915\u6CD5\u5C3C\u4E9A\u5927\u5B66\u53D6\u5F97\u7855\u58EB\u5B66\u4F4D\u540E\u6765\u5230\u6E7E\u533A\uFF0C\u76EE\u524D\u5C31\u804C\u4E8EColdwell Banker (\u79D1\u5A01\u623F\u5730\u4EA7\u516C\u53F8\uFF0C\u7F8E\u56FD\u6700\u5927\u7684\u5730\u4EA7\u516C\u53F8\u4E4B\u4E00)\uFF0C\u5728Coldwell Banker\u5317\u52A0\u5DDE\u56DB\u4E94\u5343\u4E2Aagent\u4E2D\uFF0C\u4E2A\u4EBA\u6392\u540D\u524D25\u540D\u3002Zillow\u51685\u661F\u597D\u8BC4\uFF08\u4E13\u4E1A\u623F\u4EA7\u7F51\u7AD9\u5B9E\u540D\u6210\u4EA4\u597D\u8BC4\uFF09\uFF0C\u5E76\u4E14\u597D\u5BA4\u53CB\u4E2D\u4E5F\u6709\u4E0D\u5C11\u4EBA\u627EIsabella\u4E70\u5356\u8FC7\u623F\u5B50\uFF0C\u5168\u90E85\u661F\u597D\u8BC4\u3002\n\u8054\u7CFB\u65B9\u5F0F\uFF1A\nIsabella Sun\nMobile: 650.933.8799\nEmail: isabella.sun@cbnorcal.com\nWeChat: IsabellaSun_USA \n";
var messageBrokerIsabellaRefer = "\n\u672C\u7FA4\u6709\u82E5\u5E72\u7FA4\u53CB\u5BF9Isabella\u7684\u8BC4\u4EF7\u8282\u9009\u5982\u4E0B\nJ\u7FA4\u53CB\uFF1A\n\u201C...She is very patient with first-time home buyers like me, and knowledgable enough to answer all kinds of questions from me. Also, she gave me a lot of very useful advice on our home purchase, including design and pricing. Moreover, she was very responsive  whenever I asked her for help. Last but not least, she is really good at negotiation. She helped us get a huge discount from the seller prior to closing. Highly recommend! \u201D \nY\u7FA4\u53CB\uFF1A\n\u201C...Isabella is very patient and quick in response throughout the process, from open house visits to closing. We are very impressed by her insights into the market and negotiation skills...\u201D \nL\u7FA4\u53CB\uFF1A\n\u201C...She is professional, responsive, and very knowledgeable.  This was not our first home purchase, but even so, we found her guidance and insight to be tremendously valuable.  She also did an amazing job with negotiations --  being proactive, keeping us up to date, and  helping us purchase the home at a fantastic price... \u201D\nZ\u7FA4\u53CB\uFF1A\n\u201C...Isabella is very responsible and responsive throughout the entire process. She is also knowledgeable about all aspects of purchasing a home. Appreciate  her help and highly recommend her...\u201D\nY\u7FA4\u53CB\uFF1A\n\u201C...She was willing to spend large amount of time helping me explore different options. With her expertise and diligence, I was able to find the home best suits my needs...\u201D";
var HARDCODED_ADMINS = [
    // from 大军团
    "haoshiyou-bot",
    "haoshiyou-admin",
    "haoshiyou-bot2",
    "xinbenlv",
    "xiaowusheng",
    "wxid_wl56wlfbwn512",
    "wxid_5ma39vrqixyn11",
    "wxid_g7tm5wadh8ug11",
    "wxid_2psmr08jb8yu22",
    "wxid_i5nvum6hqzt312",
    "shohoku11wrj",
    "chenleidan",
    "wxid_pq2et5qivaut11",
    "amy-mido",
    "lijiaqi",
    "adamzhu1986",
    "wxid_9i3qe4iaistq22",
    "wxid_mp4e78qq2fl222",
    "wxid_mqu5m5dvx9i822",
    "a38372624",
    "angela0622sx",
    "wxid_zvjlfty9zs7f11",
];
var HARDCODED_WHITELIST = [
    // from 测试群
    "xiaowusheng",
    "shohoku11wrj",
    "wxid_2psmr08jb8yu22",
    "wxid_5ma39vrqixyn11",
    "wxid_9i3qe4iaistq22",
    "wxid_mp4e78qq2fl222",
    "xinbenlv",
    "wxid_mqu5m5dvx9i822",
];
/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
var HsyBot = /** @class */ (function () {
    function HsyBot(wechaty, mongodb) {
        var _this = this;
        this.limiter = new bottleneck_1.default({
            minTime: 1500
        });
        this.wechaty = wechaty;
        this.chatRouter = new chat_router_1.ChatRouter();
        this.mongodb = mongodb;
        this.chatRouter.register(new chat_router_1.ChatRoute('Ignore', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (message.from().id === this.wechaty.id) {
                    return [2 /*return*/, true]; // yes ignore message from myselfs
                }
                else if (message.room() // it's a room TODO test it
                    && Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) < 0 // and it is not a HsyRoom
                ) {
                    return [2 /*return*/, true]; // yes, ignore message to unrelated room.
                }
                else if (message.from().type() !== wechaty_puppet_1.ContactType.Personal) {
                    return [2 /*return*/, true]; // yes, ignore message from not personal contacts
                }
                else
                    return [2 /*return*/, false];
                return [2 /*return*/];
            });
        }); }, function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // ignoring it, does nothing, oh, maybe simply logging?
                return [2 /*return*/];
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('AdminBlacklist', function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = /^加黑 /.test(chinese_conv_1.sify(message.text()))
                            && message.to().self(); // talk directly to myself
                        if (!_a) return [3 /*break*/, 2]; // talk directly to myself
                        return [4 /*yield*/, this.isAdmin(message.from().id)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        }); } // talk is an admin
        , function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('AdminKick', function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = /^踢 /.test(chinese_conv_1.sify(message.text()))
                            && message.to().self(); // talk directly to myself
                        if (!_a) return [3 /*break*/, 2]; // talk directly to myself
                        return [4 /*yield*/, this.isAdmin(message.from().id)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        }); } // talk is an admin,
        , function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('AdminAnnounce', function (message) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = /^公告 /.test(chinese_conv_1.sify(message.text()))
                            && message.to().self(); // talk directly to myself
                        if (!_a) return [3 /*break*/, 2]; // talk directly to myself
                        return [4 /*yield*/, this.isAdmin(message.from().id)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        }); } // talk is an admin,
        , function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('JoinHsyRoom', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, message.to().self() && // only messsage to me
                        /(南湾西|南湾东|中半岛|旧金山|东湾|短租|西雅图|测试)/.test(chinese_conv_1.sify(message.text()))];
            });
        }); }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var _loop_1, this_1, _i, _a, roomId, state_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _loop_1 = function (roomId) {
                            var roomId_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!new RegExp("" + roomId).compile().test(chinese_conv_1.sify(message.text()))) return [3 /*break*/, 2];
                                        roomId_1 = hsyRoomsNameToIdMap[chinese_conv_1.sify(message.text())];
                                        return [4 /*yield*/, this_1.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                                var room;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            room = this.wechaty.Room.load(roomId_1);
                                                            return [4 /*yield*/, room.sync()];
                                                        case 1:
                                                            _a.sent();
                                                            return [4 /*yield*/, this.maybeDownsize(room)];
                                                        case 2:
                                                            _a.sent();
                                                            return [4 /*yield*/, room.add(message.from())];
                                                        case 3:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, { value: void 0 }];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = Object.keys(hsyRoomsIdToNameMap);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        roomId = _a[_i];
                        return [5 /*yield**/, _loop_1(roomId)];
                    case 2:
                        state_1 = _b.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('JoinHiking', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, message.to().self() && /爬山/.test(chinese_conv_1.sify(message.text()))];
            });
        }); }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var room;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, message.from().say("\u6B22\u8FCE\u52A0\u5165\u7FA4\u4E3B\u7EC4\u7EC7\u7684\u53E6\u4E00\u4E2A\u793E\u533A\uFF1A\u9760\u8C31\u2122 \u722C\u5C71\u7FA4\uFF0C\u7FA4\u4E3B\u8F7D\u5357\u548C\u7FA4\u91CC\u7684\u5404\u9760\u8C31\u961F\u957F\u5C06\u4E0D\u5B9A\u671F\u7EC4\u7EC7\u722C\u5C71\u6D3B\u52A8")];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, message.from().say("\u6B22\u8FCE\u52A0\u5165")];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        room = this.wechaty.Room.load(hikingRoomId);
                        return [4 /*yield*/, room.sync()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, room.add(message.from())];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('BuyHouse', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, message.to().self() && /买房|购房/.test(chinese_conv_1.sify(message.text()))];
            });
        }); }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var room;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, message.from().say(messageBrokerIsabella)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, message.from().say(messageBrokerIsabellaRefer)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        room = this.wechaty.Room.load(buyHouseRoomId);
                        return [4 /*yield*/, room.sync()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, room.add(message.from())];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, message.from().say("\u6B22\u8FCE\u52A0\u5165\u6211\u4EEC\u597D\u5BA4\u53CB\u2122\u4E70\u623F\u7FA4\u7684\u8BA8\u8BBA")];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('SeekInstructions', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, message.to().self() && /租|加|求|租|加|求|請問|请问|好室友|hi|hello|您好|你好|喂/.test(chinese_conv_1.sify(message.text()))];
            });
        }); }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, message.from().say(greetingMsg)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
    }
    HsyBot.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.wechaty.stop()];
            });
        });
    };
    HsyBot.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.wechaty
                        .on('scan', function (qrcode, status) {
                        _this.qrcode = qrcode;
                        require('qrcode-terminal').generate(qrcode, { small: true });
                        logger.debug("Scan QR Code to login: " + status + "\nhttps://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(qrcode));
                    })
                        .on('login', function (user) {
                        logger.debug("User " + user + " logged in");
                    })
                        .on('logout', function (user) {
                        logger.debug("User " + user + " logged out");
                    })
                        .on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var routeName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger.debug("Route and handling message: " + message);
                                    return [4 /*yield*/, this.chatRouter.process(message)];
                                case 1:
                                    routeName = _a.sent();
                                    logger.debug("handled message from(" + message.from().id + ") to(" + (message.to() ? message.to().id : message.room().id) + ") " + message + " with routeName " + routeName);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .on('friendship', function (friendship) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger.debug("Received friendship " + friendship);
                                    return [4 /*yield*/, this.isBlacklisted(friendship.contact().id)];
                                case 1:
                                    if (!_a.sent()) return [3 /*break*/, 2];
                                    logger.warn("Ignoring friendship from contact " + friendship.contact());
                                    return [3 /*break*/, 5];
                                case 2: return [4 /*yield*/, friendship.accept()];
                                case 3:
                                    _a.sent();
                                    logger.debug("Accepted friendship " + friendship);
                                    return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, friendship.contact().say(greetingMsg)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })
                        .on('room-join', function (room, inviteeList, inviter) {
                        // TODO record who invites who and shows the message of bonus
                    })
                        .start()];
            });
        });
    };
    /**
     * Check if user is admin, only hardcoded
     * @param contactId
     */
    HsyBot.prototype.isAdmin = function (contactId) {
        return HARDCODED_ADMINS.indexOf(contactId) >= 0;
    };
    /**
     * Check if user is whitelisted, only hardcoded
     * @param contactId
     */
    HsyBot.prototype.isWhitelistedNonAdmin = function (contactId) {
        return HARDCODED_WHITELIST.indexOf(contactId) >= 0;
    };
    /**
     * Check if user is blacklisted, query both local hard-coded and storage
     * @param id
     */
    HsyBot.prototype.isBlacklisted = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var contactMetas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongodb.collection("ContactMeta")
                            .find({ _id: contactId }).toArray()];
                    case 1:
                        contactMetas = _a.sent();
                        console.assert(contactMetas.length == 0 || contactMetas.length == 1, "Should return ind 0 or 1 contact");
                        return [2 /*return*/, (contactMetas.length == 1 && contactMetas[0]["isBlacklisted"])];
                }
            });
        });
    };
    HsyBot.prototype.isGoodNickname = function (nickname) {
        return /^(招|求|介|管)-/.test(nickname);
    };
    HsyBot.prototype.getRelatedUsers = function (id, degreeOfExtension) {
        if (degreeOfExtension === void 0) { degreeOfExtension = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO impl
                return [2 /*return*/, []];
            });
        });
    };
    HsyBot.prototype.saveKickFromRoom = function (room, contact) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(contact.self() || this.isAdmin(contact.id) || this.isWhitelistedNonAdmin(contact.id))) return [3 /*break*/, 1];
                        logger.warn("trying to safe kick a contact " + contact + " from room " + room + ", but ignored");
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, room.del(contact)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HsyBot.prototype.maybeDownsize = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var DOWNSIZE_THRESHOLD, members, allCandidates, badNickUsers_1, oldUsers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DOWNSIZE_THRESHOLD = 475;
                        return [4 /*yield*/, room.memberAll()];
                    case 1:
                        members = _a.sent();
                        if (!(members.length >= DOWNSIZE_THRESHOLD)) return [3 /*break*/, 4];
                        allCandidates = members.slice(0, members.length - 50)
                            .filter(function (c) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (this.isAdmin(c.id) || this.isWhitelistedNonAdmin(c.id))];
                        }); }); });
                        badNickUsers_1 = allCandidates.filter(function (c) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = this.isGoodNickname;
                                    return [4 /*yield*/, room.alias(c)];
                                case 1: return [2 /*return*/, (!_a.apply(this, [_b.sent()]))];
                            }
                        }); }); }).slice(0, 25);
                        oldUsers = allCandidates.filter(function (c) { return badNickUsers_1.indexOf(c) < 0; }).slice(0, 50 - badNickUsers_1.length);
                        return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, room.say("\u4E0D\u597D\u610F\u601D\u7FA4\u6EE1\u4E86\uFF0C\u6211\u4EEC\u6E05\u7406\u4E00\u4E0B\u7ED9\u65B0\u7684\u670B\u53CB\u817E\u4F4D\u7F6E\u3002\u4F18\u5148\u6E05\u7406\u6CA1\u6709\u6309\u7167\u683C\u5F0F(\u4F8B\u5982:\"\u62DB-mtv-5.1-\u738B\u5C0F\u660E\")\u4FEE\u6539\u53D6\u6635\u79F0\u7684\u670B\u53CB\u3002\u6709\u9700\u6C42\u53EF\u4EE5\u91CD\u65B0\u52A0\u673A\u5668\u4EBA\u5165\u7FA4")];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        badNickUsers_1.forEach(function (contact) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.saveKickFromRoom(room, contact)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        oldUsers.forEach(function (contact) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.saveKickFromRoom(room, contact)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, room.say("\u6E05\u7406\u5B8C\u6BD5")];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    return HsyBot;
}());
exports.HsyBot = HsyBot;
