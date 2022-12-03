import { Navigator } from "../shared/navigator";

const MAX_MSG_TXT_LEN = 4096;

export class BotService {
  constructor(
    private bot,
    private searchService: Navigator
  ) {
    this.bot.nextMessage = {};
    this.bot.sendMessage = this._pageText(this.bot.sendMessage);

    this.bot.onNextMessage = (chatId, callback) => {
      const promise = new Promise((resolve) => {
        this.bot.nextMessage[chatId] = { callback: callback, next: resolve };
      });
      return promise;
    };
  }

  start = async (msg, match) => {
    const [chatId] = [msg.chat.id];

    await this.bot.sendMessage(
      chatId,
      "Veja o menu para conhecer as funcionalidades do bot.",
      {parse_mode: "HTML"}
    );
    await this.bot
      .sendMessage(chatId, chatId)
  }

  band = async (msg, match) => {
    const [chatId, name] = this.parseChat(msg, match);

    if (!name) {
      this.bot.sendMessage(
        chatId,
        "Esse comando precisa de um argumento. Ex: /wishlist {{id}}"
      );
      return;
    }
    await this.bot.sendMessage(
      chatId,
      'Buscando dados...'
    );

    await this.searchService.searchMetalArchives({name}).then(async result=>{
      await this.bot.sendMessage(
        chatId,
        JSON.stringify(result,null,4)
      );
    })

  };


  private parseChat(msg, match) {
    return [msg.chat.id, match[1]];
  }

   /**
 * Return a function that wraps around 'sendMessage', to
 * add paging fanciness.
 *
 * @private
 * @param  {Function} sendMessage
 * @return {Function} sendMessage(chatId, message, form)
 */
  _pageText(sendMessage) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this.bot;

    return async function (chatId, message, form:any = {}) {
      if(!message) message = 'empty'
      if (message.length < MAX_MSG_TXT_LEN) {
        return sendMessage.call(self, chatId, message, form);
      }

      let index = 0;
      let parts = [];
      // we are reserving 8 characters for adding the page number in
      // the following format: [01/10]
      const reserveSpace = 8;
      const shortTextLength = MAX_MSG_TXT_LEN - reserveSpace;
      let shortText;

      if(message.substr)
      while ((shortText = message?.substr(index, shortTextLength))) {
        parts.push(shortText);
        index += shortTextLength;
      }

      // The reserve space limits us to accommodate for not more
      // than 99 pages. We signal an error to the user.
      if (parts.length > 99) {
        console.log("Tgfancy#sendMessage: Paging resulted into more than 99 pages");
        return new Promise(function (resolve, reject) {
          const error = new Error("Paging resulted into more than the maximum number of parts allowed");
          (error as any).parts = parts;
          return reject(error);
        });
      }

      parts = parts.map(function (part, i) {
        return `[${i + 1}/${parts.length}] ${part}`;
      });
      for(const part of parts){
        if(form?.parse_mode === 'HTML')  form.parse_mode = null;
        await sendMessage.call(self, chatId, part, form);
      }
    }
  }
}
