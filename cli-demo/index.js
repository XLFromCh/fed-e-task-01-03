#!/usr/bin/env node

const { resolve } = require('path')
const fs = require('fs')
const tempPath = resolve(__dirname, './temp/index.html')
const outputPath = process.cwd()
const fileName = process.argv[2] || "default"
const readable = fs.createReadStream(tempPath);
writable = fs.createWriteStream(resolve(outputPath, `${fileName}.html`));
readable.pipe(writable);