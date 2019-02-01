const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');
const request = require('request');
const getColors = require('get-image-colors');

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
    console.log('img: ', img)
    // writeFile( img, 'file.jpg', (name) => {
    // download( img, 'processing.jpg', (name) => {
      // sharp(`./${name}`)
      sharp(img.path)
        .resize(1, 1)
        .toFormat('jpg')
        .toBuffer()
        .then(data => {
          getColors(data, 'image/jpeg')
          .then(colors => {
            colors.map(color => res.send({color: color.hex()}))
          })
          .catch(err => {
            console.log(err)
          })
        })
        .catch(err => {
          console.log(err)
        })

    // })

  });

});

module.exports = router;
