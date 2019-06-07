export class ChatRoute {
  private readonly matchFn: (msg, ctx) => Promise<boolean>;
  private readonly handleFn: (msg, ctx) => Promise<void>;
  private readonly routeName:string;
  constructor(
    routeName:string,
    matchFn:(msg, ctx) => Promise<boolean>,
    handleFn:(msg, ctx) => Promise<void>) {
    this.matchFn = matchFn;
    this.handleFn = handleFn;
    this.routeName = routeName;
  }

  public async routeMatch(message, context = null):Promise<boolean> {
    return await this.matchFn(message, context);
  }

  public async handle(message, context = null):Promise<void> {
    return await this.handleFn(message, context);
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

  public async process(message, context = null):Promise<string> {
    // match and handle in the order, exit at the first match
    for (let chatRoute of this.chatRoutes) {
      let shouldMatch = await chatRoute.routeMatch(message);
      if (shouldMatch) {
        await chatRoute.handle(message, context);
        return chatRoute.getRouteName();
      }
    }
    return `NoMatchRoute`;
  }
}
