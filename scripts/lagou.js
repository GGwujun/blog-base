let chapter = [];
let isInited = false;

const sleep = function () {
  return new Promise((resolve) => {
    setTimeout(resolve, 180000);
  });
};

const getSession = function (courseId) {
  return fetch(
    `https://gate.lagou.com/v1/neirong/kaiwu/getCourseLessons?courseId=${courseId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "$$$EDU_eyJraWQiOiJmNDcxNWRhZi0yNGY0LTQxZGUtOTdkMC0yMGZjYjYyODJlYzEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0Z3QiOiJfQ0FTX1RHVF9UR1QtNzgyZDg2MzMyMDI3NDFhMmJkMzcyYjg3NWRhNWQ2OGQtMjAyMTA5MTYxMjE1MDctX0NBU19UR1RfIiwic3ViIjoiMzgwMjQ0MiIsImlwIjoiMTc1LjEwLjI1Ljc3IiwiaXNzIjoiZWR1LmxhZ291LmNvbSIsInRva2VuVHlwZSI6MSwiZXhwIjoxNjMyMzcwNTA3LCJpYXQiOjE2MzE3NjU3MDd9.Bc7n-saoTPofT3HE4jkMaD4lysHUW4Od_m4ViMzImf69qLtyOTmuuEdNFcnrxwrdPbGb4SwGJM2nhaItPqdIahpFld8iH4BKc7kYPxmn3SXXu40TmqMpWJvtZw7w2yGpfF5fA4bP9rvOhurUHEQZdhfQhpjaBHlSAawPBRggr5wba1GLrhp8QsQpsqFCpTn7BeNpwEacrwIDm2opd-GOUq8Oba6Dmrxyjq2aLAP4UFOoc3qoxmGub7WaiE8ygF7HcZH6hjOJ_FjNsaOBBiIc6cU0kU02rc8BGdMuCc9EHiYL2-S8O0GK5YWM841NLWJHWRByAHy2U6X8MAwLTZ4Mbg",
        "edu-referer":
          "https://kaiwu.lagou.com/course/courseInfo.htm?courseId=694#/content",
        "x-l-req-header":
          '{"deviceType":1,"userToken":"$$$EDU_eyJraWQiOiJmNDcxNWRhZi0yNGY0LTQxZGUtOTdkMC0yMGZjYjYyODJlYzEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0Z3QiOiJfQ0FTX1RHVF9UR1QtNzgyZDg2MzMyMDI3NDFhMmJkMzcyYjg3NWRhNWQ2OGQtMjAyMTA5MTYxMjE1MDctX0NBU19UR1RfIiwic3ViIjoiMzgwMjQ0MiIsImlwIjoiMTc1LjEwLjI1Ljc3IiwiaXNzIjoiZWR1LmxhZ291LmNvbSIsInRva2VuVHlwZSI6MSwiZXhwIjoxNjMyMzcwNTA3LCJpYXQiOjE2MzE3NjU3MDd9.Bc7n-saoTPofT3HE4jkMaD4lysHUW4Od_m4ViMzImf69qLtyOTmuuEdNFcnrxwrdPbGb4SwGJM2nhaItPqdIahpFld8iH4BKc7kYPxmn3SXXu40TmqMpWJvtZw7w2yGpfF5fA4bP9rvOhurUHEQZdhfQhpjaBHlSAawPBRggr5wba1GLrhp8QsQpsqFCpTn7BeNpwEacrwIDm2opd-GOUq8Oba6Dmrxyjq2aLAP4UFOoc3qoxmGub7WaiE8ygF7HcZH6hjOJ_FjNsaOBBiIc6cU0kU02rc8BGdMuCc9EHiYL2-S8O0GK5YWM841NLWJHWRByAHy2U6X8MAwLTZ4Mbg"}',
      },
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.content;
    });
};

const getArticle = function (id) {
  return fetch(
    `https://gate.lagou.com/v1/neirong/kaiwu/getCourseLessonDetail?lessonId=${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "$$$EDU_eyJraWQiOiJmNDcxNWRhZi0yNGY0LTQxZGUtOTdkMC0yMGZjYjYyODJlYzEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0Z3QiOiJfQ0FTX1RHVF9UR1QtNzgyZDg2MzMyMDI3NDFhMmJkMzcyYjg3NWRhNWQ2OGQtMjAyMTA5MTYxMjE1MDctX0NBU19UR1RfIiwic3ViIjoiMzgwMjQ0MiIsImlwIjoiMTc1LjEwLjI1Ljc3IiwiaXNzIjoiZWR1LmxhZ291LmNvbSIsInRva2VuVHlwZSI6MSwiZXhwIjoxNjMyMzcwNTA3LCJpYXQiOjE2MzE3NjU3MDd9.Bc7n-saoTPofT3HE4jkMaD4lysHUW4Od_m4ViMzImf69qLtyOTmuuEdNFcnrxwrdPbGb4SwGJM2nhaItPqdIahpFld8iH4BKc7kYPxmn3SXXu40TmqMpWJvtZw7w2yGpfF5fA4bP9rvOhurUHEQZdhfQhpjaBHlSAawPBRggr5wba1GLrhp8QsQpsqFCpTn7BeNpwEacrwIDm2opd-GOUq8Oba6Dmrxyjq2aLAP4UFOoc3qoxmGub7WaiE8ygF7HcZH6hjOJ_FjNsaOBBiIc6cU0kU02rc8BGdMuCc9EHiYL2-S8O0GK5YWM841NLWJHWRByAHy2U6X8MAwLTZ4Mbg",
        "edu-referer":
          "https://kaiwu.lagou.com/course/courseInfo.htm?courseId=694#/content",
        "x-l-req-header":
          '{"deviceType":1,"userToken":"$$$EDU_eyJraWQiOiJmNDcxNWRhZi0yNGY0LTQxZGUtOTdkMC0yMGZjYjYyODJlYzEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0Z3QiOiJfQ0FTX1RHVF9UR1QtNzgyZDg2MzMyMDI3NDFhMmJkMzcyYjg3NWRhNWQ2OGQtMjAyMTA5MTYxMjE1MDctX0NBU19UR1RfIiwic3ViIjoiMzgwMjQ0MiIsImlwIjoiMTc1LjEwLjI1Ljc3IiwiaXNzIjoiZWR1LmxhZ291LmNvbSIsInRva2VuVHlwZSI6MSwiZXhwIjoxNjMyMzcwNTA3LCJpYXQiOjE2MzE3NjU3MDd9.Bc7n-saoTPofT3HE4jkMaD4lysHUW4Od_m4ViMzImf69qLtyOTmuuEdNFcnrxwrdPbGb4SwGJM2nhaItPqdIahpFld8iH4BKc7kYPxmn3SXXu40TmqMpWJvtZw7w2yGpfF5fA4bP9rvOhurUHEQZdhfQhpjaBHlSAawPBRggr5wba1GLrhp8QsQpsqFCpTn7BeNpwEacrwIDm2opd-GOUq8Oba6Dmrxyjq2aLAP4UFOoc3qoxmGub7WaiE8ygF7HcZH6hjOJ_FjNsaOBBiIc6cU0kU02rc8BGdMuCc9EHiYL2-S8O0GK5YWM841NLWJHWRByAHy2U6X8MAwLTZ4Mbg"}',
      },
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return {
        content: data.content.textContent,
        article_title: data.content.theme,
        title: data.content.theme,
        id: data.content.id,
      };
    });
};

const init = async function (id) {
  if (isInited) return;
  isInited = true;
  const { courseName, courseSectionList = [] } = await getSession(id);
  for (const dom of courseSectionList) {
    const h = dom.sectionName;
    const items = dom.courseLessons;
    const chapterData = {
      chapterTitle: h,
      children: [],
    };

    for (const item of items) {
      try {
        await sleep();
        const id = item.id;
        if (id) {
          const article = await getArticle(id);
          console.log("article==", article);
          chapterData.children.push(article);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    chapter.push(chapterData);
  }

  console.log("全部获取完毕");
};
