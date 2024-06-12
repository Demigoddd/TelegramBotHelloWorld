import 'dotenv/config';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import {
  BOT_COMMANDS,
  BOT_INLINE_KEYBOARD_MARKUP_ANSWERS,
  BOT_INLINE_KEYBOARD_MARKUP_TRY_AGAIN,
  BOT_REPLY_KEYBOARD_MARKUP_OPEN,
  BOT_REPLY_KEYBOARD_MARKUP_CLOSE,
} from './consts.js';

if (!process.env.TELEGRAM_BOT_TOKEN)
  throw new Error('"TELEGRAM_BOT_TOKEN" env var is required!');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.telegram.setMyCommands(BOT_COMMANDS);

const gameResult = {};

bot.start((ctx) => {
  const payload = Boolean(ctx.payload) ? `Payload is ${ctx.payload}` : '';
  ctx.reply(`Welcome to the BOT! ${payload}`);
});
bot.command('info', (ctx) => ctx.reply('👍'));
bot.command('open_menu', (ctx) =>
  ctx.reply('Choose option..', BOT_REPLY_KEYBOARD_MARKUP_OPEN)
);
bot.command('close_menu', (ctx) =>
  ctx.reply('Menu closed..', BOT_REPLY_KEYBOARD_MARKUP_CLOSE)
);
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on('message', async (ctx) => {
  if (ctx.message.text == 'cat') {
    try {
      const response = await axios.get(
        'https://api.thecatapi.com/v1/images/search'
      );
      await ctx.reply(response?.data[0].url);
    } catch (error) {
      await ctx.reply('Error Cat!');
    }
  } else if (ctx.message.text == 'Guess the number 1, 2 or 3') {
    startGame(ctx);
  } else {
    await ctx.reply('I don`t understand 1');
    await ctx.reply('I don`t understand 2');
  }
});

bot.on('callback_query', async (ctx) => {
  if (ctx.callbackQuery.data == 'try_again') {
    return startGame(ctx);
  }

  if (gameResult[ctx.chat.id].isFinished) {
    return await ctx.reply(`Try Again..`, BOT_INLINE_KEYBOARD_MARKUP_TRY_AGAIN);
  }

  if (gameResult[ctx.chat.id].randomNumber == ctx.callbackQuery.data) {
    gameResult[ctx.chat.id].isFinished = true;
    return await ctx.reply(
      `WIN!!! My number is ${gameResult[ctx.chat.id].randomNumber}`,
      BOT_INLINE_KEYBOARD_MARKUP_TRY_AGAIN
    );
  } else {
    gameResult[ctx.chat.id].isFinished = true;
    return await ctx.reply(
      `Lose!!! My number is ${gameResult[ctx.chat.id].randomNumber}`,
      BOT_INLINE_KEYBOARD_MARKUP_TRY_AGAIN
    );
  }
});

const startGame = async (ctx) => {
  gameResult[ctx.chat.id] = {
    randomNumber: Math.floor(Math.random() * 3) + 1,
    isFinished: false,
  };
  await ctx.reply('Guess the number..', BOT_INLINE_KEYBOARD_MARKUP_ANSWERS);
};

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
