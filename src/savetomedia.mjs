import fs from 'fs';
import crypto from "crypto";

const hash = (buff) => crypto.createHash('sha256').update(buff).digest('hex');

const main = "main.30809ee0.chunk.js";

const mainJs = fs.readFileSync(`./static/js/${main}`, 'utf-8');

const reg = /function\s+\(A, e\) {\s+A.exports = "(\S+?)"\s+}/g;

const newMain = mainJs.replace(reg, (a, b) => {
  const png = Buffer.from(/data:image\/png;base64,(\S+)/.exec(b)[1], 'base64');
  const filename = hash(png).slice(0, 8);
  fs.writeFileSync(`./static/media/${filename}.png`, png)
  return `function (A, e, t) { A.exports = t.p + "static/media/${filename}.png"}`;
})

fs.writeFileSync('./static/js/main.js', newMain, 'utf-8');