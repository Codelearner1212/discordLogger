const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');
require('dotenv').config(); // For loading environment variables

// Initialize the client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // This intent is necessary to receive message content
    GatewayIntentBits.GuildMessageReactions // Required for reacting to messages
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
  ],
});

client.once('ready', () => {
  console.log('Bot is online!');
});

function ranc() {
  const colors = [
    "#000000", "#1ABC9C", "#11806A", "#57F287", "#1F8B4C",
    "#3498DB", "#206694", "#9B59B6", "#71368A", "#E91E63",
    "#AD1457", "#F1C40F", "#C27C0E", "#E67E22", "#A84300",
    "#ED4245", "#992D22", "#95A5A6", "#979C9F", "#7F8C8D",
    "#BCC0C0", "#34495E", "#2C3E50", "#FFFF00"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Command handler
client.on('messageCreate', async (message) => {
  const prefix = '='; // Define your prefix here
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'translate') {
    const lang = args[0];
    const txt = args.slice(1).join(" ");

    if (!lang) {
      return message.channel.send("Please provide an ISO code of the language.");
    }

    if (!txt) {
      return message.channel.send("Please provide a text to translate.");
    }

    try {
      const res = await translate(txt, { to: lang });
      const embed = new EmbedBuilder()
        .setDescription(res.text)
        .setColor(ranc());

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.channel.send("Failed to translate the text. Please check the language code and try again.");
    }
  }
});

// Log the bot in
const token = "MTE5MjMzNTEyMjE2NzUxNzI3NA.GRoG8H.zr7qRBGxRHv1JavVk1qnPzz59Ypi2U1BPGqS7Q";
client.login(token);