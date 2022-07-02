class WdioBrowserSpy {
    constructor() {
        this._pauseIsCalled = false;
        this._pauseCalledWith;
        global.browser = {
            pause: (interval) => {
                console.log('pause is called. marking as called...');
                this._pauseIsCalled = true;
                this._pauseCalledWith = interval;
            }
        }
    }

    isPauseCalled() {
        return this._pauseIsCalled;
    }

    pauseCalledWith() {
        return this._pauseCalledWith;
    }
}

module.exports = WdioBrowserSpy;