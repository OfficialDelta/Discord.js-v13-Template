module.exports = {
    async execute(interaction) {
        const input = interaction.options.get('input')?.value ?? false

        const response = input ? `You inputted: ${input}` : "You didn't input anything"

        interaction.reply(response)
    },
}
