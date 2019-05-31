"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ChatRoute {
    constructor(routeName, matchFn, handleFn) {
        this.matchFn = matchFn;
        this.handleFn = handleFn;
        this.routeName = routeName;
    }
    routeMatch(message, context = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.matchFn(message, context);
        });
    }
    handle(message, context = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.handleFn(message, context);
        });
    }
    getRouteName() {
        return this.routeName;
    }
}
exports.ChatRoute = ChatRoute;
/**
 * A chat router, keeps a list of registered [ChatRoute]
 * when processing,
 */
class ChatRouter {
    constructor() {
        this.chatRoutes = [];
    }
    register(chatRoute) {
        this.chatRoutes.push(chatRoute);
    }
    process(message, context = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // match and handle in the order, exit at the first match
            for (let chatRoute of this.chatRoutes) {
                let shouldMatch = yield chatRoute.routeMatch(message);
                if (shouldMatch) {
                    yield chatRoute.handle(message, context);
                    return chatRoute.getRouteName();
                }
            }
            return `NoMatchRoute`;
        });
    }
}
exports.ChatRouter = ChatRouter;
//# sourceMappingURL=chat-router.js.map