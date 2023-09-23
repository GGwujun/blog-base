const path = require("path");
const fetch = require('node-fetch');
const transliteration = require('transliteration')
const books = require("../books");
const { scan } = require("./utils");

const bookNavs = books.map((res) => ({
  title: res.title,
  category: res.category,
}));

const CUSTOM_DOC_ROOT_PATH = path.resolve(process.cwd(), "src");

const categoryMap = {
}


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



const createcategory = function (title, slug) {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/categories", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: "_ga=GA1.1.1137932048.1678542836; SESSION=23af4261-f771-4148-b207-2ec03473a2b4; XSRF-TOKEN=ddc891e9-4a85-405c-b4bb-22efa0175769"
    },
    body: JSON.stringify({
      "spec": {
        children: [],
        "displayName": title,
        "slug": slug,
        "color": "#ffffff",
        "cover": "",
        description: title,
        priority: 0,
        template: ""
      },
      "apiVersion": "content.halo.run/v1alpha1",
      "kind": "Category",
      "metadata": {
        "name": "",
        "generateName": "category-",
        "annotations": {}
      }
    })
  })

    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data
    });
};


const getCategories = function () {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/categories?page=0&size=0", {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: "_ga=GA1.1.1137932048.1678542836; SESSION=23af4261-f771-4148-b207-2ec03473a2b4; XSRF-TOKEN=ddc891e9-4a85-405c-b4bb-22efa0175769"
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data
    });
};

const getNav = function (nav) {
  return Object.keys(nav).map((cla) => {
    return nav[cla].data && nav[cla].data.length && {
      title: nav[cla].title,
      children: nav[cla].data.map((book) => ({
        title: book.title,
        path: `/${book.title}`,
      })),
      slug: cla
    }
  }).filter(Boolean);
};

exports.getBookNavs = function () {
  [...bookNavs, ...scan(CUSTOM_DOC_ROOT_PATH)].forEach((book) => {
    category[book.category || "other"].data.push(book);
  });
  return getNav(category);
};


// getCategories().then((data)=>{
//   if(data.items && data.items.length){
//       data.items.forEach((item)=>{
//         if(!categoryMap[item.spec.slug]){
//           categoryMap[item.spec.slug]={
//             name: item.metadata.name,
//             displayName:item.spec.displayName,
//             slug:item.spec.slug
//           }
//         }
//     })
//   }

//   getNav(category).forEach((navs) => {
//     if(!categoryMap[navs.slug]){
//       createcategory(navs.title,navs.slug);
//     }
//   });
// })

