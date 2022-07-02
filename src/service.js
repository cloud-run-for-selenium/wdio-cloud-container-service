const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-cloud-container-service')

class CloudContainerService {

    constructor(serviceOptions, capabilities, config) {

        this.options = serviceOptions ? serviceOptions : {}
        if (typeof this.options.requestIntervalTime === 'string')
            this.options.requestIntervalTime = parseInt(this.options.requestIntervalTime)


        logger.warn(`initialize wdio-cloud-container-service service class...`)
        this.config = config
    }

    async beforeCommand(commandName, args) {
        if(typeof (this.options.requestIntervalTime) === 'number')
            await browser.pause(this.options.requestIntervalTime)
    }
}


module.exports = CloudContainerService

