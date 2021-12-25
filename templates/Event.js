/**
 * Represents an Event
 */
module.exports = class Event {
    /**
     * @param {{
     *      name: String,
     *      once: (Boolean|undefined),
     *      execute: Function
     *  }} object
     */
    constructor(options) {
        this.name = options.name
        this.once = options.once ?? false
        this.execute = options.execute
    }
}