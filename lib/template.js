var _ = require('underscore');
var nunjucks = require('nunjucks');
var flash = require('connect-flash');

var paths = require('./paths');
var util = require('./util');
var HttpLoader = require('./template-http-loader');

function flashList(req) {
  var flash = req.flash();
  var messages = [];
  Object.keys(flash).forEach(function(category) {
    messages.push.apply(messages, flash[category].map(function(content) {
      return {category: category, content: content};
    }));
  });
  return messages;
}

exports.express = function(app, options) {
  var loaders = [];
  var nunjucksEnv;

  if (options.templateUrl)
    loaders.push(new HttpLoader(options.templateUrl, app));
  loaders.push(new nunjucks.FileSystemLoader(paths.templateDir));
  if (options.extraTemplateLoaders)
    loaders.push.apply(loaders, options.extraTemplateLoaders);

  nunjucksEnv = new nunjucks.Environment(loaders, {autoescape: true});

  _.extend(app.locals, {
    DOT_MIN: options.debug ? '' : '.min',
    STATIC_ROOT: options.staticRoot || ''
  });
  app.use(flash());
  app.nunjucksEnv = nunjucksEnv;
  nunjucksEnv.express(app);
  nunjucksEnv.addFilter('squishName', function(str) {
    return util.squishName(str.toString());
  });
  nunjucksEnv.addFilter('normalizeURL', function(str) {
    return util.normalizeURL(str.toString());
  });
  nunjucksEnv.addFilter('domain', function(str) {
    return util.getDomain(str.toString());
  });
  nunjucksEnv.addFilter('getUsername', util.getUsername);
  nunjucksEnv.addFilter('encodeURIComponent', encodeURIComponent);
  app.response.render.SafeString = nunjucks.runtime.SafeString;
  app.use(function setResponseLocals(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.locals.email = req.session.email || '';
    res.locals.fetchAndClearFlashMessages = flashList.bind(null, req);
    next();
  });
};
