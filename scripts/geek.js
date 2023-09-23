let chapter = [];
let isInited = false;

const sleep = function () {
  return new Promise((resolve) => {
    setTimeout(resolve, 180000);
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

const init = async function () {
  if (isInited) return;
  isInited = true;
  const contents = document.getElementsByClassName(
    "Catalog_catalogCollapesContent_1X9Hw"
  );

  for (const dom of contents) {
    const h = dom.getElementsByClassName("Catalog_catalogCollapesHead_3Nnx8");
    const p = dom.getElementsByTagName("p");

    if (!p.length) return;

    const items = dom.getElementsByClassName(
      "Catalog_catalogCollapesItem_3c2pu"
    );

    const chapterData = {
      chapterTitle: p[0].textContent,
      children: [],
    };

    if (!items.length) return;

    for (const item of items) {
      try {
        await sleep();
        const a = item.getElementsByTagName("a");
        const href = a[0].href ? a[0].href.split("/") : [];
        const id = href.length ? href[href.length - 1] : null;
        if (id) {
          const article = await getArticle(id);
          const childrenData = {
            title: a[0].textContent,
            herf: a[0].href,
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
