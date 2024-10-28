const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Replace 'YOUR_DISCORD_ID' with your actual Discord user ID
const REQUIRED_ROLE_ID = '1257162374344085645';
const SPECIFIC_USER_ID='805751632842981377';
module.exports = {
    data: new SlashCommandBuilder()
        .setName('search-deleted')
        .setDescription('Search for deleted messages')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user to search for')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message content to search for')
                .setRequired(false)),

    async execute(interaction) {
        try {
            // Check if the user is authorized to use the command
            if (!interaction.member.roles.cache.has(REQUIRED_ROLE_ID) && interaction.member.id !== SPECIFIC_USER_ID) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: false // Make the response ephemeral (only visible to the user)
                });
            }

            await interaction.deferReply(); // Defer the reply to acknowledge the command

            const user = interaction.options.getString('user');
            const messageContent = interaction.options.getString('message');

            if (!user && !messageContent) {
                return await interaction.editReply('Please provide a user or message content to search for.');
            }

            const logFilePath = 'C:\\Users\\Administrator\\Downloads\\log\\duels ekittens\\deleted_messages.log';
            const data = fs.readFileSync(logFilePath, 'utf-8');
            const logEntries = data.split('\n').filter(line => line.trim() !== '');

            let results = logEntries;

            if (user) {
                results = results.filter(entry => {
                    const userMatch = entry.match(/deleted in #[^\s]* by (.+?) Content:/);
                    const username = userMatch ? userMatch[1].trim() : '';
                    return username.toLowerCase().includes(user.toLowerCase());
                });
            }

            if (messageContent) {
                results = results.filter(entry => {
                    const contentMatch = entry.match(/Content: (.*)/);
                    const content = contentMatch ? contentMatch[1].trim() : '';
                    return content.toLowerCase().includes(messageContent.toLowerCase());
                });
            }

            if (results.length === 0) {
                return await interaction.editReply('No deleted messages found matching your criteria.');
            }

            // Prepare the response by formatting each entry
            const formattedResults = results.map(entry => {
                const dateMatch = entry.match(/^\[(.*?)\]/);
                const channelMatch = entry.match(/deleted in (#[^\s]*)/);
                const userMatch = entry.match(/deleted in #[^\s]* by (.+?) Content:/);
                const contentMatch = entry.match(/Content: (.*)/);

                const date = dateMatch ? dateMatch[1] : '[Unknown date]';
                const channel = channelMatch ? channelMatch[1] : '[Unknown channel]';
                const username = userMatch ? userMatch[1].trim() : '[Unknown user]';
                const content = contentMatch ? contentMatch[1].trim() : '[No text content]';

                return `[${date}] Message deleted in ${channel} written by ${username}\nContent: ${content}`;
            });

            // Create embeds for pagination
            const embeds = [];
            const itemsPerPage = 5; // Number of items per page
            for (let i = 0; i < formattedResults.length; i += itemsPerPage) {
                const embed = new EmbedBuilder()
                    .setTitle('Deleted Messages')
                    .setDescription(formattedResults.slice(i, i + itemsPerPage).join('\n\n'))
                    .setFooter({ text: `Page ${Math.floor(i / itemsPerPage) + 1} of ${Math.ceil(formattedResults.length / itemsPerPage)}` });
                embeds.push(embed);
            }

            // Custom pagination
            let currentPage = 0;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previousbtn')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('nextbtn')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Secondary)
                );

            const paginatedMessage = await interaction.editReply({
                embeds: [embeds[currentPage]],
                components: [row]
            });

            const collector = paginatedMessage.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 60000
            });

            collector.on('collect', async i => {
                if (i.customId === 'previousbtn') {
                    if (currentPage > 0) currentPage--;
                } else if (i.customId === 'nextbtn') {
                    if (currentPage < embeds.length - 1) currentPage++;
                }

                await i.update({
                    embeds: [embeds[currentPage]],
                    components: [row]
                });
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                paginatedMessage.edit({ components: [row] });
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while processing your request.');
        }
    },
};
