const fetch = require('node-fetch');
var { Sitdown } = require("../packages/sitdown");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const chalk = require("chalk");
const books = require("../books");
const { strict } = require("assert");

const isDev = process.argv.slice(2) && process.argv.slice(2).includes("DEBUG");

const cookie = '_ga=GA1.1.1137932048.1678542836; XSRF-TOKEN=dc3efb09-35b7-42dd-9585-72bc98114d8c; SESSION=8b6d1182-fa95-406d-b83b-f592fc628bce'


const categoryMap={
}

const allTags={
}


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


let chapter = [];
let isInited = false;

const sleep = function (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time || 180000);
  });
};


 function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}



const getTags = function () {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/tags?page=0&size=0", {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: cookie
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data
    }).catch((err)=>{
      console.log('get tags error',err);
    })
};


const getCategories = function () {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/categories?page=0&size=0", {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: cookie
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data
    });
};


const publishArticle = function (name) {
  return fetch(`http://116.62.158.254:8090/apis/api.console.halo.run/v1alpha1/posts/${name}/publish`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: cookie
    }
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('publish',name);
      return data
    });
};

const createArticle = function (title,mdContent,category,ctitle) {
  return fetch("http://116.62.158.254:8090/apis/api.console.halo.run/v1alpha1/posts", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: cookie
    },
    body: JSON.stringify({
      content:{
        "raw": mdContent,
        "content": mdContent,
        "rawType": "HTML"
      },
      post:{
        "spec": {
            "title":title,
            "slug": +new Date(),
            "template": "",
            "cover": "",
            "deleted": false,
            "publish": false,
            "publishTime": "",
            "pinned": false,
            "allowComment": true,
            "visible": "PUBLIC",
            "priority": 0,
            "excerpt": {
                "autoGenerate": true,
                "raw": ""
            },
            "categories": [categoryMap[category].name],
            "tags": [allTags[ctitle].name],
            "htmlMetas": []
        },
        "apiVersion": "content.halo.run/v1alpha1",
        "kind": "Post",
        "metadata": {
            "name": randomUUID(),
            "annotations": {
                "content.halo.run/preferred-editor": "default"
            }
        }
    }
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('created',data.metadata.name);
      return publishArticle(data.metadata.name)
    });
};

const getList = function (index) {
  return index < 9 ? `0${index + 1}` : index + 1;
};

const createDocs = async function (book,category,ctitle) {
  const bookDir = `${book.title}`;
  logger.log(chalk.green(`create book: ${book.title}`));

  const createB = async function(chapter,index){
    if (!chapter.chapterTitle) {
      const articleDir = `${rmTrin(chapter.article_title)}`;
      logger.log(chalk.white(`  create book article:${chapter.article_title}`));
      const mdContent = `<p># ${chapter.article_title}\n${chapter.content}</p>`;
      await createArticle(articleDir,mdContent,category,ctitle)
    } else {
      const dir = rmTrin(chapter.chapterTitle);
      const chapterDir = `${dir}`;
      logger.log(chalk.yellow(`create book chapter:${chapter.chapterTitle}`));
      for (let i = chapter.children.length-1; i >=0; i--) {
        const cld = chapter.children[i];
        logger.log(
          chalk.white(`create book article:${cld.article_title}`)
        );
        const mdContent = `${cld.content}`;
        await createArticle(`${chapterDir}-${cld.article_title}`,mdContent,category,ctitle)
      }
    }
  }

  for (let index = book.data.length-1; index >=0 ; index--) {
    const bookData = book.data[index];
    await sleep(5000)
    await createB(bookData,index)
  }

  console.log(
    chalk.green(`successfully generator book:${book.title}|${book.data.length}`)
  );
};



const start = async function(index){
  await getTags().then((data)=>{
    if(data.items && data.items.length){
      data.items.forEach((item)=>{
        if(!allTags[item.spec.displayName]){
          allTags[item.spec.displayName]={
            name: item.metadata.name,
            displayName:item.spec.displayName,
            slug:item.spec.slug
          }
        }
    })
  }  
  })
  
  await getCategories().then((data)=>{
    if(data.items && data.items.length){
        data.items.forEach((item)=>{
          if(!categoryMap[item.spec.slug]){
            categoryMap[item.spec.slug]={
              name: item.metadata.name,
              displayName:item.spec.displayName,
              slug:item.spec.slug
            }
          }
      })
    }  
  })

  if(index !== undefined && typeof index === 'number'){
    await createDocs(books[index],books[index].category,books[index].title);
  }else if(index !== undefined && typeof index === 'object'){
      for (let i = 0; i < index.length; i++) {
        await sleep(1000)
        await createDocs(books[index[i]],books[index[i]].category,books[index[i]].title);
      }
  }else{
    // for (let index = 0; index < books.length; index++) {
    //   await sleep(1000)
    //   await createDocs(books[index],books[index].category,books[index].title);
    // }
  } 
}
//0-2-10-11,12,13,15,19,22,26,30
console.log(123456789,books.map((book,index)=>`${book.title}---${index}`));
// start([19,21,22,25,26,27,28,29,30,32,33,34,35,36,37,38,39,40,45,46,47,49,54,59])

start([30])

// start()
