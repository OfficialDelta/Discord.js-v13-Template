const BaseCommand = require('./BaseCommand')

/**
 * Represents a Slash Command
 */
module.exports = class SlashCommand extends BaseCommand {
    /**
     * @param {{name: String, description: String, permissions: {id: String, type: ('USER'|'ROLE'), permission: Boolean}[], options: {name: String, description: String, type: ('SUB_COMMAND'|'SUB_COMMAND_GROUP'|'STRING'|'INTEGER'|'NUMBER'|'BOOLEAN'|'USER'|'CHANNEL'|'ROLE'|'MENTIONABLE'), required: Boolean}[], execute: Function}} options - The options for the slash command
     */
    constructor(options) {
        super(options)
        this.permissions = options.permissions
        this.options = options.options
    }

    /**
     * @param {{id: String, type: ('USER'|'ROLE'), permission: Boolean}[]} permissions - The permissions
     */
    setPermissions(permissions) {
        this.permissions = permissions
    }
    /**
     * @param {{name: String, description: String, type: ('SUB_COMMAND'|'SUB_COMMAND_GROUP'|'STRING'|'INTEGER'|'NUMBER'|'BOOLEAN'|'USER'|'CHANNEL'|'ROLE'|'MENTIONABLE'), required: Boolean}[]} options - The options
     */
    setOptions(options) {
        this.options = options
    }
}
