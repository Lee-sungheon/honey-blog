---
title: [React Hook Form] useRef 연결하여 사용하기
date: 2021-8-16 00:00:00
thumbnail: [React Hook Form] useRef 연결하여 사용하기.jpeg
---

`React-use-Form`을 사용하다 보면, `useRef`를 연결하여 사용할 일(스크롤 관련이나, 포커싱 관련 이벤트를 처리할 때)이 종종 있다.

예를 들어, `textarea`의 인풋 창을 수정할 때 `value`의 높이에 따라 `textarea`의 크기를 조절할 때가 있다.

그런 경우, 간단하게 아래의 코드처럼 `useRef`를 reactFrom 요소와 연결한 뒤, 평소에 사용하던 것처럼 `useRef`를 사용해주면 간단하게 해결이 된다.

```js
const inputRef = useRef<HTMLTextAreaElement | null>(null);

const { register } = useForm({
  defaultValues: {
    inputValue: ''
  }
});
const { ref, ...rest } = register('inputValue');

useEffect(() => {
  if (inputRef.current !== null) {
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }
}, [inputRef]);

```
```js
return (
  <textarea
  {...rest}
    ref={(e) => {
      ref(e);
      inputRef.current = e;
    }}
  />
)
```

>#### Reference
[React Hook Form FAQS](https://react-hook-form.com/faqs#question5)
