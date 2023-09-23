let chapter = [];
let isInited = false;

const sleep = function () {
  return new Promise((resolve) => {
    setTimeout(resolve, 30000);
  });
};

const getArticle = function (id) {
  return fetch("https://time.geekbang.org/serv/v1/article", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      include_neighbors: true,
      is_freelyread: true,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return {
        content: data.data.article_content,
        article_title: data.data.article_title,
      };
    });
};

const getArticles = function (id) {
  return fetch("https://time.geekbang.org/serv/v1/column/articles", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cid: id,
      order: "earliest",
      prev: 0,
      sample: false,
      size: 500,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.data.list;
    });
};

const getChapter = function (chapterId) {
  return fetch("https://time.geekbang.org/serv/v1/chapters", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cid: chapterId,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.data;
    });
};

const init = async function (cid) {
  if (isInited) return;
  isInited = true;
  const contents = await getChapter(cid);
  const empyty = [
    {
      id: 0,
      title: "课程目录",
    },
  ];
  const articles = await getArticles(cid);
  const chapters = contents.length ? contents : empyty

  for (const dom of chapters) {
    const chapterData = {
      chapterTitle: dom.title,
      children: [],
    };

    const items = articles.filter((item) => item.chapter_id == dom.id);

    if (!items.length) return;

    for (const item of items) {
      try {
        await sleep();
        const id = item.id;
        if (id) {
          const article = await getArticle(id);
          const childrenData = {
            title: item.article_title,
            id: id,
            ...article,
          };
          console.log("article==", article, childrenData);
          chapterData.children.push(childrenData);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    chapter.push(chapterData);
  }

  console.log("全部获取完毕");
};
