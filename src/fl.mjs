import fs from "fs";

const zh = JSON.parse(fs.readFileSync("src/zh.json", "utf-8"));
const keys = new Set(["Name", "Description"]);

const db = JSON.parse(fs.readFileSync("src/fl.json", "utf-8"), (key, value) => {
  if (keys.has(key)) return zh[value] || value;
  return value;
});

fs.writeFileSync("src/fl.json", JSON.stringify(db, null, 2), "utf-8");
