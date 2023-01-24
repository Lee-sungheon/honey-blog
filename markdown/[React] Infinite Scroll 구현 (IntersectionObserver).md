### 📌 Intro
---
`Infinite Scroll` 은 말그대로 무한한 스크롤을 의미한다.

스마트폰이 대중화 되면서, 모바일웹이나 앱에서 페이지네이션을 통한 데이터 더 불러오기 방식은 사용자에게 큰 불편함을 불러일으킨다.

`인피니티 스크롤`은 이러한 관점에서 작은 스크린에서 단순 스크롤로 데이터를 더 불러오는 방식을 제공함으로 인해, 사용자에게 아주 좋은 UX를 제공해준다.

### 🛠 Infinite Scroll 구현 방식
---

`infinite Scroll`을 구현하는 방식은 크게 두 가지로 나뉜다.

- scroll event
- IntersectionObserver

#### scroll Event
스크롤 이벤트를 사용한 방법은 스크롤이 페이지의 끝에 닿았는지를 확인하고 추가적인 데이터를 불러오는 방식이다. 스크롤 이벤트를 사용한 방법은 쉽게 생각 및 구현이 가능하지만, 잦은 이벤트 호출로 인해  `reflow`, `repaint` 가 자주 일어나 성능이 좋지 못하며 이를 해결하기 위해 스크롤 이벤트에 `throttle` 이나 `requestAnimationFrame` 같은 처리를 해주어야 한다.

#### Interaction Observer API

`Interaction Observer` 를 처음 들어봤다면, 아래의 공식 문서를 확인해보는 것을 추천한다.
[Interacton Observer MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

간단하게만 설명하자면, **어떠한 엘리먼트를 관찰하여 관찰하는 엘리먼트의 가시성에 대한 변화를 감지하고 그에 대한 이벤트를 발생시킬 수 있도록 도와주는 API**이다.
`Interaction Observer`는 비동기적으로 실행되기 때문에 메인 스레드에 영향을 주지 않으면서 변경 사항을 관찰할 수 있으므로 `reflow`를 최소화 할 수가 있다. 따라서, 더욱 좋은 성능의 인피니티 스크롤의 구현이 가능해진다. 초기에 문제됐던 브라우저 지원도 이제는 `IE` 를 빼고 다 지원하고 있으므로 인피니티 스크롤을 구현하기 위한 최적의 방법이라고 볼 수 있다.

### 🔎 IntersectionObserver 구현 방법
---

`React + tyepscript` 의 환경에서 `IntersectionObserver` 를 다음과 같이 구현했다.

먼저, `useInfiniteScroll` 이라는 custom Hook을 만들어줬다.
인피니티 스크롤을 적용하고자 하는 리스트를 target과, 불러오는 리스트의 사이즈인 `pageSize` 리스트 안에서 끝에서 몇번째 아이템을 지날때 callback을 실행시킬지에 대한 `endPoint` 를 받았으며 `count` 로 state를 관리하여 `callback`이 실행됐을 때, `count`를 늘려주고 이 `count`에 따른 추가 데이터를 불러오는 식으로 사용할 수 있도록 구현하였다.

```ts
// useInfiniteScroll.ts

import { useEffect, useState, useMemo, MutableRefObject } from 'react';

// Props 타입 정의
interface InfiniteScrollProps {
  root?: Element | null;
  // root 의 margin 값
  rootMargin?: string;
  // target element 가 root 와 몇 % 교차했을 때, callback 을 실행할지 결정하는 값 
  target: MutableRefObject<HTMLDivElement | null>;
  threshold?: number;
  // 관찰을 할 Array
  targetArray: Array<any>;
  // 리스트의 갯수중 불러올 시점 (pageSize가 20이고 endPoint가 5라면, 15번째 리스트 아이템을 관찰)
  endPoint?: number;
}

const useInfiniteScroll = ({
                             root = null,
                             target,
                             threshold = 1,
                             rootMargin = '0px',
                             targetArray,
                             endPoint = 1
                           }: InfiniteScrollProps) => {
                             
  const [count, setCount] = useState<number>(0);
  const currentChild = useRef<Element | null>(null);
                             
  // IntersectionObserver 생성자 등록 및 callback 함수 등록
  const observer = useMemo(() => {
    return new IntersectionObserver(
      (entries, observer) => {
        if (target?.current === null) {
          return;
        }
        if (entries[0].isIntersecting) {
          setCount((v) => v + 1);
          // setCount가 무한으로 올라가는 것을 방지하기 위한 연결 끊음
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );
  }, [target, root, rootMargin, threshold]);

  useEffect(() => {
    if (target?.current === null) {
      return;
    }

    // 관측하는 Element가 달라졌을 때, 다시 관측을 시작
    const observeChild = target.current.children[target.current.children.length - endPoint];
    if (observeChild && currentChild.current !== observeChild) {
      currentChild.current = observeChild;
      observer.observe(observeChild);
    }

    return () => {
      if (target.current !== null && observer) {
        observer.unobserve(target.current);
      }
    };
  }, [count, targetArray, target, endPoint]);

  return {
    count,
    setCount
  };
};

export default useInfiniteScroll;
```

완성된 `useInfiniteScroll Hook`은 컴포넌트에서 다음과 같이 사용을 해주면 된다.

```tsx
export default function PostList() {
  const target = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [postList, setPostList] = useState<Array<any>>([]);

  const { count } = useInfiniteScroll({
    target: target,
    targetArray: postList,
    threshold: 0.2,
    endPoint: 3
  });

  useEffect(() => {
    // API 호출 부분 - 실제로는 count를 이용해 API를 호출
    setIsLoading(true);
    setTimeout(() => {
      setPostList([...postList, ...FAKE_DATA]);
      setIsLoading(false);
    }, 1000);
  }, [count]);

  return (
    <>
      // 인피니티 스크롤을 적용하고자 하는 target array에 ref 걸어주기
      <section ref={target}>
        {postList.map((post, idx) => (
          <PostItem key={idx} post={post}/>
        ))}
      </section>
      {isLoading && <Loading/>
      }
    </>
  );
}
```

실행 결과는 다음과 같으며, 스크롤이 부드럽게 잘 동작하는 것을 확인할 수 있다.

![](https://images.velog.io/images/rkd028/post/167f6fe6-d659-40fa-b402-9099c8beb6c7/Dec-04-2021%2023-11-24.gif)

### 🙌 마치며
---
지금까지 `React + typescirpt + Intersection Observer` 을 사용하여 인피니티 스크롤을 구현하는 방법을 알아보았다.

이 글에서는 데이터를 실제로 fetch 하는 법을 다루지 않았지만, 추후 기회가 된다면 `swr`의 `useSWRInfinite` 를 사용하여 데이터를 실제로 fetch 하는 방법을 포스팅 할 수 있도록 하겠다.

`Infinite Scroll`을 프로젝트에 잘 활용한다면 사용자에게 최적의 UX 경험을 제공할 수 있을 것이다.

### 📚 References
---
- [Interacton Observer MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [https://velog.io/@doondoony/IntersectionObserver](https://velog.io/@doondoony/IntersectionObserver)
- [https://medium.com/@swatisucharita94/react-infinite-scroll-with-intersection-observer-api-db3998e52d63](https://medium.com/@swatisucharita94/react-infinite-scroll-with-intersection-observer-api-db3998e52d63)
- [https://velog.io/@dev-hannahk/react-intersection-observer](https://velog.io/@dev-hannahk/react-intersection-observer)