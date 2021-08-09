const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'buttonstest',
    description: 'A test command for buttons',
    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary Button')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('secondary')
                    .setDisabled(true)
                    .setLabel('Disabled Secondary Button')
                    .setStyle('SECONDARY')
            ])

        const msg = await interaction.reply({ content: 'Buttons Test!', components: [row] })

        const filter = i => i.interaction.user.id === interaction.user.id

        const collector = msg.createMessageComponentCollector({ filter, time: 60000, idle: 15000, componentType: 'BUTTON' })

        collector.on('collect', i => {
            i.update({ content: `You clicked on ${i.customId}`, components: [row] })
        })

        collector.on('end', (collected, reason) => {
            msg.edit(`The collector ended for reason \`${reason}\`! You collected ${collected.size} interactions!`)
        })
    },
}