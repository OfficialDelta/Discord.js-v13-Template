const { Client, Intents, Collection } = require('discord.js')
const { readdirSync } = require('fs')
const { token, prefix } = require('./config.json')

// Discord client object
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

// Set each command in the commands folder as a command in the client.commands collection
client.commands = new Collection()
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

// Code that runs when the bot logs on
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

// Dynamically handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    if (!client.commands.has(interaction.commandName)) return

    try {
        await client.commands.get(interaction.commandName).execute(interaction)
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

// Non-slash commands, only recommended for deploy commands
client.on('messageCreate', async message => {
    // filters out bots and non-prefixed messages
    if (!message.content.startsWith(prefix) || message.author.bot) return

    // fetches the application owner for the bot
    if (!client.application?.owner) await client.application?.fetch()

    // get the arguments and the actual command name for the inputted command
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    // command for deploying slash commands, limited to the bot owner
    if (command === 'deploy' && message.author.id === client.application?.owner.id) {
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
    }
})

client.login(token)
