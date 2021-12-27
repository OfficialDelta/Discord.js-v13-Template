const BaseCommand = require('./BaseCommand')

/**
 * ApplicationCommand options property
 * @typedef {{
     *      name: String,
     *      description: String,
     *      type: ('SUB_COMMAND'|'SUB_COMMAND_GROUP'|'STRING'|'INTEGER'|'NUMBER'|'BOOLEAN'|'USER'|'CHANNEL'|'ROLE'|'MENTIONABLE'),
     *      choices?: ({
     *          name: String,
     *          value: (String|Number)
     *      }[]|undefined),
     *      options?: (ApplicationCommandOptions[]|undefined),
     *      channel_types: (('GUILD_TEXT'|'DM'|'GUILD_VOICE'|'GROUP_DM'|'GUILD_CATEGORY'|'GUILD_NEWS'|'GUILD_STORE'|'GUILD_NEWS_THREAD'|'GUILD_PUBLIC_THREAD'|'GUILD_PRIVATE_THREAD'|'GUILD_STAGE_VOICE')[]|undefined),
     *      min_value?: (Number|undefined),
     *      max_value?: (Number|undefined),
     *      autocomplete?: (Boolean|undefined),
     *      required: Boolean
     *  }} ApplicationCommandOptions
 */

/**
 * Represents a Slash Command
 */
module.exports = class ApplicationCommand extends BaseCommand {
    /**
     * @param {{
     *      name: String, 
     *      description: String,
     *      permissions?: ({
     *          id: String,
     *          type: ('USER'|'ROLE'),
     *          permission: Boolean
     *      }[]|undefined),
     *      options?: (ApplicationCommandOptions[]|undefined),
     *      defaultPermission?: (Boolean|undefined),
     *      type: 'CHAT_INPUT'|'USER'|'MESSAGE',
     *      execute: (interaction: import('discord.js').CommandInteraction) => Promise<void>
     *  }} options - The options for the slash command
     */
    constructor(options) {
        super(options)
        this.permissions = options.permissions
        this.options = options.options ?? []
        this.type = options.type ?? 'CHAT_INPUT'
        this.defaultPermission = options.defaultPermission ?? true
    }

    /**
     * @param {{
     *      id: String,
     *      type: ('USER'|'ROLE'),
     *      permission: Boolean
     *  }[]} permissions - The permissions
     */
    setPermissions(permissions) {
        this.permissions = permissions
    }
    /**
     * @param {{
     *      name: String,
     *      description: String,
     *      type: ('SUB_COMMAND'|'SUB_COMMAND_GROUP'|'STRING'|'INTEGER'|'NUMBER'|'BOOLEAN'|'USER'|'CHANNEL'|'ROLE'|'MENTIONABLE'),
     *      required: Boolean
     *  }[]} options - The options
     */
    setOptions(options) {
        this.options = options
    }
}
