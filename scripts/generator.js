// Node
var { Sitdown } = require("../packages/sitdown");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const chalk = require("chalk");
const books = require("../books");
const { strict } = require("assert");
let request = require('request')


const isDev = process.argv.slice(2) && process.argv.slice(2).includes("DEBUG");


const downloadImage = (src, dest) => {
  return new Promise((resolve, reject) => {
    request.head(src, (err, res, body) => {
      if (err) { reject(err) }
      try {
        src && request(src).pipe(fs.createWriteStream(dest)).on('close', () => {
          resolve && resolve(dest)
        })
      } catch (error) {
        reject(error)
      }
    })
  })

}

var domainPattern = /^(https?:\/\/[^/]+)(.*)$/;


const logger = {
  log: function (str) {
    if (!isDev) return;
    else {
      console.log(str);
    }
  },
};

const rmTrin = function (str) {
  return str
    .replace(/\s/g, "")
    .replace(/\//g, "")
    .replace(/\(([^)]*)\)/, "")
    .replace(/\*/g, " ")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/\%/g, "")
    .replace(/\|/, " ")
    .replace(/[\?：，]/g, "");
};

const getList = function (index) {
  return index < 9 ? `0${index + 1}` : index + 1;
};

const createDocDir = function (book) {
  const DocDir = `docs`;
  if (!fs.existsSync(DocDir)) {
    fs.mkdirSync(DocDir);
  }

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }

  const ImageDoc = 'public/images'
  if (!fs.existsSync(ImageDoc)) {
    fs.mkdirSync(ImageDoc);
  }
};

const createRepoDir = function (book) {
  const repoDir = `docs/${book.title}`;
  const imageDir = `public/images/${book.title}`;

  if (!fs.existsSync(repoDir)) {
    fs.mkdirSync(repoDir);
  }

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }
};

const createConfig = function (book) {
  const waqueConfigName = `docs/${rmTrin(book.title)}/yuque.yml`;

  const waqueConfig = `
  # 配置请参考：https://www.yuque.com/waquehq/docs/configuration
  repo: 'dashixiong-xacfr/nd09a9'
  pattern: '**/*.md'
  promote: false
  `;

  fs.writeFileSync(waqueConfigName, waqueConfig);
};

const createSummary = function (book) {
  const summaryDir = `docs/${book.title}/summary.md`;
  const indexDir = `docs/${book.title}/index.md`;

  let summaryData = `# ${book.title}\n`;
  book.data.forEach((chapter, index) => {
    // 一级目录
    const firstToc = chapter.chapterTitle;
    // 只有一级目录
    if (!firstToc) {
      const parentLink = `/${book.title}/${rmTrin(chapter.article_title).replace(/([a-z])([A-Z])/g, function (a, b, c) { return `${b}-${c}` }).toLowerCase()}`;
      summaryData += `[${chapter.article_title}](${parentLink})\n`;
    } else {
      const parentLinkName = `${getList(index)}.${rmTrin(
        chapter.chapterTitle
      ).replace(/([a-z])([A-Z])/g, function (a, b, c) { return `${b}-${c}` }).toLowerCase()}`;
      const parentLink = `/${book.title}/${getList(index)}.${rmTrin(
        chapter.chapterTitle
      ).replace(/([a-z])([A-Z])/g, function (a, b, c) { return `${b}-${c}` }).toLowerCase()}`;
      summaryData += `- [${parentLinkName}](${parentLink})\n`;
      chapter.children.forEach((article, i) => {
        summaryData += `  - [${article.article_title}](${parentLink}/${getList(
          i
        )})\n`;
      });
    }
  });

  fs.writeFileSync(summaryDir, summaryData);
  fs.writeFileSync(indexDir, summaryData);
};

const createDocs = async function (book) {
  const bookDir = `docs/${book.title}`;
  const imageDir = `public/images/${book.title}`;
  logger.log(chalk.green(`create book: ${book.title}`));

  for (let index = 0; index < book.data.length; index++) {
    const chapter = book.data[index];
    if (!chapter.chapterTitle) {
      const articleDir = `${bookDir}/${rmTrin(chapter.article_title)}`;
      var sitdown = new Sitdown({
        assetsPublicPath: `/images/${book.title}`
      });
      logger.log(chalk.white(`  create book article:${chapter.article_title}`));
      const mdContent = `---
date: "2019-06-23"
---  
      
# ${chapter.article_title}\n${sitdown.HTMLToMD(chapter.content)}`;
      fs.writeFileSync(`${articleDir}.md`, mdContent);
      fs.writeFileSync(`${imageDir}/images.json`, sitdown.service.mdImages)
    } else {
      const dir = rmTrin(chapter.chapterTitle);
      const chapterDir = `${bookDir}/${getList(index)}.${dir}`;
      const chapterImageDir = `${imageDir}/${getList(index)}.${dir}`;

      if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir);
      }
      if (!fs.existsSync(chapterImageDir)) {
        fs.mkdirSync(chapterImageDir);
      }

      logger.log(chalk.yellow(`  create book chapter:${chapter.chapterTitle}`));

      for (let i = 0; i < chapter.children.length; i++) {
        const article = chapter.children[i];
        logger.log(
          chalk.white(`    create book article:${article.article_title}`)
        );
        var sitdown = new Sitdown({
          assetsPublicPath:  `/images/${book.title}/${getList(index)}.${dir}`
        });
        const mdContent = `---
date: "2019-06-23"
---  
      
# ${article.article_title}\n${sitdown.HTMLToMD(article.content)}`;

        fs.writeFileSync(`${chapterDir}/${getList(i)}.md`, mdContent);
        if (sitdown.service.mdImages && sitdown.service.mdImages.length) {
          for (let index = 0; index < sitdown.service.mdImages.length; index++) {
            const img = sitdown.service.mdImages[index];
            const imgNoOrigin = img.split("?")[0].match(domainPattern);
            const dest = imgNoOrigin[2].replace(/\//g, "")
            try {
              await downloadImage(img, `${chapterImageDir}/${dest}`)
            } catch (error) {
              console.log(error);
            }
          }
          fs.writeFileSync(`${chapterImageDir}/${getList(i)}-images.json`, JSON.stringify(sitdown.service.mdImages))
        }
      }
    }
  }


  console.log(
    chalk.green(`successfully generator book:${book.title}|${book.data.length}`)
  );
};

const clearDocs = function () {
  rimraf.sync(path.resolve(process.cwd(), "docs/*"), {
    glob: true,
  });
  rimraf.sync(path.resolve(process.cwd(), "public/images/*"), {
    glob: true,
  });
};

clearDocs();
createDocDir();

const createRepo = async function (book) {
  createRepoDir(book);
  createConfig(book);
  createSummary(book);
};

books.forEach(async (book) => {
  createRepo(book);
  await createDocs(book);
});
