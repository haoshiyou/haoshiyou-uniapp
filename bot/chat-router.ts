export class ChatRoute {
  private readonly matchFn;
  private readonly handleFn;
  private readonly routeName:string;
  constructor(
    routeName:string,
    matchFn:(msg, ctx) => Promise<boolean>,
    handleFn:(msg, ctx) => Promise<void>) {
    this.matchFn = matchFn;
    this.handleFn = handleFn;
  }

  public routeMatch(message):boolean {
    return this.matchFn(message);
  }

  public handle(message, context = null) {
    this.handleFn(message, context);
  }

  public getRouteName():string {
    return this.routeName;
  }
}

/**
 * A chat router, keeps a list of registered [ChatRoute]
 * when processing,
 */
export class ChatRouter {
  private chatRoutes:Array<ChatRoute> = [];

  public register(chatRoute:ChatRoute) {
    this.chatRoutes.push(chatRoute);
  }

  public process(message, context = null):string {
    // match and handle in the order, exit at the first match
    for (let chatRoute of this.chatRoutes) {
      if (chatRoute.routeMatch(message)) {
        chatRoute.handle(message, context);
        return chatRoute.getRouteName();
      }
    }
  }
}
