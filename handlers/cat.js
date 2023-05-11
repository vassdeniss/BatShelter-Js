const { URL } = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const breeds = require('../data/breeds');
const cats = require('../data/cats');
const formidable = require('formidable');

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname === '/cats/add-cat' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addCat.html')
    );

    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      const replacement = breeds.map(
        (breed) => `<option value="${breed}">${breed}</option>`
      );
      const modifiedHtml = data
        .toString()
        .replace('{{catBreeds}}', replacement);

      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.write(modifiedHtml);
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
  } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addBreed.html')
    );

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
  } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
    let formData = '';

    req.on('data', (data) => {
      formData += data;
    });

    req.on('end', () => {
      const body = querystring.parse(formData);

      fs.readFile('./data/breeds.json', (err, data) => {
        if (err) {
          throw err;
        }

        const breeds = JSON.parse(data);
        breeds.push(body.breed);

        const json = JSON.stringify(breeds);
        fs.writeFile('./data/breeds.json', json, 'utf-8', () =>
          console.log('Breeds successfully updated!')
        );
      });

      res.writeHead(302, {
        Location: '/',
      });
      res.end();
    });
  } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }

      const imagePath = files.upload.filepath;
      const image = fs.readFileSync(imagePath);

      const newPath = path.normalize(
        path.join(
          __dirname,
          `../content/images/${files.upload.originalFilename}`
        )
      );

      fs.writeFile(newPath, image, (err) => {
        if (err) {
          throw err;
        }

        console.log('File was uploaded successfully!');
      });

      fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }

        const cats = JSON.parse(data);
        cats.push({
          id: cats.length + 1,
          ...fields,
          image: files.upload.originalFilename,
        });

        const json = JSON.stringify(cats);
        fs.writeFile('./data/cats.json', json, () => {
          console.log('Cats successfully updated!');
        });
      });
    });

    res.writeHead(302, {
      Location: '/',
    });
    res.end();
  } else {
    return true;
  }
};
