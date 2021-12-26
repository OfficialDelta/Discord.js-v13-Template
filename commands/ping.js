const ApplicationCommand = require('../templates/ApplicationCommand')

module.exports = new ApplicationCommand({
    name: 'ping',
    description: 'Replies with Pong!',
    type: 'CHAT_INPUT',
    async execute(interaction) {
        await interaction.reply('Pong!')
    }
})