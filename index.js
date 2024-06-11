/* eslint-disable no-console */
const serveHandler = require('serve-handler');

const StaticServerMiddlewareFactory = function(config, logger) {
  const log = logger.create('karma-static-server');
  const options = Object.assign({
    root: config.basePath,
    // do not log during singleRun
    log: config.singleRun ? false : true
  }, (config.serveStatic || {}));

  if (options.log) {
    log.info(`serving static files in ${options.root}`);
  }

  return function(request, response, next) {
    if (options.log) {
      response.addListener('finish', () => {
        log.info(`[${response.statusCode}] ${request.url}`);
      });
    }
    return serveHandler(request, response, {cleanUrls: false});
  };
};

// inject karma runner config
StaticServerMiddlewareFactory.$inject = ['config', 'logger'];

module.exports = {
  'middleware:staticServer': ['factory', StaticServerMiddlewareFactory]
};
