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

function decode (l, N) {
  return N ^ (l >> 2 ^ 79) % 256;
}

[
  "a.9c5b0c8a.json",
  "b.a462e53c.json",
  "c.094cc45c.json",
  "cm.f0758bb1.json",
  "d.ef2dc283.json",
  "e.0a2ec153.json",
  "f.2aba1b4b.json",
  "g.012a2283.json",
  "gg.6fd425e4.json",
  "m.2ca3601c.json",
  "md.29bde605.json",
  "p.b7c51da7.json",
  "pn.53009f6b.json",
  "pt.92184ee0.json",
  "r.f2146cdd.json",
  "s.c153b0a5.json"
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
