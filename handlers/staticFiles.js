function getContentType(url) {
  if (url.endsWith('css')) {
    return 'text/css';
  } else if (url.endsWith('html')) {
    return 'text/html';
  } else if (url.endsWith('png')) {
    return 'image/png';
  } else if (url.endsWith('jpg')) {
    return 'image/jpeg';
  } else if (url.endsWith('js')) {
    return 'text/javascript';
  } else if (url.endsWith('ico')) {
    return 'image/x-icon';
  }
}

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname.startsWith('/content') && req.method === 'GET') {
    const fs = require('fs');

    if (
      pathname.endsWith('png') ||
      pathname.endsWith('jpg') ||
      pathname.endsWith('jpeg') ||
      pathname.endsWith('ico')
    ) {
      fs.readFile(`.${pathname}`, (err, data) =>
        handleFile(res, err, data, pathname)
      );
    } else {
      fs.readFile(`.${pathname}`, 'utf-8', (err, data) =>
        handleFile(res, err, data, pathname)
      );
    }
  } else {
    return true;
  }
};

function handleFile(res, err, data, pathname) {
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
}
