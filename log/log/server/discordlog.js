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

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands'); // Use __dirname to get the absolute path
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// File path for logging deleted messages
const logFilePath = './deleted_messages.log';
const CHANNEL_ID = '1241449347980333096';
const SPECIFIC_USER_ID = '687309923729801230';
const editedLogFilePath = './edited_messages.log';
const SPECIFIC_USER_ID2='805751632842981377';
const specificRoleId = '1257688621629308928'; 

// Function to check the website and send message if condition is met
async function checkWebsite() {
  try {
     const response = await axios.get('https://sk1er.club/leaderboards/guild_wins_duels');
    const $ = cheerio.load(response.data);

    const lastGeneratedText = $('body').text().match(/Last Generated: [0-9]+ Minute Ago/);
    if (lastGeneratedText && lastGeneratedText[0] === 'Last Generated: 0 Minute Ago') {
      const channel = await client.channels.fetch(CHANNEL_ID);
      await channel.send("The website https://sk1er.club/leaderboards/guild_wins_duels has been updated.");
      console.log('updated');
      return true; // Indicate that an update was found
    }
  } catch (error) {x
    console.error('Error checking website:', error);
  }
  return false; // Indicate that no update was found
}



// Define the function to start checking the website
function startChecking() {
  const checkInterval = setInterval(async () => {
    const updated = await checkWebsite();
    if (updated) {
      clearInterval(checkInterval); // Stop the interval
      setTimeout(startChecking, 79200000); // Wait for 2 hours before starting again
    }
  }, 60000);
}
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
async function fetchMeme2() {
    try {
        const response = await axios.get('https://www.reddit.com/r/funny/top.json?limit=50');
        
        const posts = response.data.data.children;

        // Filter posts to include only those with URLs ending in common image extensions
        const imagePosts = posts.filter(post => {
            const url = post.data.url;
            return url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif');  // Add other extensions if needed
        });

        if (imagePosts.length === 0) {
            console.warn('No image posts found');
            return null;
        }

        const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)].data;

        return randomPost.url;  // Return only the image URL
    } catch (error) {
        console.error('Error fetching meme:', error);
        return null;
    }
}

