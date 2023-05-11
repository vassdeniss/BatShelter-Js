const { URL } = require('url');
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname === '/cats/add-cat' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addCat.html')
    );
    handleStream(res, filePath);
  } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addBreed.html')
    );
    handleStream(res, filePath);
  } else {
    return true;
  }
};

function handleStream(res, filePath) {
  const stream = fs.createReadStream(filePath);

  stream.on('data', (data) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.write(data);
  });

  stream.on('error', (err) => {
    console.log(err);
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });
    res.write('404 Not Found!');
  });

  stream.on('end', () => {
    res.end();
  });
}
