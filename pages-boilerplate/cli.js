#!/usr/bin/env node

/* const { resolve } = require('path')
const fs = require('fs')
const tempPath = resolve(__dirname, './temp/temp.html')
const outputPath = process.argv[3] || "src"
const fileName = process.argv[2] || "default"
const readable = fs.createReadStream(tempPath);
writable = fs.createWriteStream(resolve(outputPath, `${fileName}.html`));
readable.pipe(writable);
 */
console.log(process.cwd())