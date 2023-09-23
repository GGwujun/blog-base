const fs = require("fs");
const path = require("path");

function scan(parentPath, toc = []) {
  const folders = fs.readdirSync(parentPath);
  folders.sort((a, b) => {
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
  });

  for (const folderName of folders) {
    const folderPath = path.resolve(parentPath, folderName);
    const fileStat = fs.statSync(folderPath);
    if (!folderName.startsWith(".")) {
      if (
        fileStat.isFile() &&
        !["README.md", "index.md"].includes(folderName) &
          folderName.endsWith(".md")
      ) {
        const fileName = folderName.replace(/^\d+\./, "").replace(/\.md$/, "");
        toc.push({
          title: fileName,
          category: "other",
        });
      } else if (fileStat.isDirectory()) {
        const subToc = {
          title: folderName,
          category: null,
        };
        const existBook = fs.existsSync(path.join(folderPath, "book.js"));
        if (existBook) {
          const bookSetting = require(path.join(folderPath, "book.js"));
          subToc.category = (bookSetting && bookSetting.category) || "other";
        }

        toc.push(subToc);
      }
    }
  }

  return toc;
}

function checkValid(name = "") {
  return /^\d+\./.test(name);
}

exports.scan = scan;
