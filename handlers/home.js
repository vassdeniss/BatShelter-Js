const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');

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

      const modifiedCats = cats.map(
        (cat) => `<li>
            <img
              src="/content/images/${cat.image}"
              alt="${cat.name}"
            />
            <h3></h3>
            <p><span>Breed: </span>${cat.breed}</p>
            <p>
              <span>Description: </span>${cat.description}
            </p>
            <ul class="buttons">
              <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
              <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
            </ul>
          </li>`
      );

      const modifiedHtml = data.toString().replace('{{cats}}', modifiedCats);

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
