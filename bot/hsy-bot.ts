import { Wechaty } from 'wechaty';
import { PuppetPadpro } from 'wechaty-puppet-padpro';

export class HsyBot {
  private padproBot:Wechaty;
  private qrcode:string;
  constructor() {
    const puppet = new PuppetPadpro({
      token: process.env.WECHATY_PUPPET_PADPRO_TOKEN,
    });

    this.padproBot = new Wechaty({
      puppet,
    });
  }
  public async stop() {
    this.padproBot.stop();
  }

  public async start() {

    // 设置完成

    // 运行 wechaty
    this.padproBot
      .on('scan', (qrcode, status) => {
        this.qrcode = qrcode;
        require('qrcode-terminal').generate(qrcode, {small: true});
        console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
      })
      .on('login',            user => {
        console.log(`User ${user} logged in`)
      })
      .on('logout',            user => {
        console.log(`User ${user} logged out`)
      })
      .on('message',       message => {
        console.log(`Message: ${message}`)
      })
      .start();
  }
}


