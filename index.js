const { Client, Intents, Collection } = require('discord.js')
const { readdirSync } = require('fs')
const { token } = require('./config.json') || process.env
const { prefix } = require('./config.json')

// Discord client object
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] })

// Set each command in the commands folder as a command in the client.commands collection
client.commands = new Collection()

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

// same as above but for message commands
client.msgCommands = new Collection()

const msgCommandFiles = readdirSync('./messageCommands').filter(file => file.endsWith('.js'))
for (const file of msgCommandFiles) {
    const command = require(`./messageCommands/${file}`)
    client.msgCommands.set(command.name, command)
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
    const commandName = args.shift().toLowerCase()

    const command = client.msgCommands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    // dynamic command handling
    if (!command) return

    try {
        command.execute(message, args)
    } catch (error) {
        console.error(error)
    }
})

client.login(token)
