# wdio-container-service-runner

This WebdriverIO service triggers a cloud run service, or other container-based cloud container service on any platform. Examples include Google Cloud Run and Heroku. The service performs the trigger, and a health check, by requesting the /status endpoint of a WebDriver or Selenium Grid and then retrying the requests until the service returns ready and a 2xx or 3xx response code.

Once the health check is completed, WebdriverIO workers take over and execute the tests by making requests to the container running in the cloud.

## Configuration

Whenever running Selenium servers, grids, or WebDrivers on the public Internet, securing those services is critically important. For example, running tests on Google Cloud Run or Heroku, we will set these servers up to authenticate with an authentication token, which we'll include as an environment variable when running tests. You'll also need to include the hostname, protocol, headers, port, and strictSSL. Also, include 'cloud-containers' in your services array. 

Below is an example wdio.conf.js configuration:

```
    port: 443,
    protocol: 'https',
    hostname: process.env.CLOUD_CONTAINER_APP_URL,
    headers: {
        'authorization': 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
    },
    strictSSL: true,
    services: ['cloud-container'],
```
 
 ## Running the tests

 Container-based systems, such as Google Cloud Run or Heroku, don't run  24/7. Instead, processes start when the first request is made. When we start running the tests, the wdio-cloud-container-service does a health check until the service starts.  Here is an example:

 ```
 $ CLOUD_CONTAINER_ACCESS_TOKEN=${YOUR_TOKEN_HERE} npx wdio wdio.cloud-run.conf.js --hostname my-chrome-testing-service.herokuapp.com
 ```

 NOTE: Replace the CLOUD_CONTAINER_ACCESS_TOKEN with your token and my-chrome-testing-service.herokuapp.com with the URL for your server.


 ## Troubleshooting

 - This service only works with HTTPS connections. Make sure the settings are all configured for HTTPS on port 443.
 - Make sure the CLOUD_CONTAINER_ACCESS_TOKEN is set correctly and matches what your server expects.
 - Make sure either CLOUD_CONTAINER_APP_URL is set, or that you've replaced that variable with the correct URL for your server.
 - Some systems require more time to warm-up than the default maxAttempts 5 and retryTimeout 6000. You can increase the retryTimeout and maxAttempts by passing these options into the service:

 ```
    services: [['cloud-container', {
        maxAttempts: 10,
        retryTimeout: 6000
    }]],
```

## License

Copyright 2022, James Mortensen under the MIT License
