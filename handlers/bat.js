const { URL } = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const breeds = require('../data/breeds');
const bats = require('../data/bats');
const formidable = require('formidable');

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const pathname = url.pathname;

  if (pathname === '/bats/add-bat' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addBat.html')
    );

    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      const replacement = breeds.map(
        (breed) => `<option value="${breed}">${breed}</option>`
      );
      const modifiedHtml = data
        .toString()
        .replace('{{batBreeds}}', replacement);

      handleData(res, modifiedHtml);
    });

    stream.on('error', (err) => handleError(res, err));
    stream.on('end', () => handleEnd(res));
  } else if (pathname === '/bats/add-breed' && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/addBreed.html')
    );

    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => handleData(res, data));
    stream.on('error', (err) => handleError(res, err));
    stream.on('end', () => handleEnd(res));
  } else if (pathname === '/bats/add-breed' && req.method === 'POST') {
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
  } else if (pathname === '/bats/add-bat' && req.method === 'POST') {
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

      fs.readFile('./data/bats.json', 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }

        const bats = JSON.parse(data);
        bats.push({
          id: bats.length + 1,
          ...fields,
          image: files.upload.originalFilename,
        });

        const json = JSON.stringify(bats);
        fs.writeFile('./data/bats.json', json, () => {
          console.log('Bats successfully updated!');
        });
      });
    });

    res.writeHead(302, {
      Location: '/',
    });
    res.end();
  } else if (pathname.includes('/bats-edit') && req.method === 'GET') {
    const filePath = path.normalize(
      path.join(__dirname, '../views/editBat.html')
    );

    console.log(bats);

    const batId = Number(url.pathname.substring(11));

    const {
      id,
      name,
      description,
      breed: batBreed,
      _,
    } = bats.find((bat) => bat.id === batId);

    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      const replace = breeds.map((breed) => {
        if (breed === batBreed) {
          return `<option value="${breed}" selected>${breed}</option>`;
        }

        return `<option value="${breed}">${breed}</option>`;
      });

      const modifiedHtml = data
        .toString()
        .replace('{{id}}', id)
        .replace('{{name}}', name)
        .replace('{{description}}', description)
        .replace('{{breeds}}', replace);

      handleData(res, modifiedHtml);
    });

    stream.on('error', (err) => handleError(res, err));
    stream.on('end', () => handleEnd(res));
  } else {
    return true;
  }
};

function handleData(res, data) {
  res.writeHead(200, {
    'Content-Type': 'text/html',
  });
  res.write(data);
}

function handleError(res, err) {
  console.log(err);
  res.writeHead(404, {
    'Content-Type': 'text/plain',
  });
  res.write('404 Not Found!');
}

function handleEnd(res) {
  res.end();
}
