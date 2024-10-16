const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json'); // Make sure you have your token and clientId

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Started fetching application (/) commands.');

        // Fetch all global commands
        const commands = await rest.get(Routes.applicationCommands(clientId));

        console.log(`Fetched ${commands.length} global application (/) commands.`);

        // Define the commands you want to keep
        const commandsToKeep = ['yourCommand1', 'yourCommand2']; // Replace with command names you want to keep

        // Loop through each command and delete it if it's not in the commandsToKeep list
        for (const command of commands) {
            if (!commandsToKeep.includes(command.name)) {
                console.log(`Deleting command: ${command.name}`);

                await rest.delete(Routes.applicationCommand(clientId, command.id));
                console.log(`Successfully deleted command: ${command.name}`);
            }
        }

        console.log('Finished deleting unused application (/) commands.');
    } catch (error) {
        console.error('Error deleting commands:', error);
    }
})();
