const SlashCommand = require('../templates/SlashCommand')

module.exports = new SlashCommand({
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(interaction) {
        await interaction.reply('Pong!')
    },
})