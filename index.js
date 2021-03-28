const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Telegraf } = require("telegraf");
const {BOT_TOKEN} = require("./config");

const default_btn = [
  { text: "Join Channel", url: "https://t.me/asprojects" },
  { text: "Support Group", url: "https://t.me/assupportchat" },
];

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) =>
  ctx.replyWithMarkdown(
    `Hey ${ctx.message.from.first_name}, Welcome! \nUsing this bot you can search on Amazon , Flipkart (Soon More). Check /help to get started. \n\nMade with ❤ by [𝔄𝔉𝔉𝔄𝔑](https://t.me/AffanTheBest)`,
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn],
      },
    }
  )
);
//! Start Message Ends.

//! Help Message Starts.
bot.help((ctx) =>
  ctx.replyWithMarkdown(
    "Hey " +
      ctx.message.from.first_name +
      ", Welcome! Happy to help you.\n\n`/help` : Get this Message. \n`/amzn `: Search on Amazon.(Eg. `/amzn Macbook`) \n`/flpkrt `: Search on Flipkart.(Eg. `/flpkrt Macbook`)\n\n For more help join support Group.",
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn],
      },
    }
  )
);
//! Help Message Ends.

//! /AMZN Command.
bot.command("amzn", (ctx) => {
  const query = ctx.message.text.split("/amzn ")[1];
  let result = "";
  axios
    .get("https://amznsearch.vercel.app/api/?query=" + query)
    .then((response) => {
      result += "Search results for " + "`" + query + "`.\n\n";
      response.data.map((data) => {
        result += "Name: `"+ data.productName +"` \nPrice: `" + data.productPrice + "` \nLink: [AMAZON LINK](" + data.productLink +")\n\n";
      });
      result += "Search results by @AsSearchBot.";
      ctx.replyWithMarkdown(result, {
          reply_to_message_id: ctx.update.message.message_id,
          allow_sending_without_reply: true,
          disable_web_page_preview: true,
        }
      );
    });
})

//! FLpKRT Command
bot.command("flpkrt", (ctx) => {
  const query = ctx.message.text.split("/flpkrt ")[1];
  let result = "";
  axios
    .get("https://flpkrtsearch.vercel.app/api/?query=" + query)
    .then((response) => {
      result += "Search results for " + "`" + query + "`.\n\n";
      response.data.map((data) => {
        result += "Name: `"+ data.productName +"` \nPrice: `" + data.productPrice + "` \nLink: [FLIPKART LINK](" + data.productLink +")\n\n";
      });
      result += "Search results by @AsSearchBot.";
      ctx.replyWithMarkdown(result, {
          reply_to_message_id: ctx.update.message.message_id,
          allow_sending_without_reply: true,
          disable_web_page_preview: true,
        }
      );
    }).catch(err => {
      ctx.replyWithMarkdown("Sorry, could not find any result for your query! \n\nJoin below for any type of help.👇👇" , 
        {
          reply_to_message_id: ctx.update.message.message_id,
          allow_sending_without_reply: true,
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [default_btn],
          },
        }
      )
    })
})


bot.launch();
