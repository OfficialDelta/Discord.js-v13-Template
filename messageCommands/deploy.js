const { readdirSync } = require('fs')
const { prefix } = require('../config.json')

module.exports = {
    name: 'deploy',
    description: 'Deploys the slash commands',
    async execute(message, args) {
        if (message.author.id === client.application?.owner.id) return
        if (args.length < 1) return message.reply(`Incorrect number of arguments! The correct format is \`${prefix}deploy <guild/global>\``)

        if (args[0].toLowerCase() === 'global') {
            // global deployment

            let commandData = []
            let permissionsData = []
            let inGuild = message.guildId ? true : false

            const files = readdirSync('./commands').filter(file => file.endsWith('.js'))

            // loop through each file and filter for the command and permissions data
            for (const file of files) {
                delete require.cache[require.resolve(`./commands/${file}`)]

                const commandInfo = require(`./commands/${file}`)

                permissionsData.push({
                    name: commandInfo.name,
                    permissions: commandInfo.permissions ?? []
                })

                delete commandInfo.execute
                delete commandInfo.permissions

                commandData.push(commandInfo)
            }

            // deploy the commands
            const commands = await client.application?.commands.set(commandData)

            if (inGuild) {
                // set the permissions for each command for that guild (permissions will only work in said guild, if you need global permissions then you'll have to manually do it)
                for (const permissionInfo of permissionsData) {
                    const command = commands.find(command => command.name === permissionInfo.name)

                    command.permissions.set({
                        permissions: permissionInfo.permissions,
                        guild: message.guild
                    })
                }
            }

            message.reply('Deploying!')
        } else if (args[0].toLowerCase() === 'guild') {
            // guild deployment

            let commandData = []
            let permissionsData = []
            let inGuild = message.guildId ? true : false

            if (!inGuild) return message.reply('Do this in a guild!')

            const files = readdirSync('./commands').filter(file => file.endsWith('.js'))

            // loop through each file and filter for the command and permissions data
            for (const file of files) {
                delete require.cache[require.resolve(`./commands/${file}`)]

                const commandInfo = require(`./commands/${file}`)

                permissionsData.push({
                    name: commandInfo.name,
                    permissions: commandInfo.permissions ?? []
                })

                delete commandInfo.execute
                delete commandInfo.permissions

                commandData.push(commandInfo)
            }

            const commands = await message.guild?.commands.set(commandData)

            if (inGuild) {
                // set the permissions for each command for that guild
                for (const permissionInfo of permissionsData) {
                    const command = commands.find(command => command.name === permissionInfo.name)

                    command.permissions.set({
                        permissions: permissionInfo.permissions,
                        guild: message.guild
                    })
                }
            }

            message.reply('Deploying!')
        }
    },
}