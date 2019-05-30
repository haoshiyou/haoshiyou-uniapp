import {Contact, Message, Room, Wechaty} from 'wechaty';
import {PuppetPadpro} from 'wechaty-puppet-padpro';
import {ContactSelf} from "wechaty/dist/src/user";

/**
 * A Bot built with WeChaty padpro
 * https://github.com/botorange/wechaty-puppet-padpro
 */
export class HsyBot {
  private wechaty: Wechaty;
  private qrcode: string;

  constructor(wechaty:Wechaty) {
    this.wechaty = wechaty;
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
        console.log(`Message: ${message}`)
      })
      .on('room-join', (room: Room, inviteeList: Contact[], inviter: Contact) => {
        // TODO record who invites who and shows the message of bonus

      })
      .start();
  }
}


