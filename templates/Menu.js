const { EventEmitter } = require('events')

/**
 * Menu page
 * @typedef {{
 *      name: String,
 *      content: import('discord.js').MessageEmbed,
 *      actionRows: import('discord.js').MessageActionRow[],
 *      buttonActions: {
 *          customId: String,
 *          action: (Function|String)
 *      }[]
 *  }} MenuPage
 */

/**
 * Represents a menu
 */
module.exports = class Menu extends EventEmitter {
    /**
     * @param {import('discord.js').TextChannel} channel - The channel the menu will be sent in
     * @param {String} userId - The ID of the user who is allowed to interact with the menu
     * @param {MenuPage[]} pageArray - The pages of the menu
     * @param {Number} timeout - The timeout of the menu
     * @param {Number} idle - The idle time of the menu before it stops listening for button interactions
     * @param {import('discord.js').CommandInteraction} interaction - The interaction that triggered the menu
     * 
     * @remarks
     * Blacklisted page names are: `first, last, previous, next, stop, delete`.
     * These names perform special functions and should only be used as reaction destinations.
     */
    constructor(channel, userId, pageArray, timeout = 60 * 1000, idle = 15 * 1000, interaction) {
        super()
        this.channel = channel
        this.userId = userId
        this.pageArray = pageArray
        this.timeout = timeout
        this.idle = idle
        this.interaction = interaction ?? null

        if (!this.channel) throw new Error('Channel is required')
        if (!this.userId) throw new Error('User ID is required')
        if (!this.pageArray) throw new Error('Page array is required')
        if (!this.timeout) throw new Error('Timeout is required')
        if (!this.idle) throw new Error('Idle time is required')

        this.currentPage = this.pageArray[0]
        this.pageIndex = 0
    }

    /**
     * Sends the menu and starts listening for button interactions
     */
    async start() {
        this.emit('pageChange', this.currentPage)
        let menu

        if (!this.interaction) {
            menu = await this.channel.send({ embeds: [this.currentPage.content], components: this.currentPage.actionRows })
        } else {
            menu = await this.interaction.reply({ embeds: [this.currentPage.content], components: this.currentPage.actionRows, fetchReply: true })
        }

        this.menu = menu
        this.startButtons()
    }

    /**
     * Starts listening for button interactions
     */
    async startButtons() {
        /**
         * @param {import('discord.js').MessageComponentInteraction} i
         */
        const filter = i => i.user.id === this.userId

        /**
         * @type {import('discord.js').InteractionCollector}
         */
        this.collector = this.menu.createMessageComponentCollector({ filter, time: this.timeout, idle: this.idle })

        this.collector.on('collect', i => {
            i.deferUpdate()
            const customId = i.component.customId
            const action = this.currentPage.buttonActions.find(b => b.customId === customId).action

            if (typeof action === 'function') {
                return action()
            }

            switch (action) {
                case 'first':
                    return this.setPage(0)
                case 'last':
                    return this.setPage(this.pageArray.length - 1)
                case 'previous':
                    return this.setPage(this.pageIndex - 1)
                case 'next':
                    return this.setPage(this.pageIndex + 1)
                case 'stop':
                    return this.stop()
                case 'delete':
                    return this.delete()
                default:
                    return this.setPage(action)
            }
        })

        this.collector.on('end', () => {
            this.stop()
        })
    }

    /**
     * Stops listening for button interactions and removes the buttons from the menu
     */
    async stop() {
        this.collector?.stop()
        this.menu?.edit({ embeds: [this.currentPage.content], components: [] })
    }

    /**
     * Deletes the menu
     */
    async delete() {
        this.menu?.delete()
    }

    /**
     * Sets the current page to the page with the given index or name
     * @param {Number|String} page - The index or name of the page
     */
    async setPage(page = 0) {
        this.emit('pageChange', this.pageArray[page])

        if (typeof page === 'number') {
            this.pageIndex = page
            this.currentPage = this.pageArray[page]
        } else {
            this.pageIndex = this.pageArray.findIndex(p => p.name === page)
            this.currentPage = this.pageArray[this.pageIndex]
        }

        this.menu.edit({ embeds: [this.currentPage.content], components: this.currentPage.actionRows })
    }
}