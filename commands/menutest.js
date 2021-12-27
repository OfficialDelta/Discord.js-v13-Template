const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const ApplicationCommand = require('../templates/ApplicationCommand')
const Menu = require('../templates/Menu')

module.exports = new ApplicationCommand({
    name: 'menutest',
    description: 'A test command for menus',
    type: 'CHAT_INPUT',
    async execute(interaction) {
        const menu = new Menu(interaction.channel, interaction.user.id, [
            {
                name: '1',
                content: new MessageEmbed()
                    .setTitle('Menu Test 1')
                    .setDescription('This is a test menu!')
                    .setColor('#0099ff')
                    .setFooter('Page 1'),
                actionRows: [
                    new MessageActionRow()
                        .addComponents([
                            new MessageButton()
                                .setCustomId('right')
                                .setEmoji('➡')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('stop')
                                .setEmoji('⏹')
                                .setStyle('SECONDARY')
                        ])
                ],
                buttonActions: [
                    {
                        customId: 'right',
                        action: '2'
                    },
                    {
                        customId: 'stop',
                        action: 'stop'
                    }
                ]
            },
            {
                name: '2',
                content: new MessageEmbed()
                    .setTitle('Menu Test 2')
                    .setDescription('This is a test menu!')
                    .setColor('#0099ff')
                    .setFooter('Page 2'),
                actionRows: [
                    new MessageActionRow()
                        .addComponents([
                            new MessageButton()
                                .setCustomId('left')
                                .setEmoji('⬅')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('stop')
                                .setEmoji('⏹')
                                .setStyle('SECONDARY')
                        ])
                ],
                buttonActions: [
                    {
                        customId: 'left',
                        action: '1'
                    },
                    {
                        customId: 'stop',
                        action: 'stop'
                    }
                ]
            }
        ], 60 * 1000, 15 * 1000, interaction)

        menu.start()
    }
})