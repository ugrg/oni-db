/*
 * Author: sh-home
 * Create Time: 2021/1/8 21:18
 */

import fs from "fs";
import pack from "@msgpack/msgpack";
import PATH from "path";

const matchPo = /#\. \S+\smsgctxt [\s\S]+?\nmsgid [\s\S]+?\nmsgstr [\s\S]+?\n\n/g;
const tagReg = /<(link|style|b|color)(?:=[^>]+?)?>(.+?)<\/\1>/g;
const keys = new Set(["Name", "Description", "Category"]);

String.prototype.clearTag = function () {
  let str = this;
  while (tagReg.test(str)) str = str.replace(tagReg, "$2");
  return str;
};

const zh = fs.readFileSync("src/strings_preinstalled_zh_klei.po", "utf-8").match(matchPo).map((str) => {
  return str
    .replace(/#\. \S+\smsgctxt [\s\S]+?\nmsgid ([\s\S]+?)\nmsgstr ([\s\S]+?)\n\n/, "$1|||$2")
    .replace(/"\n"/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\n\n/g, "  ")
    .replace(/\\"/g, "\"")
    .clearTag()
    .split("|||");
}).reduce((p, [key, value]) => Object.assign(p, {
  [key.replace(/^"|"$/g, "")]: value.replace(/^"|"$/g, "")
}), {});

fs.writeFileSync("src/zh.json", JSON.stringify(zh, null, 2), "utf-8");

function decode(l, N) {
  return N ^ (l >> 2 ^ 79) % 256;
}

[
  "a.01b82a63.json",
  "b.9c3be190.json",
  "c.ead745a1.json",
  "cm.e1525380.json",
  "e.928f34f0.json",
  "f.78ea7fc3.json",
  "g.f024c4a6.json",
  "gg.6ced3eec.json",
  "m.ee745326.json",
  "p.b797bfb5.json",
  "pn.66e3d0fb.json",
  "r.616f37e9.json",
  "s.0122b271.json",
  "d.dfc6bca4.json",
  "md.ca4df15c.json",
  "pt.92184ee0.json"
].forEach((filename) => {
  const db = JSON.parse(fs.readFileSync(PATH.join("dist", filename), "utf-8"), (key, value) => {
    if (keys.has(key)) {
      return zh[value] || (value.replace(/\n\n/g, "  ").split(/\n /g).map(v => zh[v.clearTag()] || v).join("\n"));
    }
    return value;
  });

  const eb = new Uint8Array(pack.encode(db)).map((b, i) => decode(i, b));
  fs.writeFileSync(PATH.join("static/media", filename.replace(/\.json$/, ".b")), eb);
});
