// Create a bot that uses 'polling' to fetch new updates
import { BotService } from "./services/bot.service";

export const init = (bot, botService: BotService) => {
  bot.onText(/\/start/, botService.start);
  bot.onText(/\/band (.+)/, botService.band);
  return bot;
};
