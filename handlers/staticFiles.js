function getContentType(url) {
  if (url.endsWith('css')) {
    return 'text/css';
  } else if (url.endsWith('html')) {
    return 'text/html';
  } else if (url.endsWith('png')) {
    return 'image/png';
  } else if (url.endsWith('js')) {
    return 'text/javascript';
  }
}

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname.startsWith('/content') && req.method === 'GET') {
    const fs = require('fs');

    fs.readFile(`.${pathname}`, 'utf-8', (err, data) => {
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
        'Content-Type': getContentType(pathname),
      });
      res.write(data);

      res.end();
    });
  } else {
    return true;
  }
};
