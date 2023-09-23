const fetch = require('node-fetch');
const transliteration = require('transliteration')
var { Sitdown } = require("../packages/sitdown/dist");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const chalk = require("chalk");
const books = require("../books");
const { strict } = require("assert");

const isDev = process.argv.slice(2) && process.argv.slice(2).includes("DEBUG");


const allTags = {}

const categoryMap={
}


const logger = {
  log: function (str) {
    if (!isDev) return;
    else {
      console.log(str);
    }
  },
};


const getTags = function () {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/tags?page=0&size=0", {
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


const createTag = function (title) {
  return fetch("http://116.62.158.254:8090/apis/content.halo.run/v1alpha1/tags", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": "ddc891e9-4a85-405c-b4bb-22efa0175769",
      Cookie: "_ga=GA1.1.1137932048.1678542836; SESSION=23af4261-f771-4148-b207-2ec03473a2b4; XSRF-TOKEN=ddc891e9-4a85-405c-b4bb-22efa0175769"
    },
    body:JSON.stringify({
      "spec": {
          "displayName": title,
          "slug": transliteration.slugify(title),
          "color": "#ffffff",
          "cover": ""
      },
      "apiVersion": "content.halo.run/v1alpha1",
      "kind": "Tag",
      "metadata": {
          "name": "",
          "generateName": "tag-",
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

getTags().then((data)=>{
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




books.forEach((book) => {
  if(!allTags[title]){
    createTag(book.title);
  }
});