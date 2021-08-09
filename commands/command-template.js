module.exports = {
    name: 'command-name',
    description: 'command-description',
    permissions: [
        // example permissions
        {
            id: '123456789012345678',
            type: 'USER',
            permission: false,
        },
        {
            id: '464464090157416448',
            type: 'ROLE',
            permission: true,
        }
    ],
    options: [
        // 'arguments' for the slash command
        // example option
        {
            name: 'option-name',
            type: 'OPTION-TYPE',
            description: 'option-description',
            required: false,
        }
    ],
    async execute(interaction) {
        // code to run when the command is executed
        // example code
        await interaction.reply('Pong!')
    },
}