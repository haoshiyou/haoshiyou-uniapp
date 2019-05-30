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
/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
var HsyBot = /** @class */ (function () {
    function HsyBot(wechaty) {
        var _this = this;
        this.wechaty = wechaty;
        this.chatRouter = new chat_router_1.ChatRouter();
        this.chatRouter.register(new chat_router_1.ChatRoute('Ignore', function (message) {
            if (message.from().id === _this.wechaty.id) {
                return true;
            }
            else if (message.room() // it's a room TODO test it
                && Object.keys(hsyRoomsIdToNameMap).indexOf(message.room().id) < 0 // and it is not a HsyRoom
            ) {
                return true;
            }
            else
                return false;
        }, function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // ignore it
                return [2 /*return*/];
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('JoinHsyRoom', function (message) {
            return /^(南湾西|南湾东|中半岛|旧金山|东湾|短租|西雅图|测试)$/.test(chinese_conv_1.sify(message.text()));
        }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var roomId, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomId = hsyRoomsNameToIdMap[chinese_conv_1.sify(message.text())];
                        room = this.wechaty.Room.load(roomId);
                        return [4 /*yield*/, room.sync()];
                    case 1:
                        _a.sent();
                        // TODO maybe downsize room
                        return [4 /*yield*/, room.add(message.from())];
                    case 2:
                        // TODO maybe downsize room
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }));
        this.chatRouter.register(new chat_router_1.ChatRoute('SeekInstructions', function (message) {
            return /你好|hi|请问/.test(chinese_conv_1.sify(message.text()));
        }, function (message, context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, message.from().say("\u8BF7\u95EE\u4F60\u8981\u52A0\u54EA\u4E2A\u7FA4?")];
                        case 1:
                            _a.sent(); // TODO 加上具体的几个群的名称
                            return [2 /*return*/];
                    }
                });
            });
        }));
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
                        console.log("Scan QR Code to login: " + status + "\nhttps://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(qrcode));
                    })
                        .on('login', function (user) {
                        console.log("User " + user + " logged in");
                    })
                        .on('logout', function (user) {
                        console.log("User " + user + " logged out");
                    })
                        .on('message', function (message) {
                        console.log("Message: " + message);
                    })
                        .on('room-join', function (room, inviteeList, inviter) {
                        // TODO record who invites who and shows the message of bonus
                    })
                        .start()];
            });
        });
    };
    return HsyBot;
}());
exports.HsyBot = HsyBot;
