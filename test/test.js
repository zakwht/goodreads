const { getRSS } = require("../rss.js");
const { writeFileSync } = require("fs");
const ids = require("./ids.json");

Object.values(ids).forEach((id) => {
  getRSS(id).then((res) =>
    writeFileSync(`test/${id}.json`, JSON.stringify(res, null, 2))
  );
});
