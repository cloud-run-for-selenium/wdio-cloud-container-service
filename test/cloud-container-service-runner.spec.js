const expect = require('chai').expect;

describe('Cloud Container Service Runner Tests', () => {

    it('should stop when 200 is received', function(done) {
        this.timeout(5000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        
        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers([
            mock502Response(_https),
            mock502Response(_https),
            mock200Response(_https)
        ], done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const _process = {
            exit: function() {
                console.error('exit SHOULD NOT be called to terminate WebdriverIO...');
                //expect(true).to.equal(true);
                done(new Error('failed to receive 200 status code'));
            }
        }
        
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            console.log('status code = ' + res.statusCode);
            expect(res.statusCode, 'status code to be 200').to.equal(200);
            console.log('completed...')
            done();
        });
    });

    it('should stop when retryAttempts is exceeded', function(done) {
        this.timeout(5000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        options.retryTimeout = 200;
        
        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers([
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https),
            mock502Response(_https)
        ], done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const _process = {
            exit: function() {
                console.error('exit is called to terminate WebdriverIO...');
                //expect(true).to.equal(true);
                done();
            }
        }
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            //expect(res.statusCode).to.equal(502);
        });
    });


    it('should stop when retryAttempts is exceeded for 401 errors', function(done) {
        this.timeout(5000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        options.retryTimeout = 200;
        
        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers([
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https),
            mock401Response(_https)
        ], done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const _process = {
            exit: function() {
                console.error('exit is called to terminate WebdriverIO...');
                //expect(true).to.equal(true);
                done();
            }
        }
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            //expect(res.statusCode).to.equal(502);
        });
    });


    function mock502Response(_https) {
        return function (requestUrl, headers, callback) {
            var statusCode = 502;
            const res = _https.mockRes(statusCode);
            callback(res);
            return res;
        }
    }

    function mock200Response(_https) {
        return (requestUrl, headers, callback) => {
            var statusCode = 200;
            const res = _https.mockRes(statusCode);
            callback(res);
            return res;
        }
    }

    function mock401Response(_https) {
        return function (requestUrl, headers, callback) {
            var statusCode = 401;
            const res = _https.mockRes(statusCode);
            callback(res);
            return res;
        }
    }

    function getDefaultConfig() {
        const config = {
            'protocol': 'https',
            'hostname': 'test.com',
            'headers': {
                'authorization': 'Bearer token_here'
            },
            'port': 443,
            'path': '/wd/hub'
        };
        return config;
    }

    function getDefaultHeaders() {
        const headers = {
            'authorization': 'Bearer token_here'
        };
        return headers;
    }

    function getDefaultOptions() {
        return {
            retryTimeout: 200,
            maxAttempts: 5
        };
    }

});
