/*
 * Author: bjiang
 * Create Time: 2020/12/25 16:34
 */
import pack from "@msgpack/msgpack";
import fs from "fs";

function decode (l, N) {
  return N ^ (l >> 2 ^ 79) % 256;
}

const files = [
  "a.9c5b0c8a.b",
  "b.a462e53c.b",
  "c.094cc45c.b",
  "cm.f0758bb1.b",
  "d.ef2dc283.b",
  "e.0a2ec153.b",
  "f.2aba1b4b.b",
  "g.012a2283.b",
  "gg.6fd425e4.b",
  "m.2ca3601c.b",
  "md.29bde605.b",
  "p.b7c51da7.b",
  "pn.53009f6b.b",
  "pt.92184ee0.b",
  "r.f2146cdd.b",
  "s.c153b0a5.b"
].map(file => {
  const ub = new Uint8Array(fs.readFileSync(`static/media/${file}`));
  for (let l = 0; l < ub.length; l++) {
    ub[l] = decode(l, ub[l]);
  }
  fs.writeFileSync(
    `dist/${file.replace(/\.b$/, ".json")}`,
    JSON.stringify(pack.decode(ub), null, 2),
    "utf-8"
  );
});
