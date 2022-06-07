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
  "a.01b82a63.b",
  "b.9c3be190.b",
  "c.ead745a1.b",
  "cm.e1525380.b",
  "e.928f34f0.b",
  "f.78ea7fc3.b",
  "g.f024c4a6.b",
  "gg.6ced3eec.b",
  "m.ee745326.b",
  "p.b797bfb5.b",
  "pn.66e3d0fb.b",
  "r.616f37e9.b",
  "s.0122b271.b",
  "d.dfc6bca4.b",
  "md.ca4df15c.b",
  "pt.92184ee0.b"
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
