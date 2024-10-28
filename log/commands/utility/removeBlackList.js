const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeblacklist')
        .setDescription('Remove a user from the blacklist')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove from the blacklist')
                .setRequired(true)),

    async execute(interaction) {
        const requiredRole = '1257162374344085645'; // Replace with your specific role ID
        const userToRemove = interaction.options.getUser('user');
        const userIdToRemove = userToRemove.id;

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(requiredRole)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Path to the Blacklist.txt file
        const blacklistFilePath = path.join(__dirname, 'Blacklist.txt');

        // Read the blacklist file
        fs.readFile(blacklistFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Failed to read Blacklist.txt:', err);
                return interaction.reply({ content: 'Failed to read the blacklist file.', ephemeral: true });
            }

            // Split the file data into an array of user IDs
            let blacklist = data.split('\n').filter(id => id.trim() !== '');

            // Remove all occurrences of the specified user ID
            const initialLength = blacklist.length;
            blacklist = blacklist.filter(id => id !== userIdToRemove);

            if (blacklist.length === initialLength) {
                // User ID was not found
                return interaction.reply({ content: `User ${userToRemove.tag} was not found in the blacklist.`, ephemeral: true });
            }

            // Write the updated blacklist back to the file
            fs.writeFile(blacklistFilePath, blacklist.join('\n'), 'utf8', (err) => {
                if (err) {
                    console.error('Failed to write to Blacklist.txt:', err);
                    return interaction.reply({ content: 'Failed to update the blacklist file.', ephemeral: true });
                }

                // Send a confirmation message
                const blacklistChannelId = '1277107161021022270'; // Replace with your specific channel ID
                const blacklistChannel = interaction.client.channels.cache.get(blacklistChannelId);

                if (!blacklistChannel) {
                    return interaction.reply({ content: 'Blacklist channel not found.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('User Removed from Blacklist')
                    .setDescription(`**User:** ${userToRemove.tag}\n**ID:** ${userToRemove.id}`)
                    .setThumbnail(userToRemove.displayAvatarURL({ dynamic: true }))
                    .setColor(Colors.Green) // Use green for successful removal
                    .setTimestamp();

                blacklistChannel.send({ embeds: [embed] });

                interaction.reply({ content: `User ${userToRemove.tag} has been removed from the blacklist.`, ephemeral: true });
            });
        });
    },
};
