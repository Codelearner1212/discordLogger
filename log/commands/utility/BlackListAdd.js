const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Use EmbedBuilder instead of MessageEmbed in v14
const fs = require('fs');
const path = require('path');
function ranc() {
    var col = ["#000000", "#1ABC9C", "#11806A", "#57F287", "#1F8B4C", "#3498DB", "#206694", "#9B59B6", "#71368A", "#E91E63", "#AD1457", "#F1C40F", "#C27C0E", "#E67E22", "#A84300", "#ED4245", "#992D22", "#95A5A6", "#979C9F", "#7F8C8D", "#BCC0C0", "#34495E", "#2C3E50", "#FFFF00"]
    var rnd = Math.floor(Math.random() * col.length);
    return(col[rnd])
  }
module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklistadd')
        .setDescription('Add a user to the blacklist')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to blacklist')
                .setRequired(true)),
    
    async execute(interaction) {
        const requiredRole = '1257162374344085645'; // Replace with your specific role ID
        const userToBlacklist = interaction.options.getUser('user');

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Path to the Blacklist.txt file
        const blacklistFilePath = path.join(__dirname, 'Blacklist.txt');

        // Add the user ID to the Blacklist.txt file
        fs.appendFile(blacklistFilePath, `${userToBlacklist.id}\n`, (err) => {
            if (err) {
                console.error('Failed to write to Blacklist.txt:', err);
                return interaction.reply({ content: 'Failed to add the user to the blacklist.', ephemeral: true });
            }

            // Send a message to a specific channel with the blacklisted user's profile and ID
            const blacklistChannelId = '1277107161021022270'; // Replace with your specific channel ID
            const blacklistChannel = interaction.client.channels.cache.get(blacklistChannelId);

            if (!blacklistChannel) {
                return interaction.reply({ content: 'Blacklist channel not found.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('User Blacklisted')
                .setDescription(`**User:** ${userToBlacklist.tag}\n**ID:** ${userToBlacklist.id}`)
                .setThumbnail(userToBlacklist.displayAvatarURL({ dynamic: true }))
                .setColor(ranc())
                .setTimestamp();

            blacklistChannel.send({ embeds: [embed] });

            interaction.reply({ content: `User ${userToBlacklist.tag} has been blacklisted.`, ephemeral: true });
        });
    },
};
