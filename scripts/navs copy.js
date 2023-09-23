const path = require("path");
const books = require("../books");
const { scan } = require("./utils");



const bookNavs = (page) => {
  console.log(111,process.env.CTYPE);
  const booksfilter = process.env.CTYPE ? books.filter(book => book.category === process.env.CTYPE) : books.slice(page * 10, page * 10 + 10);
  console.log(22, booksfilter);
  return booksfilter.map((res) => ({
    title: res.title,
    category: res.category,
  }))
};

const CUSTOM_DOC_ROOT_PATH = path.resolve(process.cwd(), "src");

const category = {
  computer: {
    title: "计算机基础",
    data: [],
  },
  algorithm: {
    title: "算法",
    data: [],
  },
  frontend: {
    title: "前端开发",
    data: [],
  },
  fengine: {
    title: "前端工程化",
    data: [],
  },
  performance: {
    title: "前端性能优化",
    data: [],
  },
  app: {
    title: "移动端开发",
    data: [],
  },
  test: {
    title: "软件测试",
    data: [],
  },
  product: {
    title: "产品与用户体验",
    data: [],
  },
  interview: {
    title: "面试",
    data: [],
  },
  other: {
    title: "杂谈",
    data: [],
  },
};

const getNav = function (nav) {
  return Object.keys(nav).map((cla) => ({
    title: nav[cla].title,
    children: nav[cla].data.map((book) => ({
      title: book.title,
      path: `/${book.title}`,
    })),
  }));
};

exports.getBookNavs = function (page) {
  [...bookNavs(page), ...scan(CUSTOM_DOC_ROOT_PATH)].forEach((book) => {
    category[book.category || "other"].data.push(book);
  });

  const categorys = {};

  Object.keys(category).forEach((cate) => {
    if (category[cate].data.length) {
      categorys[cate] = category[cate]
    }
  })
  return getNav(categorys);
};