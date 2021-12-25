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

// Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(token)
