const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-cloud-container-service')

class CloudContainerLauncher {

    constructor(serviceOptions, capabilities, config) {

        this.options = serviceOptions ? serviceOptions : {}
        if (!this.options.retryTimeout)
            this.options.retryTimeout = 4000
        if (!this.options.maxAttempts)
            this.options.maxAttempts = 5


        logger.warn(`initialize wdio-cloud-container-service launcher class...`)
        this.config = config

        this.headersNotSpecifiedInConfig = function () {
            return typeof (this.config.headers) === 'undefined'
        }
    }

    onWorkerStart(cid, caps, specs, args, execArgv) {
        if (this.headersNotSpecifiedInConfig())
            includeDefaultHeadersInWdioConfig()


        function includeDefaultHeadersInWdioConfig() {
            args.headers = {}
            args.headers.authorization = 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
        }
    }

    onPrepare(config, capabilities) {
        this.headers = {}

        if (this.headersNotSpecifiedInConfig())
            this.headers.authorization = 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
        else
            this.headers = config.headers

        const containerServiceRunner = require('./cloud-container-service-runner')
        return containerServiceRunner(config, capabilities, this.options, this.headers)
    }
}


module.exports = CloudContainerLauncher

