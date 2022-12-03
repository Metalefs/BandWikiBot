import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class TelegramService {

  constructor(@Inject('TELEGRAM_BOT') protected bot){
  }

}
