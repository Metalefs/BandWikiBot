require('dotenv').config();
import * as TelegramBot from 'node-telegram-bot-api';

import { init } from './bot';
import { BotService } from './services/bot.service';
import { Navigator } from './shared/navigator';

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

export function initBot() {

  const navigator = new Navigator()

  const botService = new BotService(
    bot,
    navigator
  );
  init(bot, botService);

  return bot;
}
