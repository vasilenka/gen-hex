const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const request = require('request');
const getColors = require('get-image-colors');
const { getColorFromURL } = require('color-thief-node');
const chroma = require('chroma-js');

const download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', () => callback(filename));
  });
};

router.post('/', function(req, res, next) {

  const values = Object.values(req.files);

  values.map(img => {
    // writeFile( img, 'file.jpg', (name) => {
    // download( img, 'processing.jpg', (name) => {
      // sharp(`./${name}`)
      sharp(img.path)
        // .resize(1, 1)
        .toFormat('jpg')
        .toBuffer()
        .then(async data => {

          const dominantColor = await getColorFromURL(data);
          res.send({colors: chroma(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`).hex()})

          // getColors(data, 'image/jpeg')
          //   .then(colors => {
          //     let hexColors = colors.map(color => color.hex())
          //     console.log(hexColors)
          //     res.send({colors: hexColors})
          //   })
          //   .catch(err => {
          //     console.log(err)
          //   })

        })
        .catch(err => {
          console.log(err)
        })

    // })

  });

});

module.exports = router;
