import { Markup } from 'telegraf';

export const BOT_COMMANDS = [
  {
    command: '/start',
    description: 'Start!',
  },
  { command: '/info', description: 'Info!' },
  { command: '/open_menu', description: 'Open Menu!' },
  { command: '/close_menu', description: 'Close Menu!' },
];

export const BOT_INLINE_KEYBOARD_MARKUP_ANSWERS = Markup.inlineKeyboard([
  Markup.button.callback('1', '1'),
  Markup.button.callback('2', '2'),
  Markup.button.callback('3', '3'),
]);

export const BOT_INLINE_KEYBOARD_MARKUP_TRY_AGAIN = Markup.inlineKeyboard([
  Markup.button.callback('Try Again!', 'try_again'),
]);

export const BOT_REPLY_KEYBOARD_MARKUP_OPEN = {
  reply_markup: {
    keyboard: [[{ text: 'Guess the number 1, 2 or 3' }]],
    resize_keyboard: true,
  },
};

export const BOT_REPLY_KEYBOARD_MARKUP_CLOSE = {
  reply_markup: {
    remove_keyboard: true,
  },
};
