const BaseCommand = require('./BaseCommand')

/**
 * Represents a Message Command
 */
class MessageCommand extends BaseCommand {
    /**
     * @param {{name: String, description: String, execute: Function}} options - The options for the message command
     */
    constructor(options) {
        super(options)
    }
}

module.exports = MessageCommand