const REQUIRED_ROLES = ['1257162374344085645', '1257688621629308928'];
client.on('messageCreate', async (message) => {
  if (message.content==='.lb'){
    const mess='https://sk1er.club/leaderboards/guild_wins_duels';
    message.reply(mess);
  }
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

// client.on('messageCreate', async (message) => {
//     if (message.content.toLowerCase() === '-ff') {
//         // Check if the user has the required role
//         const hasRole = message.member.roles.cache.some(role => 
//           REQUIRED_ROLES.includes(role.name) || REQUIRED_ROLES.includes(role.id)
//       );
        
//         if (hasRole) {
//             const memeImageUrl = await fetchMeme2();
//             if (memeImageUrl) {
//                 message.reply(memeImageUrl);
//             } else {
//                 message.reply('Sorry, I couldn\'t fetch a meme right now.');
//             }
//         } else {
//             message.reply('You do not have the required role to use this command.');
//         }
//     }
// });
client.once('ready', () => {
  console.log('Bot is online!');
  startChecking(); // Start the initial checking process
  client.user.setPresence({
    activities: [{
      name: 'its chaos!',
      type: ActivityType.Custom, // Adjust to a valid ActivityType if needed
    }],
    status: 'idle'
  });
});

function ranc() {
  var col = ["#000000", "#1ABC9C", "#11806A", "#57F287", "#1F8B4C", "#3498DB", "#206694", "#9B59B6", "#71368A", "#E91E63", "#AD1457", "#F1C40F", "#C27C0E", "#E67E22", "#A84300", "#ED4245", "#992D22", "#95A5A6", "#979C9F", "#7F8C8D", "#BCC0C0", "#34495E", "#2C3E50", "#FFFF00"]
  var rnd = Math.floor(Math.random() * col.length);
  return(col[rnd])
}

// Set up the "meow" counts
let meowCounts = {};

// Load existing counts from file, if any
try {
    if (fs.existsSync('meowCounts.json')) {
        const data = fs.readFileSync('meowCounts.json', 'utf8');
        if (data) {
            meowCounts = JSON.parse(data);
        }
    }
} catch (error) {
    console.error('Error reading or parsing meowCounts.json:', error);
    meowCounts = {};  // If there's an error, initialize with an empty object
}

client.on('messageCreate', (message) => {
   if (message.author.bot) return;

  // Check if the message channel exists and is not null
  if (!message.channel) return;

  // Ignore direct messages
  if (message.channel.type === 'DM') return;
 if (!message.guild) return;
    const content = message.content.toLowerCase();
    const userId = message.author.id;  // Track using user ID
    const username = message.author.username;  // For display purposes only
    const guildId = message.guild.id;
    const guildName = message.guild.name;

    // Ensure there's a meow count for the current guild
    if (!meowCounts[guildId]) {
        meowCounts[guildId] = {}; // Initialize for the guild
    }

    // Check if the message is "meow"
    if (content === 'meow') {
        // Increment the user's meow count by user ID in the current guild
        if (meowCounts[guildId][userId]) {
            meowCounts[guildId][userId].count++;
        } else {
            meowCounts[guildId][userId] = { count: 1, username: username };  // Store username for display
        }

        // Save the updated counts to a JSON file
        fs.writeFileSync('meowCounts.json', JSON.stringify(meowCounts, null, 2));
    }

   

    // Command: ".meowtop"
    else if (content === '.meowtop') {
        // Ensure the guild has been tracked and has meow counts
        if (!meowCounts[guildId] || Object.keys(meowCounts[guildId]).length === 0) {
            message.channel.send(`No one has said 'meow' yet in ${message.guild.name}!`);
        } else {
            // Get the top 10 meowers in the current guild
            const filteredMeows = Object.entries(meowCounts[guildId])
                .filter(([, data]) => data.count > 0)  // Only include users with meows > 0
                .sort(([, a], [, b]) => b.count - a.count)  // Sort by count in descending order
                .slice(0, 10);  // Limit to top 10 users

            if (filteredMeows.length === 0) {
                message.channel.send(`No one has said 'meow' yet in ${message.guild.name}!`);
            } else {
                // Create a string to format users and counts with medals
                let topMeowers = '';
                filteredMeows.forEach(([userId, data], index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                    const rank = index >= 3 ? `${index + 1}. ` : ''; // Rank number with dot for 4-10
                    topMeowers += `${medal} ${rank}${data.username}: ${data.count} meows\n`;
                });

                const utcTime = new Date().toUTCString();

                // Create the embed message
                const embed = new EmbedBuilder()
                    .setColor(ranc())
                    .setTitle(`Top Meowers in ${message.guild.name}`)
                    .setDescription('Meow Leaderboard')
                    .setFooter({ text: `Generated: ${utcTime}` })  // Set the footer with "Generated" and UTC time
                    .setThumbnail(message.guild.iconURL())
                    .addFields({ name: 'Leaderboard', value: topMeowers });  // Add all top meowers in a single field

                // Send the embed with the leaderboard
                message.channel.send({ embeds: [embed] });
            }
        }
    }

    // Command: ".meowtopg" (Global leaderboard)
    else if (content === '.meowtopg') {
        // Create a global leaderboard by summing meows from all guilds
        let globalMeowCounts = {};

        // Loop through all guilds and aggregate the meow counts
        for (const guildId in meowCounts) {
            const guildMeows = meowCounts[guildId];

            for (const userId in guildMeows) {
                if (globalMeowCounts[userId]) {
                    globalMeowCounts[userId].count += guildMeows[userId].count;  // Add meows from other guilds
                } else {
                    globalMeowCounts[userId] = { count: guildMeows[userId].count, username: guildMeows[userId].username };  // Initialize
                }
            }
        }

        // Get the top 10 meowers globally
        const sortedGlobalMeows = Object.entries(globalMeowCounts)
            .filter(([, data]) => data.count > 0)  // Only include users with meows > 0
            .sort(([, a], [, b]) => b.count - a.count)  // Sort by count in descending order
            .slice(0, 10);  // Limit to top 10 users

        if (sortedGlobalMeows.length === 0) {
            message.channel.send("No one has said 'meow' globally yet!");
        } else {
            // Create a string to format users and counts with medals
            let topMeowersGlobal = '';
            sortedGlobalMeows.forEach(([userId, data], index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                const rank = index >= 3 ? `${index + 1}. ` : '';  // Rank number with dot for 4-10
                topMeowersGlobal += `${medal} ${rank}${data.username}: ${data.count} meows\n`;
            });

            const utcTime = new Date().toUTCString();

            // Create the embed message
            const embed = new EmbedBuilder()
                .setColor(ranc())
                .setTitle('Top Meowers Globally')
                .setDescription('Global Meow Leaderboard')
                .setFooter({ text: `Generated: ${utcTime}` })  // Set the footer with "Generated" and UTC time
                .setThumbnail('https://path.to/trophy/image')  // Set the trophy image for global leaderboard
                .addFields({ name: 'Leaderboard', value: topMeowersGlobal });  // Add all top meowers in a single field

            // Send the embed with the global leaderboard
            message.channel.send({ embeds: [embed] });
        }
    }
   
   
    if (content === '.meow') {
        const userMeows = meowCounts[guildId][userId]?.count || 0;

        if (userMeows === 0) {
            message.reply(`You have not said any meows yet! Go meow.`);
        } else if (userMeows === 1) {
            message.reply(`You have said meow once. :3`);
        } else {
            message.reply(`You have said meow ${userMeows} times. :3`);
        }
    }
});
  
client.on('messageCreate', async (message) => {
 if (message.content.startsWith('!dm')) {
  const args = message.content.split(' ').slice(1);
  const userId = args.shift();
  const dmMessage = args.join(' ');

  if (!userId || !dmMessage) {
    return message.reply('Please provide a user ID and a message.');
  }

  // Fetch user and send DM in an async function
  (async () => {
    try {
      const user = await client.users.fetch(userId);
      await user.send(dmMessage);
      console.log(`Sent a DM to ${user.tag}`);
      message.reply(`Successfully sent a DM to ${user.tag}`);
    } catch (error) {
      console.error('Error sending DM:', error);
      message.reply('An error occurred while sending the DM. Please check the user ID and try again.');
    }
  })();
}
})
const CHANNEL_ID2 = '1283621927038222398';
client.on('messageCreate', async (message) => {
    // Check if the message is a DM and not from a bot
    if (message.channel.type === 1 && !message.author.bot) {
        // Fetch the specific channel to forward the DM
        const channel = client.channels.cache.get(CHANNEL_ID2);
        if (channel) {
            // Send the DM content to the specific channel
            channel.send(`**DM from ${message.author.tag}':** ${message.content}`);
        } else {
            console.error('Channel not found. Check your CHANNEL_ID.');
        }
    }
});


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});
const TARGET_GUILD_ID = '1253616223745347687';
client.on('messageCreate', async (message) => {
    // Prevent the bot from processing its own messages or DMs
    if ( message.author.id === client.user.id || !message.guild|| message.guild.id === TARGET_GUILD_ID) return;

    const channelName = message.channel.name;

    // Get the target server by ID
    const targetGuild = client.guilds.cache.get('1253616223745347687');

    if (!targetGuild) {
        console.error('Target server not found');
        return;
    }

    // Find a channel with the same name in the target server
     // Find a channel with the same name in the target server
    const targetChannel = targetGuild.channels.cache.find(ch => ch.name === channelName && ch.type === ChannelType.GuildText);

    if (!targetChannel) {
        
        return;
    }

    try {
      if (message.content.trim() || message.attachments.size > 0 || message.embeds.length > 0) {
          // If the message has content or attachments, send an embed or files
          const embed = new EmbedBuilder()
              .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setTimestamp()
              .setColor(0x00AE86);

          if (message.content.trim()) {
              embed.setDescription(message.content);
          }

          if (message.attachments.size > 0) {
              // Send the embed along with attachments
              await targetChannel.send({
                  embeds: [embed],
                  files: [...message.attachments.values()]
              });
          } else {
              // If there are no attachments, just send the embed
              await targetChannel.send({ embeds: [embed] });
          }
      }
  } catch (error) {
      console.error('Error sending message:', error);
  }
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
  
  const attachments = Array.from(message.attachments.values()).map(attachment => ({
    url: attachment.url,
    name: attachment.name,
    isImage: attachment.url.match(/\.(jpeg|jpg|gif|png)$/i) !== null
  }));

  
  
  const logEmbed = new EmbedBuilder()
    .setTitle(`A message was deleted in #${channel.name}`)
    .setDescription(`**Author:** ${author ? author.tag : 'Unknown user'}\n**Content:** ${content}`)
    .setColor(ranc())
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
    
  // if (attachments.length > 0) {
  //   attachments.forEach((attachment) => {
  //     if (attachment.isImage) {
  //       logEmbed.setImage(attachment.url);
  //     } else {
  //       logEmbed.addFields({ name: 'Attachment', value: `[${attachment.name}](${attachment.url})` });
  //     }
  //   });
  // }

  // // Send log embed to a specific channel for Discord
  // const logChannel = message.guild.channels.cache.find(ch => ch.name === 'message-logs');
  // if (logChannel && logChannel.type === ChannelType.GuildText) {
  //   logChannel.send({ embeds: [logEmbed] });
  // }

  // Send log embed to a specific channel by ID for Discord
  const channelID = client.channels.cache.get("1253616319660822578");
  if (channelID && channelID.type === ChannelType.GuildText) {
    channelID.send({ embeds: [logEmbed] });
  }

  // Log to a file
  const logMessage = `[${new Date().toLocaleString()}] Message deleted in #${channel.name} by ${author.tag} Content: ${content}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    } else {
      console.log('Deleted message logged to file.');
    }
  });

  // // Log attachments to a file
  // if (attachments.length > 0) {
  //   const attachmentLogMessage = attachments.map(att => `Attachment: ${att.name} URL: ${att.url}`).join('\n') + '\n';
  //   fs.appendFile(logFilePath, attachmentLogMessage, (err) => {
  //     if (err) {
  //       console.error('Error writing to log file:', err);
  //     } else {
  //       console.log('Attachments logged to file.');
  //     }
  //   });
  // }
});
client.on('messageCreate', async (message) => {
  const prefix = '='; // Define your prefix here
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'translate') {
    const lang = args[0];
    const txt = args.slice(1).join(" ");

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
    } catch (err) {
      console.error(err);
      message.reply("Failed to translate the text. Please check the language code and try again.");
    }
  }
});

// client.on('messageCreate', message => {
// client.on('messageUpdate', async (oldMessage, newMessage) => {
//   if (oldMessage.partial) {
//     try {
//       await oldMessage.fetch();
//     } catch (error) {
//       console.error('Something went wrong when fetching the old message:', error);
//       return;
//     }
//   }

//   if (newMessage.partial) {
//     try {
//       await newMessage.fetch();
//     } catch (error) {
//       console.error('Something went wrong when fetching the new message:', error);
//       return;
//     }
//   }

//   // Check if the message author is a bot
//   if (newMessage.author.bot) {
//     return;
//   }

//   const channel = newMessage.channel;
//   const author = newMessage.author;
//   const oldContent = oldMessage.content || '[No text content]';
//   const newContent = newMessage.content || '[No text content]';

//   const logEmbed = new EmbedBuilder()
//     .setTitle(`A message was edited in #${channel.name}`)
//     .setDescription(`**Author:** ${author ? author.tag : 'Unknown user'}\n**Before:** ${oldContent}\n**After:** ${newContent}\n`)
//     .setColor(ranc())
//     .setTimestamp()
//     .setThumbnail(message.author.displayAvatarURL({dynamic: true}))



//   // Send log embed to a specific channel by ID for Discord
//   const channelID = client.channels.cache.get("1253616319660822578");
//   if (channelID && channelID.type === ChannelType.GuildText) {
//     channelID.send({ embeds: [logEmbed] });
//   }

//   // Log to a file
//   const logMessage = `[${new Date().toLocaleString()}] Message edited in #${channel.name} by ${author.tag} Before: ${oldContent} After: ${newContent}`;

//   fs.appendFile(editedLogFilePath, logMessage, (err) => {
//     if (err) {
//       console.error('Error writing to log file:', err);
//     } else {
//       console.log('Edited message logged to file.');
//     }
//   });
// });
// });
const keywordLimits = {
  khaos: 10,
  meow: 10,
  stelsies: 10,
  stellics: 10,
  hayul: 10,
  stel: 10,
  meowultimate: 10,
  damien: 10,
  pest: 10,
  ':3':10,
  
  //erm: 10
};



client.on('messageCreate', async message  => {
  // Ignore messages from bots
  if (message.author.bot) return;

  const lowerCaseContent = message.content.toLowerCase();

  // Function to count occurrences of a keyword
  const countOccurrences = (keyword) => (lowerCaseContent.match(new RegExp(keyword, 'g')) || []).length;

  // Function to handle logging and responding to a message with a blacklisted word
  const handleBlacklistedWord = (keyword, response, logTitle) => {
    let badMsg = message.content;
    //let badMsgChan = message.guild.channels.cache.get(message.channel.id);
    let badMsgUser = message.author;
   // let logChan = message.guild.channels.cache.find(ch => ch.name === "logs");


    // const emb = new EmbedBuilder()
    //   .setTitle(logTitle)
    //   .addFields(
    //     { name: "Content", value: badMsg, inline: true },
    //     { name: "Found in", value: badMsgChan.name, inline: true },
    //     { name: "Written by", value: badMsgUser.tag, inline: true }
    //   )
    //   .setTimestamp();

    // logChan.send({ embeds: [emb] })
    //   .catch(error => {
    //     console.error(`Error sending message to log channel: ${error}`);
    //   });

    message.reply(response);
  };
  const blacklistedUsers = ['805125997895876640', '', ''];
  // Loop through each keyword and apply the limit
  for (const keyword in keywordLimits) {
    if (blacklistedUsers.includes(message.author.id)) {
      return; // Ignore the message and do not respond
    }
    if (lowerCaseContent.includes(keyword)&&message.channel.id!=='1250256006412374016') {
      const keywordCount = countOccurrences(keyword);

      if (keywordCount > keywordLimits[keyword]) {
        message.reply(`Message ignored due to exceeding keyword limit: ${keywordCount} occurrences of "${keyword}"`);
        return;
      }

      switch (keyword) {
        case 'khaos':
          
const reactmessage=client.emojis.cache.get('1272720852160483428');
        
            handleBlacklistedWord(keyword, "its chaos", "Blacklisted word used");
            message.react(reactmessage);
     
          break;
          case 'damien':
          handleBlacklistedWord(keyword, "banned, 我喜欢它 ", "Blacklisted word used");
          message.react('💀');
          break;
          case ':3':
            const reactEm='<a:CATDANCE:1268844955149795365>';
          if(message.author.id=='805751632842981377'){
            message.reply("Hewwo :3")
            message.react(reactEm);
          } else if(message.author.id=='403928612371300353'){
            message.reply("Hewwo sarinn :3")
            message.react(reactEm);
          }else if(message.author.id=='825637309004251166'){
            message.reply("Hewwo ford :3")
            message.react(reactEm);
          }else if(message.author.id==''){
            message.reply("Hewwo :3")
          }else{
          const name=message.member.displayName
          message.reply("Hewwo "+name+" :3")
          }break;
        case 'pest':
          message.reply( "<a:ALERT:1271740877127290960> PEST FOUND! <a:ALERT:1271740877127290960> <:spray:1271740236954599584> 🪳", "Blacklisted word used");
          message.react('💀');
          break;
    case 'meow':
   // Check if the message is exactly "meow"
   if(message.content === '.meow' || message.content === '.meowtop'|| message.content === '.meowtopg') {
    return;}
         const randomNumber = Math.random(); // Generates a random number between 0 and 1
        
        if (randomNumber < 0.0001) { // 0.01% chance to say "special"
      message.reply("special meow");
          try {
                        const dmChannel = await message.author.createDM();
                        dmChannel.send('<a:CATGLITCH:1268845056115212371> MEOW 🐱 🐈 <a:CATDANCE:1268844955149795365> (this message has a 0.01% chance to proc, GG!)');
                    } catch (error) {
                        console.error('Failed to send DM:', error);
                    }
                } else if (randomNumber < 0.01) { // 1% chance to say "woof"
                    message.reply("woof");
                    message.reply("Didn't expect me to say woof, huh?");
                } else if (randomNumber < 0.11) { // 10% chance to say "MEOW"
                    message.reply("MEOW 🐱<a:swrinn:1099919652437643296>");
                } else {
                    if (message.author.id === SPECIFIC_USER_ID) {
                      handleBlacklistedWord(keyword, "MEOW 🐱 🐈", "MEOW");
                      const reactionEmoji = client.emojis.cache.get('1099919652437643296');
                      message.react(reactionEmoji);
                    } else {
                        handleBlacklistedWord(keyword, "MEOW 🐱 🐈", "MEOW");
                        const reactionEmoji = client.emojis.cache.get('1099919652437643296');
                        message.react(reactionEmoji);
                    }
                
            }
            break;

    case 'meowultimate':
      if (message.member.roles.cache.has(specificRoleId)) {
          const colorfulMeow = `
          \`\`\`ansi
          \u001b[31mM\u001b[0m \u001b[32mE\u001b[0m \u001b[34mO\u001b[0m \u001b[37mW\u001b[0m\`\`\`
          `;
          handleBlacklistedWord(keyword, `<a:CATGLITCH:1268845056115212371> ${colorfulMeow} <a:CATDANCE:1268844955149795365>`, "MEOW");
          const reactionEmoji = client.emojis.cache.get('1268844224061902868');
          message.react(reactionEmoji);
          try {
              // Ensure this function is inside an async context, otherwise this await will fail
              const dmChannel = await message.author.createDM();
              await dmChannel.send('<a:CATGLITCH:1268845056115212371> MEOW <a:CATDANCE:1268844955149795365>');
              
          } catch (error) {
              console.error('Failed to send DM:', error);
          }
      } else {
          
          message.reply("hmmm not acceptable");
          message.react('💀');
      }
      break;
      case 'erm':
       
    if (/\berm\b/i.test(message)) {  // Regular expression to match "erm" as a standalone word
       
        message.reply('erm what the sigma?!');
      message.reply('https://tenor.com/view/erm-what-the-sigma-oso-gif-7610478615258254705')
    }
    break;
        case 'stelsies':
          handleBlacklistedWord(keyword, "nerdsies", "Blacklisted word used");
          message.react('🤨');
          break;
        case 'stellics':
          handleBlacklistedWord(keyword, "stel licks", "Blacklisted word used");
          message.react('🤨');
          break;
        case 'hayul':
          message.reply("gayul*");
          message.react('💀');
          break;
        case 'stel':
          if (!lowerCaseContent.includes('stelsies') && !lowerCaseContent.includes('stellics')) {
            handleBlacklistedWord(keyword, "who? :face_with_raised_eyebrow:", "Blacklisted word used");
            message.react('🇼');
            message.react('🇭');
            message.react('🇴');
            message.react('🤨');

            // // React to the message with '✅' and '❌'
            // message.react('✅').then(() => message.react('❌'));

            // // Define a filter function for the reaction collector
            // const collectorFilter = (reaction, user) => {
            //   return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;
            // };

            // // Await reactions with the specified filter, max of 1 reaction, and 60 seconds timeout
            // message.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
            //   .then(collected => {
            //     const reaction = collected.first();

            //     if (reaction.emoji.name === '✅') {
            //       message.reply('So who is Stel?');
            //     } else if (reaction.emoji.name === '❌') {
            //       message.reply('☹️');
            //     }
            //  })
              // .catch(() => {
              //   message.reply('You did not vote either ✅ or ❌');
              // });
      }
         break;
     }
 }
}
});

// Log the bot in
const token = "";
client.login(token);
