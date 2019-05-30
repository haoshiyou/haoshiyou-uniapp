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
/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
var HsyBot = /** @class */ (function () {
    function HsyBot(wechaty) {
        var _this = this;
        this.limiter = new bottleneck_1.default({
            minTime: 1500
        });
        this.wechaty = wechaty;
        this.chatRouter = new chat_router_1.ChatRouter();
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
                            && message.to().id === this.wechaty.userSelf().id; // talk directly to myself
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
                            && message.to().id === this.wechaty.userSelf().id; // talk directly to myself
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
                            && message.to().id === this.wechaty.userSelf().id; // talk directly to myself
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
                return [2 /*return*/, /^(南湾西|南湾东|中半岛|旧金山|东湾|短租|西雅图|测试)$/.test(chinese_conv_1.sify(message.text()))];
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
                                                            // TODO add maybe downsize room
                                                            return [4 /*yield*/, room.add(message.from())];
                                                        case 2:
                                                            // TODO add maybe downsize room
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
        this.chatRouter.register(new chat_router_1.ChatRoute('SeekInstructions', function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /租|加|求|租|加|求|請問|请问|好室友|hi|hello|您好|你好|喂/.test(chinese_conv_1.sify(message.text()))];
            });
        }); }, function (message, context) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.limiter.schedule(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, message.from().say("\n          \u8BF7\u95EE\u4F60\u8981\u52A0\u54EA\u4E2A\u533A\u57DF\u7684\u7FA4\uFF1F\n            \u3010\u5357\u6E7E\u897F\u3011\u5305\u542B Palo Alto\uFF0CStanford, Mountain View\uFF0CSunnyvale\uFF0CCupertino \u4E00\u5E26\n            \u3010\u5357\u6E7E\u4E1C\u3011\u5305\u542B San Jose\uFF0CSanta Clara\uFF0CMilpitas\u4E00\u5E26\n            \u3010\u4E1C\u6E7E\u3011\u6E7E\u4E1C\u8FB9 Milpitas\u4EE5\u5317\uFF0C\u5305\u62ECFremont\uFF0CHayward\uFF0CBerkeley\u7B49\n            \u3010\u4E2D\u534A\u5C9B\u3011Redwood\u4EE5\u5317\uFF0CSan Francisco\u4EE5\u5357\n            \u3010\u4E09\u756A\u3011\u65E7\u91D1\u5C71 (San Francisco) \u57CE\u91CC\uFF0C\u542BSouth San Francisco\n            \u3010\u897F\u96C5\u56FE\u3011\u6211\u4EEC\u65B0\u5F00\u8BBE\u4E86\u897F\u96C5\u56FE\u597D\u5BA4\u53CB\u7FA4\uFF0C\u670D\u52A1\u5927\u897F\u96C5\u56FE\u5730\u533A\n            \u3010\u77ED\u79DF\u3011\u5982\u679C\u4F60\u5E0C\u671B\u5728\u65E7\u91D1\u5C71\u6E7E\u533A\u4EFB\u610F\u5730\u65B9\u5185\u8FDB\u884C3\u4E2A\u6708\u4EE5\u5185\u77ED\u79DF\uFF08\u51FA\u79DF\u548C\u6C42\u79DF\uFF09\uFF0C\u8BF7\u52A0\u77ED\u79DF\u7FA4\n          \u8BF7\u56DE\u590D\u8981\u52A0\u54EA\u4E2A\u7FA4\uFF0C\u4F8B\u5982\uFF1A \u5357\u6E7E\u897F\n          ")];
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
                                    logger.debug("handled with name " + routeName);
                                    return [2 /*return*/];
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
     * Check if user is admin, query both local hard-coded and storage
     * @param id
     */
    HsyBot.prototype.isAdmin = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO impl
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Check if user is whitelisted, query both local hard-coded and storage
     * @param id
     */
    HsyBot.prototype.isWhitelisted = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO impl
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Check if user is blacklisted, query both local hard-coded and storage
     * @param id
     */
    HsyBot.prototype.isBlacklisted = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO impl
                return [2 /*return*/, false];
            });
        });
    };
    HsyBot.isGoodNickname = function (nickname) {
        // TODO impl
        return false;
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
    return HsyBot;
}());
exports.HsyBot = HsyBot;
