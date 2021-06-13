const axios = require("axios");
const { Telegraf } = require("telegraf");
const {BOT_TOKEN} = require("./config");

const default_btn = [
  { text: "Join Channel", url: "https://t.me/asprojects" },
  { text: "Support Group", url: "https://t.me/assupportchat" },
];
const inline_btn = [
  { text: "Go inline here", switch_inline_query_current_chat: ''},
  {text: "Go inline in other chats", switch_inline_query: ''}
]

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) =>
  ctx.replyWithMarkdown(
    `Hey ${ctx.message.from.first_name}, Welcome! \nUsing this bot you can search on Amazon , Flipkart (Soon More). Check /help to get started. You can also use me in inline mode. \n\nMade with ❤ by [𝔄𝔉𝔉𝔄𝔑](https://t.me/AffanTheBest)`,
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn, inline_btn],
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
      ", Welcome! Happy to help you.\n\n`/help` : Get this Message. \n`/amzn `: Search on Amazon.(Eg. `/amzn Macbook`) \n`/flpkrt `: Search on Flipkart.(Eg. `/flpkrt Macbook`)\nType `@AsSearchBot` in chat input to search inline. (Eg. `@AsSearchBot Macbook`)\n\n/donate - Donate to developer.\n\nFor more help join support Group.",
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn, inline_btn],
      },
    }
  )
);
//! Help Message Ends.

//! Donate Command
bot.command('donate', async(ctx) => {
  const donate_btns = [
    {text: 'Ko-fi', url: 'https://ko-fi.com/affanthebest'},
    {text: 'Paypal', url: 'https://paypal.me/affanthebest'}
  ]
  ctx.replyWithMarkdown('Thanks for showing intrest in donating. Remember every donation matters!\n\nYou can donate me by using following links:\nPaypal: https://paypal.me/affanthebest\nKo-fi - https://ko-fi.com/affanthebest \n\nUPI - `siddiquiaffan201@okaxis`\n\nFor any other methods contact @AffanTheBest personally.',
  {  
    reply_to_message_id: ctx.update.message.message_id,
    allow_sending_without_reply: true,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [donate_btns],
    },
  });
})

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

bot.on('inline_query', async(ctx) => {
  if(ctx.inlineQuery.query && ctx.inlineQuery.query.length > 2) {
    const apiUrl = "https://amznsearch.vercel.app/api/?query=" + ctx.inlineQuery.query
    const res = await axios.get(apiUrl)
    const result = await res.data
    const genArticle = (id, title, description, thumb_url, message_text) => ({
      type: 'article', id, title, description, thumb_url, input_message_content:{
        message_text, disable_web_page_preview: true, parse_mode: 'markdown'}
    })
    if(result.length > 0){
      let allProducts = "Search results for " + "`" + ctx.inlineQuery.query + "`.\n\n";
      result.map((data) => {
        allProducts += "Name: `"+ data.productName +"` \nPrice: `" + data.productPrice + "` \nLink: [AMAZON LINK](" + data.productLink +")\n\n";
      });
      allProducts += "Search results by @AsSearchBot.";
      let products = [genArticle(0, 'All results', 'Send all search results', '', allProducts)]
      await result.forEach(({productName, productImage, productPrice, productLink}, index) => (
        products.push(genArticle(index+1, productName, productPrice, productImage, `Name: ${'`'+productName+'`'} \nPrice: ${'`'+productPrice+'`'} \nLink: [AMAZON LINK](${productLink})`))
      ))
      return await ctx.answerInlineQuery(products)
    }else{
      return await ctx.answerInlineQuery([{
        type: 'article',
        id: 1,
        title: 'Searching.. Please wait',
        input_message_content:{
          message_text: 'PLease click on result after searching.'
        }
      }])
    }
  }
})

bot.launch().then(() => console.log('Bot launched'));
