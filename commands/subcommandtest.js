module.exports = {
    name: 'subcommandtest',
    description: 'Test for sub commands',
    options: [
        {
            name: 'test',
            type: 'SUB_COMMAND',
            description: 'a test sub command',
            options: [
                {
                    name: 'input',
                    type: 'STRING',
                    description: 'input for the subcommand'
                }
            ]
        }
    ],
    async execute(interaction) {
        const commandName = interaction.options.getSubcommand()

        // find and execute the subcommand
        if (commandName === null) {
            interaction.reply({
                content: "I couldn't understand that command!",
                ephemeral: true,
            })
        } else {
            try {
                const command = require(`../subcommands/subcommandtest/${commandName}`)
                command.execute(interaction)
            } catch (error) {
                console.error(error)
                interaction.reply({
                    content: 'An error occured when attempting to execute that command!',
                    ephemeral: true,
                })
            }
        }
    },
}