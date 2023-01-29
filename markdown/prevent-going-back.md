---
title: [React + Javascript] 뒤로가기 막기(이벤트 최소화)
date: 2021-7-31 00:00:00
thumbnail: [React + Javascript] 뒤로가기 막기(이벤트 최소화).jpeg
---

사용자가 뒤로가기를 눌렀을 때, 이를 막는 팝업을 띄우는 이슈를 처리할 일이 생겼다.
```js
history.pushState(null, null, location.href);
window.onpopstate = function(event) { history.go(1); };
```
구글링을 통해 찾아본 결과, 위와 같은 방법이 가장 널리 쓰이는 뒤로가기 막기 방법 중 하나였다.

이 방법을 React 프로젝트에 적용하여 사용하였을 때, 다음과 같은 2가지 문제에 직면했다.

> - 뒤로가기를 눌렀을 때, popstate 이벤트가 두 번 실행되는 문제
- 특정 브라우저에서 뒤로가기를 막고자 하는 화면에 포커싱을 주지 않고 뒤로가기를 누르면 뒤로 가기가 막히지 않고 되는 문제


**1. 뒤로가기를 눌렀을 때, popstate 이벤트가 두 번 실행되는 문제**

리엑트로 위의 방식으로 뒤로가기 막기를 구현한다면 다음과 같은 코드가 될 것이다.

```js
  useEffect(() => {
    const preventGoBack = () => {
      history.go(1);
      console.log('prevent go back!');
    };
    
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);
    
    return () => window.removeEventListener('popstate', preventGoBack);
  }, []);   
```
#### ![](https://images.velog.io/images/rkd028/post/54737f79-ab17-46a7-8045-2e0377a36ca8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-07-31%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.04.36.png)
위 코드를 실행했을 때, 다음과 같이 popstate 이벤트가 2번 실행되는 것을 알 수 있다.

왜 이런 상황이 발생하는 걸까?

이 상황을 이해하기 위해선 `popstate` 이벤트에 대한 이해가 필요하다.
[_Mozilla_ 의 공식 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)를 확인해보면,
> popstate 이벤트는 사용자의 세션 기록 탐색으로 인해 현재 활성화된 기록 항목이 바뀔 때 발생합니다. 만약 활성화된 엔트리가 history.pushState() 메서드나 history.replaceState() 메서드에 의해 생성되면, popstate 이벤트의 state 속성은 히스토리 엔트리 state 객체의 복사본을 갖게 됩니다.
>
history.pushState() 또는 history.replaceState()는 popstate 이벤트를 발생시키지 않는 것에 유의합니다.popstate 이벤트는 브라우저의 백 버튼이나 (history.back() 호출) 등을 통해서만 발생된다.

`popstate` 이벤트는 현재 활성화된 기록 항목이 바뀔 때 발생하며, 이에 영향을 미치는 이벤트는 브라우저의 뒤로가기나 앞으로가기 버튼 등에 의하여 반응한다는 것을 알 수 있다.

이 원리에 따라 브라우저에서 뒤로가기를 클릭했을 때 `popstate` 이벤트가 발생하여 등록된 함수가 콜백 된다.
이 등록된 함수에 `history.go()` 나 `history.forward()` 가 있다면, 세션 기록이 바뀌면서 한번 더 `popstate` 이벤트가 발생하는 것이다.

이를 해결하기 위해서
> `popstate`는 history.pushState() 또는 history.replaceState()는 popstate 이벤트를 발생시키지 않는 것에 유의합니다.

이 부분에 주목할 필요가 있다. `history.pushState()`는 `popstate` 이벤트를 발생시키지 않는 다는 점을 이용해, 다음과 같이 코드를 수정할 수 있을 것이다.


```js
  useEffect(() => {
    const preventGoBack = () => {
      // change start
      history.pushState(null, '', location.href);
      // change end
      console.log('prevent go back!');
    };
    
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);
    
    return () => window.removeEventListener('popstate', preventGoBack);
  }, []);   
```

이와 같이 코드를 바꿨을 때,
#### ![](https://images.velog.io/images/rkd028/post/640c8d5e-c563-4ca4-b3c1-b7274971035d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-07-31%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.47.34.png)

다음과 같이 `popstate` 이벤트가 한번만 실행되는 것을 확인할 수 있다.


**2. 특정 브라우저에서 뒤로가기를 막고자 하는 화면에 포커싱을 주지 않고 뒤로가기를 누르면 뒤로 가기가 막히지 않고 되는 문제**

특정 브라우저에서 페이지가 렌더링되고 웹사이트와의 interact가 없이 뒤로가기를 눌렀을 때, `popstate` 이벤트가 발생하지 않고 그대로 뒤로가기가 되는 현상이었다.

이 현상은 크로미움 기반 브라우저(크롬, 브레이브, 오페라, 삼성브라우저 등)에서 나타났는데 구글링 결과 **크롬의 보안 정책** 상 막아 놓은 것이었다.

이를 해결하고자 많은 시도와 삽질(?)을 해봤지만 뜻대로 되지 않아 이 부분은 감안 한 채로 이슈를 마무리하였다.

>#### Reference
[MDN Web Docs - popstate](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)


> **_2번 문제를 해결하는 방법을 아시거나 전체적으로 잘못된 부분이 있다면 적극적인 의견 및 피드백 환영합니다!_**
