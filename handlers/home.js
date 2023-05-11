const { URL } = require('url');
const fs = require('fs');
const path = require('path');
//const cats = require('../data/cats');

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname === '/' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/home/index.html')
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });

        res.write('404 Not Found!');
        res.end();
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      res.write(data);
      res.end();
    });
  } else {
    return true;
  }
};
