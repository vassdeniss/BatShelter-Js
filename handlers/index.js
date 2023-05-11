const homeHandler = require('./home');
const staticFileHandler = require('./staticFiles');
const catHandler = require('./cat');

module.exports = [homeHandler, staticFileHandler, catHandler];
