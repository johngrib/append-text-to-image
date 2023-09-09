#!/usr/bin/env node

const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('image', {
    alias: 'i',
    description: 'Path to the image file',
    type: 'string',
  })
  .option('text', {
    alias: 't',
    description: 'Text to append at the bottom of the image',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    description: 'Path to save the modified image',
    type: 'string',
  })
  .demandOption(['image', 'text', 'output'], 'Please provide necessary arguments')
  .help()
  .argv;

loadImage(argv.image).then((image) => {
  const canvas = createCanvas(image.width, image.height + 50);
  const ctx = canvas.getContext('2d');

  // Draw original image
  ctx.drawImage(image, 0, 0);

  // Draw text at the bottom
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(argv.text, 10, image.height + 40);

  // Convert canvas to Buffer
  const buffer = canvas.toBuffer('image/png');

  // Use sharp to save the new image
  sharp(buffer)
    .toFile(argv.output, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Image saved to ${argv.output}`);
      }
    });
});

