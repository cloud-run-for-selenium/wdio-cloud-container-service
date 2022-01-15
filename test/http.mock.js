// http.mock.js

var count = 0;
var hook = {};

// function get(requestUrl, headers, callback) {
//     var statusCode;
//     if (count < 2)
//         statusCode = 502;
//     else
//         statusCode = 200;
//     const res = mockRes(statusCode);
//     callback(res);
//     count++;
//     return res;
// }

function get(requestUrl, headers, callback) {
    if (count >= this.handlersArr.length) {
        const errorMsg = 'exceeded get request limit. Test fails.';
        console.error(errorMsg);
        console.log('healthCheckInterval = ' + hook.healthCheckInterval);
        clearInterval(hook.healthCheckInterval);
        hook.reject();
        return {
            on: () => { 
                console.error('rejected...');
            //    this.done(); 
            }
        };
        //hook.done(new Error(errorMsg));
        //throw new Error(errorMsg);
    }
    //     return () => { return 300; }; //'Exceeded number of get calls'; };
    return this.handlersArr[count++](requestUrl, headers, callback);
}

function setGetterHandlers(handlersArr, _done, _hook) {
    hook = _hook;
    this.done = _done;
    count = 0;
    this.handlersArr = handlersArr;
}

function mockRes(statusCode) {
    const res = new function () {
        return {
            on: (evt, cb) => {
                if (evt === 'end') {
                    cb();
                }
                if(evt === 'error') {
                    //cb(new Error('mocked Error call'));
                }
            },
            statusCode: statusCode
        };
    }
    return res;
}

module.exports = {
    get,
    setGetterHandlers,
    mockRes
}