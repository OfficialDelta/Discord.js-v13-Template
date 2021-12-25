const ApplicationCommand = require('../templates/ApplicationCommand')

module.exports = new ApplicationCommand({
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(interaction) {
        await interaction.reply('Pong!')
    },
})