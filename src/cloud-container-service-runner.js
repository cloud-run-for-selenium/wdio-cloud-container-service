// cloud-container-service-runner.js


module.exports = function (config, capabilities, opts, headers, _https, _process, _hook) {
    _https = typeof(_https) === 'undefined' ? require('https') : _https;
    _process = typeof(_process) === 'undefined' ? process : _process;
    const wdioLogger = require('@wdio/logger').default;
    const logger = wdioLogger('wdio-cloud-container-service');
    
    var attempts = 0;
    logger.warn('Warming up Cloud Container host at: ' + config.hostname + '...');
    const webdriverPath = config.path === undefined ? '' : config.path;
    
    return new Promise((resolve, reject) => {
        if(typeof(_hook) === 'undefined')
            _hook = {};
        _hook.reject = reject;
        _hook.healthCheckInterval = setInterval(() => {
            logger.log(`${config.protocol}://${config.hostname}:${config.port}${webdriverPath}/status`);
            _https.get(`${config.protocol}://${config.hostname}:${config.port}${webdriverPath}/status`, {
                headers: headers
            }, res => {
                if (++attempts > opts.maxAttempts) {
                    logger.error('Problem launching Cloud Container service. Status: ' + res.statusCode);
                    clearInterval(_hook.healthCheckInterval);
                    reject(new Error('Cloud Container Service failed'));
                    return;
                }
                let data = [];
                logger.debug('Status Code:', res.statusCode);

                res.on('data', chunk => {
                    data.push(chunk);
                });

                res.on('end', () => {
                    logger.debug('Response received...');
                    if (res.statusCode >= 200 && res.statusCode < 400) {
                        clearInterval(_hook.healthCheckInterval);
                        resolve({ statusCode: res.statusCode });
                    } else {
                        logger.warn('Waiting for Cloud Container service to launch... Status code: ' + res.statusCode);
                    }
                });
            }).on('error', err => {
                logger.error('Error: ', err.message);
                reject(err.message);
            });
        }, opts.retryTimeout);
    }).catch((err) => {
        logger.error('SEVERE: Cloud Container service failed to launch. Exiting...')
        _process.exit(1);
    });
}
