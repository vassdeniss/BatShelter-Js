const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const bats = require('../data/bats');

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

      const modifiedBats = bats.map(
        (bat) => `<li>
            <img
              src="/content/images/${bat.image}"
              alt="${bat.name}"
            />
            <h3>${bat.name}</h3>
            <p><span>Breed: </span>${bat.breed}</p>
            <p>
              <span>Description: </span>${bat.description}
            </p>
            <ul class="buttons">
              <li class="btn edit"><a href="/bats-edit/${bat.id}">Change Info</a></li>
              <li class="btn delete"><a href="/bats-find-new-home/${bat.id}">New Home</a></li>
            </ul>
          </li>`
      );

      console.log(modifiedBats);

      const modifiedHtml = data
        .toString()
        .replace('{{bats}}', modifiedBats.join(''));

      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      res.write(modifiedHtml);
      res.end();
    });
  } else {
    return true;
  }
};
