const expect = require('chai').expect;

describe('Cloud Container Service Runner Tests', () => {

    it('should stop when 200 is received', function (done) {
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
            exit: function () {
                console.error('exit SHOULD NOT be called to terminate WebdriverIO...');
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

    it('should stop when retryAttempts is exceeded', function (done) {
        this.timeout(5000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        options.retryTimeout = 200;

        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers((() => {
            const arr = [];
            for (var i = 0; i < 8; i++) {
                arr.push(mock502Response(_https));
            }
            return arr;
        })(), done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const EXPECTED_REQUESTS = 5;
        const _process = {
            exit: function () {
                console.error('exit is called to terminate WebdriverIO...');
                expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
                done();
            }
        }
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            //console.debug('containerServiceRunner.then invoked');
            if (res && res.statusCode)
                expect(res.statusCode).to.equal(502);
            expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
        }).catch((err) => {
            done(err);
        });
    });

    it('should stop when retryAttempts is exceeded when it is 20 attempts', function (done) {
        this.timeout(10000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        options.retryTimeout = 200;
        options.maxAttempts = 20;

        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers((() => {
            const arr = [];
            for (var i = 0; i < 23; i++) {
                if (i === 3)
                    arr.push(mock401Response(_https));
                else
                    arr.push(mock502Response(_https));
            }
            return arr;
        })(), done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const EXPECTED_REQUESTS = 20;
        const _process = {
            exit: function () {
                console.error('exit is called to terminate WebdriverIO...');
                expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
                done();
            }
        }
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            //console.debug('containerServiceRunner.then invoked');
            if (res && res.statusCode)
                expect(res.statusCode).to.equal(502);
            expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
        }).catch((err) => {
            done(err);
        });
    });


    it('should stop when retryAttempts is exceeded for 401 errors', function (done) {
        this.timeout(5000);
        const config = getDefaultConfig();
        const headers = getDefaultHeaders();
        const options = getDefaultOptions();
        options.retryTimeout = 200;

        const _https = require('./http.mock');
        const _modHook = {};
        _https.setGetterHandlers((() => {
            const arr = [];
            for (var i = 0; i < 8; i++) {
                if (i === 3)
                    arr.push(mock502Response(_https));
                else
                    arr.push(mock401Response(_https));
            }
            return arr;
        })(), done, _modHook);

        const containerServiceRunner = require('../src/cloud-container-service-runner');
        const EXPECTED_REQUESTS = 5;
        const _process = {
            exit: function () {
                console.error('exit is called to terminate WebdriverIO...');
                expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
                done();
            }
        }
        containerServiceRunner(config, undefined, options, headers, _https, _process, _modHook).then((res) => {
            //console.debug('containerServiceRunner.then invoked');
            if (res && res.statusCode)
                expect(res.statusCode).to.equal(401);
            expect(_https.getNumberOfRequests()).to.equal(EXPECTED_REQUESTS);
        }).catch((err) => {
            done(err);
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
