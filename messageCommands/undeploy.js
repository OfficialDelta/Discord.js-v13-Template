const { prefix } = require('../config.json')
const MessageCommand = require('../templates/MessageCommand')

module.exports = new MessageCommand({
    name: 'undeploy',
    description: 'Undeploys the slash commands',
    async execute(message, args) {
        if (message.author.id !== client.application?.owner.id) return
        if (args.length < 1)
            return message.reply(
                `Incorrect number of arguments! The correct format is \`${prefix}undeploy <guild/global>\``
            )

        if (args[0].toLowerCase() === 'global') {
            // global undeployment

            // undeploy the commands
            await client.application?.commands.set([])

            message.reply('Undeploying!')
        } else if (args[0].toLowerCase() === 'guild') {
            // guild deployment

            // undeploy the commands
            await message.guild?.commands.set([])

            message.reply('Undeploying!')
        }
    },
})
