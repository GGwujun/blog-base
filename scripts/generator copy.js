// Node
var { Sitdown } = require("../packages/sitdown");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const chalk = require("chalk");
const books = require("../books");
const { strict } = require("assert");

const isDev = process.argv.slice(2) && process.argv.slice(2).includes("DEBUG");

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

const createDocDir = function (index) {
  const DocDir = `docs${index}`;
  if (!fs.existsSync(DocDir)) {
    fs.mkdirSync(DocDir);
  }
};

const createRepoDir = function (book, index) {
  const repoDir = `docs${index}/${book.title}`;
  if (!fs.existsSync(repoDir)) {
    fs.mkdirSync(repoDir);
  }
};

const createConfig = function (book, index) {
  const waqueConfigName = `docs${index}/${rmTrin(book.title)}/yuque.yml`;

  const waqueConfig = `
  # 配置请参考：https://www.yuque.com/waquehq/docs/configuration
  repo: 'dashixiong-xacfr/nd09a9'
  pattern: '**/*.md'
  promote: false
  `;

  fs.writeFileSync(waqueConfigName, waqueConfig);
};

const createSummary = function (book, index) {
  const summaryDir = `docs${index}/${book.title}/summary.md`;
  const indexDir = `docs${index}/${book.title}/index.md`;

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

const createDocs = function (book, index) {
  var sitdown = new Sitdown();
  const bookDir = `docs${index}/${book.title}`;
  logger.log(chalk.green(`create book: ${book.title}`));
  book.data.forEach((chapter, index) => {
    if (!chapter.chapterTitle) {
      const articleDir = `${bookDir}/${rmTrin(chapter.article_title)}`;
      logger.log(chalk.white(`  create book article:${chapter.article_title}`));
      const mdContent = `---
date: "2019-06-23"
---  
      
# ${chapter.article_title}\n${sitdown.HTMLToMD(chapter.content)}`;
      fs.writeFileSync(`${articleDir}.md`, mdContent);
    } else {
      const dir = rmTrin(chapter.chapterTitle);
      const chapterDir = `${bookDir}/${getList(index)}.${dir}`;
      if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir);
      }

      logger.log(chalk.yellow(`  create book chapter:${chapter.chapterTitle}`));

      chapter.children.forEach((article, i) => {
        logger.log(
          chalk.white(`    create book article:${article.article_title}`)
        );
        const mdContent = `---
date: "2019-06-23"
---  
      
# ${article.article_title}\n${sitdown.HTMLToMD(article.content)}`;

        fs.writeFileSync(`${chapterDir}/${getList(i)}.md`, mdContent);
      });
    }
  });

  console.log(
    chalk.green(`successfully generator book:${book.title}|${book.data.length}`)
  );
};

const clearDocs = function (index) {
  rimraf.sync(path.resolve(process.cwd(), `docs${index}/*`), {
    glob: true,
  });
};



const createRepo = function (book, index) {
  createRepoDir(book, index);
  createConfig(book, index);
  createSummary(book, index);
};


const nameMap = {
  0: '',
  1: '',
  2: '',
  3: '',
  4: ''
}




if (process.env.CTYPE) {
  createDocDir('');
  clearDocs('');
  books.filter(book => book.category === process.env.CTYPE).forEach((book) => {
    createRepo(book, '');
    createDocs(book, '');
  });
} else {
  for (let index = 0; index < process.env.PAGE; index++) {
    createDocDir(nameMap[index]);
    clearDocs(nameMap[index]);
    books.slice(index * 10, index * 10 + 10).forEach((book) => {
      createRepo(book, nameMap[index]);
      createDocs(book, nameMap[index]);
    });
  }
}


