const { Client, GatewayIntentBits, Partials, EmbedBuilder, TextChannel, ActivityType } = require('discord.js');
const fs = require('fs'); // Require the fs module for file operations

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

// File path for logging deleted messages
const logFilePath = './deleted_messages.log';

client.once('ready', () => {
  console.log('Bot is online!');
  client.user.setPresence({ 
    activities: [{ 
      name: 'its chaos!', 
      type: ActivityType.Custom, 
    }], 
    status: 'idle' 
  });
});

// Event listener for message deletions
client.on('messageDelete', async (message) => {
  if (message.partial) {
    try {
      await message.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  const channel = message.channel;
  const author = message.author;
  const content = message.content || '[No text content]';

  const attachments = message.attachments.map(attachment => ({
    url: attachment.url,
    name: attachment.name,
    isImage: attachment.url.match(/\.(jpeg|jpg|gif|png)$/i) !== null
  }));

  const logEmbed = new EmbedBuilder()
    .setTitle(`A message was deleted in #${channel.name}`)
    .setDescription(`**Author:** ${author ? author.tag : 'Unknown user'}\n**Content:** ${content}`)
    .setTimestamp();

  if (attachments.length > 0) {
    attachments.forEach((attachment) => {
      if (attachment.isImage) {
        logEmbed.setImage(attachment.url);
      } else {
        logEmbed.addFields({ name: 'Attachment', value: `[${attachment.name}](${attachment.url})` });
      }
    });
  }

  // Send log embed to a specific channel for Discord
  const logChannel = message.guild.channels.cache.find(ch => ch.name === 'message-logs');
  if (logChannel && logChannel instanceof TextChannel) {
    logChannel.send({ embeds: [logEmbed] });
  }

  // Send log embed to a specific channel by ID for Discord
  const channelID = client.channels.cache.get("1253616319660822578");
  if (channelID && channelID instanceof TextChannel) {
    channelID.send({ embeds: [logEmbed] });
  }

  // Log to a file
  const logMessage = `[${new Date().toLocaleString()}] Message deleted in #${channel.name} by ${author.tag}\nContent: ${content}\n\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
});

// Event listener for message creation and blacklisted words (unchanged)
client.on('messageCreate', async (message) => {
  // Handle blacklisted words (your existing code for blacklisted words)
});

// Event listener for message creation and blacklisted words
client.on('messageCreate', async (message) => {
  // Handle blacklisted words
  if (message.content.toLowerCase().includes("khaos")) {
    let badMsg = message.content;
    let badMsgChan = message.guild.channels.cache.get(message.channel.id);
    let badMsgUser = message.author;
    let logChan = message.guild.channels.cache.find(ch => ch.name === "logs");

    const emb = new EmbedBuilder()
      .setTitle("Blacklisted word used")
      .addFields(
        { name: "Content", value: badMsg, inline: true },
        { name: "Found in", value: badMsgChan.name, inline: true },
        { name: "Written by", value: badMsgUser.tag, inline: true }
      )
      .setTimestamp();

    if (logChan && logChan instanceof TextChannel) {
      logChan.send({ embeds: [emb] });
    }

    message.reply("its chaos");
  }

  if (message.content.toLowerCase().includes("stelsies")) {
    let badMsg = message.content;
    let badMsgChan = message.guild.channels.cache.get(message.channel.id);
    let badMsgUser = message.author;
    let logChan = message.guild.channels.cache.find(ch => ch.name === "logs");

    const emb = new EmbedBuilder()
      .setTitle("Blacklisted word used")
      .addFields(
        { name: "Content", value: badMsg, inline: true },
        { name: "Found in", value: badMsgChan.name, inline: true },
        { name: "Written by", value: badMsgUser.tag, inline: true }
      )
      .setTimestamp();

    if (logChan && logChan instanceof TextChannel) {
      logChan.send({ embeds: [emb] });
    }

    message.reply("nerdsies");
    message.react('🤨');
  }

  if (message.content.toLowerCase().includes("stellics")) {
    let badMsg = message.content;
    let badMsgChan = message.guild.channels.cache.get(message.channel.id);
    let badMsgUser = message.author;
    let logChan = message.guild.channels.cache.find(ch => ch.name === "logs");

    const emb = new EmbedBuilder()
      .setTitle("Blacklisted word used")
      .addFields(
        { name: "Content", value: badMsg, inline: true },
        { name: "Found in", value: badMsgChan.name, inline: true },
        { name: "Written by", value: badMsgUser.tag, inline: true }
      )
      .setTimestamp();

    if (logChan && logChan instanceof TextChannel) {
      logChan.send({ embeds: [emb] });
    }

    message.reply("stel licks");
    message.react('🤨');
  }

  // Handle 'stel' without triggering on 'stelsies' or 'stellics'
  if (message.content.toLowerCase().includes("stel") && !(message.content.toLowerCase().includes("stelsies") || message.content.toLowerCase().includes("stellics"))) {
    if (!message.author.bot) {
      let badMsg = message.content;
      let badMsgChan = message.guild.channels.cache.get(message.channel.id);
      let badMsgUser = message.author;
      let logChan = message.guild.channels.cache.find(ch => ch.name === "logs");

      const emb = new EmbedBuilder()
        .setTitle("Blacklisted word used")
        .addFields(
          { name: "Content", value: badMsg, inline: true },
          { name: "Found in", value: badMsgChan.name, inline: true },
          { name: "Written by", value: badMsgUser.tag, inline: true }
        )
        .setTimestamp();

      if (logChan && logChan instanceof TextChannel) {
        logChan.send({ embeds: [emb] });
      }

      message.reply("who? :face_with_raised_eyebrow:");
      message.react('🇼');
      message.react('🇭');
      message.react('🇴');
      message.react('🤨');

      // React to the message with '✅' and '❌'
      message.react('✅').then(() => message.react('❌'));

      // Define a filter function for the reaction collector
      const collectorFilter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;
      };

      // Await reactions with the specified filter, max of 1 reaction, and 60 seconds timeout
      message.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();

          if (reaction.emoji.name === '✅') {
            message.reply('So who is Stel?');
          } else if (reaction.emoji.name === '❌') {
            message.reply('☹️');
          }
        })
        .catch(() => {
          message.reply('You did not vote either ✅ or ❌');
        });
    }
  }
});

// Log the bot in
const token = "";
client.login(token);
