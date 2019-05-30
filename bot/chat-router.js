"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatRoute = /** @class */ (function () {
    function ChatRoute(routeName, matchFn, handleFn) {
        this.matchFn = matchFn;
        this.handleFn = handleFn;
    }
    ChatRoute.prototype.routeMatch = function (message) {
        return this.matchFn(message);
    };
    ChatRoute.prototype.handle = function (message, context) {
        if (context === void 0) { context = null; }
        this.handleFn(message, context);
    };
    ChatRoute.prototype.getRouteName = function () {
        return this.routeName;
    };
    return ChatRoute;
}());
exports.ChatRoute = ChatRoute;
/**
 * A chat router, keeps a list of registered [ChatRoute]
 * when processing,
 */
var ChatRouter = /** @class */ (function () {
    function ChatRouter() {
        this.chatRoutes = [];
    }
    ChatRouter.prototype.register = function (chatRoute) {
        this.chatRoutes.push(chatRoute);
    };
    ChatRouter.prototype.process = function (message, context) {
        if (context === void 0) { context = null; }
        // match and handle in the order, exit at the first match
        for (var _i = 0, _a = this.chatRoutes; _i < _a.length; _i++) {
            var chatRoute = _a[_i];
            if (chatRoute.routeMatch(message)) {
                chatRoute.handle(message, context);
                return chatRoute.getRouteName();
            }
        }
    };
    return ChatRouter;
}());
exports.ChatRouter = ChatRouter;
