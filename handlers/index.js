const homeHandler = require('./home');
const staticFileHandler = require('./staticFiles');
const batHandler = require('./bat');

module.exports = [homeHandler, staticFileHandler, batHandler];
