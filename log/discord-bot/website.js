const { Client, GatewayIntentBits, Partials, EmbedBuilder, TextChannel, ActivityType, Collection, Events, ChannelType } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path'); // Import the path module
const fs = require('fs'); // Require the fs module for file operations
const translate = require('@iamtraction/google-translate');
require('dotenv').config(); // For loading environment variables

// Initialize the client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // This intent is necessary to receive message content
    GatewayIntentBits.GuildMessageReactions, // Required for reacting to messages
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
  ],
});

// Fetch a random meme from r/Catmemes
async function fetchMeme() {
    try {
        const response = await axios.get('https://www.reddit.com/r/Catmemes/top.json?limit=50');
        
        const posts = response.data.data.children;
        const randomPost = posts[Math.floor(Math.random() * posts.length)].data;

        return randomPost.url;  // Return only the image URL
    } catch (error) {
        console.error('Error fetching meme:', error);
        return null;
    }
}


const REQUIRED_ROLES = ['1257162374344085645', '1257688621629308928'];
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '-cm') {
        // Check if the user has the required role
        const hasRole = message.member.roles.cache.some(role => 
          REQUIRED_ROLES.includes(role.name) || REQUIRED_ROLES.includes(role.id)
      );
        
        if (hasRole) {
            const memeImageUrl = await fetchMeme();
            if (memeImageUrl) {
                message.reply(memeImageUrl);
            } else {
                message.reply('Sorry, I couldn\'t fetch a meme right now.');
            }
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    }
});

client.once('ready', () => {
  console.log('Bot is online!');

  client.user.setPresence({
    activities: [{
      name: 'Testing',
      type: ActivityType.Custom, // Adjust to a valid ActivityType if needed
    }],
    status: 'idle'
  });
});

function ranc() {
  var col = ["#000000", "#1ABC9C", "#11806A", "#57F287", "#1F8B4C", "#3498DB", "#206694", "#9B59B6", "#71368A", "#E91E63", "#AD1457", "#F1C40F", "#C27C0E", "#E67E22", "#A84300", "#ED4245", "#992D22", "#95A5A6", "#979C9F", "#7F8C8D", "#BCC0C0", "#34495E", "#2C3E50", "#FFFF00"]
  var rnd = Math.floor(Math.random() * col.length); 
  console.log(col[rnd])
  console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
  console.log('%cHello', 'color: green; background: yellow; font-size: 30px');
  return(col[rnd])
}


client.on('messageCreate', async (message) => {
  const prefix = '='; // Define your prefix here
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'translate') {
    const lang = args[0];
    const txt = args.slice(1).join(" ");
console.log('message received')
    if (!lang) {
      return message.reply("Please provide an ISO code of the language.");
    }

    if (!txt) {
      return message.reply("Please provide a text to translate.");
    }

    try {
      const res = await translate(txt, { to: lang });
      const embed = new EmbedBuilder()
        .setDescription(res.text)
        .setColor(ranc());

      message.reply({ embeds: [embed] });
      console.log('message sent')
    } catch (err) {
      console.error(err);
      message.reply("Failed to translate the text. Please check the language code and try again.");
    }
  }
});



// Log the bot in
const token = "MTE5MjMzNTEyMjE2NzUxNzI3NA.GRoG8H.zr7qRBGxRHv1JavVk1qnPzz59Ypi2U1BPGqS7Q";
client.login(token);
