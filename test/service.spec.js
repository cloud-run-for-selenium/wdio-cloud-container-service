const expect = require('chai').expect;
const WdioBrowserSpy = require('./wdio-browser-spy');
const CloudContainerService = require('../src/service');

describe('Cloud Container Service Runner Tests', () => {    

    it('should call browser.pause only if requestIntervalTime is a positive integer 1', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService({ requestIntervalTime: 1 });
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.true;
        expect(browserSpy.pauseCalledWith()).to.equal(1);
    });

    it('should call browser.pause only if requestIntervalTime is a positive integer 100', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService({ requestIntervalTime: 100 });
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.true;
        expect(browserSpy.pauseCalledWith()).to.equal(100);
    });

    it('should NOT call browser.pause if requestIntervalTime is unset', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService();
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.false;
    });

    it('should NOT call browser.pause if requestIntervalTime is null', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService({ requestIntervalTime: null });
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.false;
    });

    it('should NOT call browser.pause if requestIntervalTime is negative', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService({ requestIntervalTime: -1 });
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.false;
    });

    it('should NOT call browser.pause if requestIntervalTime is zero', () => {
        const browserSpy = new WdioBrowserSpy();

        const cloudContainerService = new CloudContainerService({ requestIntervalTime: 0 });
        cloudContainerService.beforeCommand();
        expect(browserSpy.isPauseCalled()).to.be.false;
    });

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
