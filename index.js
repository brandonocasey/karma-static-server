const serveHandler = require('serve-handler');
const {cowsay} = require('cowsayjs');

const StaticServerMiddlewareFactory = function(config, logger) {
  const log = logger.create('karma-static-server');
  const options = Object.assign({
    root: config.basePath,
    // do not log during singleRun
    log: config.singleRun ? false : true,
    // see https://www.npmjs.com/package/cowsayjs
    getCowOptions: () => ({})
  }, (config.staticServer || {}));

  if (options.log) {
    const serverUrl = `${config.protocol}//${config.hostname}:${config.port}`;
    const cowOptions = Object.assign({message: `open ${serverUrl} for dev server`}, (options.getCowOptions(config) || {}));

    log.info(`\n${cowsay(cowOptions)}`);

  }

  return function(request, response, next) {
    if (options.log) {
      response.addListener('finish', () => {
        log.info(`[${response.statusCode}] ${request.url}`);
      });
    }
    const cfg = {symlinks: true, cleanUrls: false};

    return serveHandler(request, response, cfg);
  };
};

// inject karma runner config
StaticServerMiddlewareFactory.$inject = ['config', 'logger'];

module.exports = {
  'middleware:staticServer': ['factory', StaticServerMiddlewareFactory]
};
