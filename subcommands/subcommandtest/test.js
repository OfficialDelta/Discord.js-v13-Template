module.exports = {
    async execute(interaction) {
        const input = interaction.options.get('input') ?? false

        const response = input ? `You inputted: ${input}` : "You didn't input anything"

        interaction.reply(response)
    },
}