import { NowRequest, NowResponse } from "@vercel/node";
import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.BOT_TOKEN || "YOUR_TELEGRAM_BOT_TOKEN";
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Halo! Saya bot yang berjalan di Vercel!");
});

export default (req: NowRequest, res: NowResponse) => {
  res.status(200).send("Bot is running!");
};
