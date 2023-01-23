## 🎯 Intro
---
`Next.js` 를 꽤 오랜 기간 사용하다 보니 프론트에서 서버(`getServerSideProps`, `getInitialProps`)를 사용할 수 있는 점 이 상당히 매력적이라는걸 느끼는 것 같다.

위 두 가지 방식(`getServerSideProps`, `getInitialProps`)은 `Next.js` 를 사용하는 이유 중 하나이기도 하고 레퍼런스도 많기에 어떤식으로 사용을 해야하는지 잘 알고 있지만 `API Route` 에 대해서는 기본 사용법만 나와있고 실제로 활용하는 방법에 대한 레퍼런스가 잘 없어서 내가 회사 프로젝트 및 개인 프로젝트를 하면서 활용했던 방법들을 간단하게 공유하고자 한다.

이 `API Route` 는 `next.js`의 자체 서버를 사용해서 다른 서버가 필요없이 서버리스하게 API를 간단하게 만들 수 있다는 장점이 있다. 이를 잘 활용하면 개발을 하다가 `Backend API` 가 필요한 시점에서 백엔드에게 API 요청을 하거나, 따로 API 서버를 팔 필요가 없이 프론트단에서 처리를 할 수가 있게 된다.

`Next API Routes` 가 뭔지 모르겠다면 아래 공식문서를 참조하길 추천한다.
> [Next API Routes](https://nextjs.org/docs/api-routes/introduction)



## 1️⃣ BFF(Backend For Frontend)
---
실제로 개발을 진행하다 보면 다양한 API Spec을 요구하게 되는 기획들이 많이 발생하게 되고, 이를 일일히 대응해서 Backend에서 API를 파다보면 비용이나 성능적인 측면에서 문제가 생기게 된다.
따라서 기본적인 스펙을 누려주는 API를 Frontend에서 `BFF`를 활용해서 원하는 조건대로 조합해 화면에 필요한 데이터만 내려주는 식으로 활용을 할 수 있다.

가령 커뮤니티에서 글상세를 내려주는 API가 있는데 해당 글 PK의 다음글 목록(다음 PK 3개)을 화면에 보여달라는 요청을 받았을 때, 다음과 같이 `Next API Routes`를 이용해서 필요한 API를 내려줄 수 있다.

```ts
// '/pages/api/community/[postPk]/next-posts.ts'

const getPostDetail = async (postPk: number) => {
  try {
    const res = await axios.get(`${API_URL}/community/posts/${postPk}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export default async function next-posts(req, res) {
  try {
    if (req.method === 'GET') {
      const query = req.query;
      const postPk = parseInt(query['postPk'] as string);

      const nextPosts = Array.from({ length: 3 }, (v, i) => i + 1).reduce(async (prevPromise, index) => (
        prevPromise.then(async prevRes => {
          const nextPostPk = postPk - index;
          if (nextPostPk > 0) {
            const result = await getPostDetail(nextPostPk);

            if (result?.data) {
              return [...prevRes, result.data];
            }
          }
          return [...prevRes];
        })
      ), Promise.resolve([]));

      const result = await nextPosts;

      if (result) {
        res.status(200).json({ data });
      } else {
        res.status(400).json({ message: err })
      }

    } else {
      res.status(400).json({ message: '400 Error' });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
```

이 외에도 기존의 API에서 화면을 그리는데 필요한 API만 내려주거나, PC나 웹/앱 환경에 따라 API의 커스텀이 필요할 때 등 다양하게 BFF를 활용할 수 있다.



## 2️⃣ 쿠키 저장
---
애플리케이션을 개발하면서 클라이언트에서 쿠키를 다루다보면 발생하는 이슈가 하나 있는데, 바로 쿠키의 `expires` 문제이다.

> [브라우저별 쿠키 expires 정책 확인하기](https://www.cookiestatus.com/)


위 사이트의 쿠키 정책을 확인해보면 `safari` 나 `brave` 브라우저에서는 `document.cookie` 를 사용해서 쿠키를 설정하면 `최대 expires 설정 기간`이 `7일` 밖에 되지 않는다. 즉, `클라이언트단에서 쿠키를 설정하면 브라우저에 따라 최대 7일까지만 쿠키가 남는다`는 것이다.

개발을 할 때 세션이나 기간에 대한 요구사항이 있으면 일정 기간동안 쿠키에 담아서 확인하는 경우가 생기는데, 이 기간이 7일을 넘어가면 상당히 난감한데 이 때 `API Routes`를 사용해서 Server를 통한 쿠키를 저장하면 expires의 제한이 없이 설정이 가능해진다.

```ts
export default async function setCookie(req, res) {
  try {
    if (req.method === 'POST') {
      if (req?.body) {
        const { key, value, expires } = req.body;

        if (key && value && expires) {
          res.setHeader('Set-Cookie', `${key}=${value}; path=/; expires=${expires}; sameSite=lax;`);
        }

        res.status(200).json({ data: 'set cookie success' });
      } else {
        res.status(400).json({ message: '400 Error' });
      }
    } else {
      res.status(400).json({ message: '400 Error' });
    }
  } catch (e) {
    res.status(400).json(e);
  }
}
```



## 3️⃣ 외부 라이브러리 커스텀
---
개발을 하다보면 외부 라이브러리를 끌어다 커스텀해야 하는 경우가 생기는데 직접 clone을 통해 라이브러리 자체를 수정하는 방법도 있지만, 상황에 따라서는 `API Routes` 를 통한 커스텀도 가능하다.

아래 코드에서 open graph data를 가져오는 라이브러리(`open-graph-scraper`)가 있는데, 이 라이브러리는 url을 리스트로 받아서 data를 뿌려주는 기능은 없다. 이러한 기능을 추가하기 위해 다음과 같이 커스텀을하고, 사용하는 쪽에서는 url List를 넘겨줘서 결과 리스트를 받아 올 수 있다.

```ts
import ogs from 'open-graph-scraper';

export default async function getOpenGraphs(req, res) {
  try {
    if (req.method === 'POST') {
      if (req.body?.urlList) {
        const urlData = req.body.urlList.reduce(async (prevPromise, matchUrl) => {
            const param = { url: matchUrl };

            return prevPromise.then(async prevRes => {
              const ogData = await ogs({
                url: param.url,
                downloadLimit: 30000000
              });

              if (ogData?.result) {
                return [...prevRes, { ...ogData.result, url: matchUrl }];
              } else {
                return [...prevRes];
              }
            });
          }
          , Promise.resolve([]));

        urlData
          .then(data => res.status(200).json({ data }))
          .catch((err) => res.status(400).json({ message: err }));

      } else {
        res.status(400).json({ message: 'url data가 없습니다.' });
      }
    } else {
      res.status(400).json({ message: '잘못된 HTTP 요청입니다.' });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ data: e, message: '잘못된 HTTP 요청입니다.' });
  }
};

```



## 4️⃣ 외부 이미지 CORS 우회
---
`Next Image`를 사용하다 보면 `remotePatterns` 에 등록된 도메인만 사용을 할 수 있는데, 프론트단에서 외부 이미지를 끌어다 쓰는 경우 `remotePatterns`를 모두 열어주는 수밖에 없다.
하지만 이런 경우에, 외부 이미지를 `API Routes`를 사용해서 한번 우회해서 `base64` 형태로 변환하여 보여주면 `remotePatterns`을 특정 도메인만 한정하면서 외부 이미지를 사용할 수가 있다.

```ts
function getUrlImageToBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'));
}

export default async function getExternalImage(req, res) {
  try {
    if (req.method === 'POST') {
      if (req.body?.url) {
        const response = await getUrlImageToBase64(req.body.url);
        res.status(200).json({ data: response });
      } else {
        res.status(400).json({ message: '400 Error' });
      }
    } else {
      res.status(400).json({ message: '400 Error' });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json(e);
  }
};
```


## 🙌 Outro
---
위 활용법들을 통해 알 수 있듯이, `API Routes` 를 잘 활용하면 프론트 어플리케이션을 개발하는 과정에서 생길 수 있는 몇몇 문제들을 간단하게 해결할 수 있다. 소개된 활용법 이외에도 무궁무진한 방법들이 많을 것이라고 생각한다.
(더 좋은 활용법이나 잘못된 활용법이 있다면 댓글로 알려주시면 감사하겠습니다..! 🙇‍♂️)

단, `Next.js` 도 결국 서버이기 때문에, 너무 많은 `API Route`를 호출하게 된다면 서버에 과부하가 올 수도 있기에 꼭 필요한 것만 상황에 맞춰서 쓰는 것을 추천한다!