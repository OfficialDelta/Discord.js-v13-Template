/**
 * Represents a SubCommand
 */
module.exports = class SubCommand {
    /**
     * 
     * @param {{execute: Function}} options - The options for the subcommand
     */
    constructor(options) {
        this.execute = options.execute
    }

    /**
     * @param {Function} executeFunction - The function
     */
    setExecute(executeFunction) {
        this.execute = executeFunction
    }
}