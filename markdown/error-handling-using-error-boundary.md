---
title: [React] ErrorBoundary 사용하여 에러 핸들링 하기
date: 2021-10-30 00:00:00
thumbnail: [React] ErrorBoundary 사용하여 에러 핸들링 하기.jpeg
---

### 📌 Intro
---
React는 16 버전부터 앱의 하위 컴포넌트 트리에서 발생하는 자바스크립트 에러를 기록하며 깨진 컴포넌트 트리 대신 폴백 UI를 보여주는 `ErrorBoundary`라는 개념을 도입하였다.

`ErrorBoundary`를 통해 **컴포넌트에서 에러가 발생했을 때 이를 캐치하여 리포팅**하고, **사용자들에게 에러가 발생하여 앱이 중단되는 것이 아닌 다른 대체 화면**을 보여줄 수 있다.

`ErrorBoundary`를 잘 이용하여 앱단과 오류가 발생할 컴포넌트에 잘 감싸주고, 사용자에게 보여줄 화면을 잘 활용(ex-새로고침 화면 보여주기)한다면, 좋은 에러 핸들링이 될 것이다.

이 포스팅에서는 내가 실제로 적용을 해보면서 필요에 맞게 커스텀한 `ErrorBoundary`를 소개해보고자 한다.

### ⚙️ ErrorBoundary
---
리엑트의 공식 홈페이지에서는 다음 코드와 같이 에러핸들링을 보여주고 있다.

```js
// React ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

대충 보자면, 에러의 상태를 state로 관리하고, 에러가 발생하면 이를 `getDerivedStateFromError`로 확인하여 에러의 상태를 바꿔 `fallback` UI를 보여주는 식이다.

React에서 제공한 예제만으로 에러핸들링을 하기에는 조금 아쉬움이 있어, `ErrorBoundary`를 나만의 방식으로 커스텀을 해보았다.

커스텀을 하기위해 많은 도움을 받은 글과 오픈소스가 있는데, 다음과 같다.
>
#### Reference
- [React에서 선언적으로 비동기 다루기 - JBEE 님](https://jbee.io/react/error-declarative-handling-1/)
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)

시간이 난다면, 이 포스팅보다 훨씬 수준 높고 좋은 글과 소스이니 위 두 개를 정독하기를 추천한다.

### 🛠 Custom ErrorBoundary
---

내가 `ErrorBoundary` 의 Custom을 하기 위해 신경을 쓴 점은 다음과 같다.
- Fallback 컴포넌트를 Props로 받을 수 있도록 해서 상황에 따른 Fallback의 활용
- 전체 앱을 감싸는 `ErrorBoundary`는 정해진 `ErrorPage`나 `IntroPage`로 에러핸들링
- 특정 컴포넌트를 감싸는 `ErrorBoundary`는 **새로고침 버튼**을 통해 에러를 reset하고 다시 해당 컴포넌트를 불러오도록 에러핸들링


`Error Boundary` 는 `react-error-boundary` 의 코드에서 필요한 것만 커스텀하여 사용하였다.

```ts
// Custom: ErrorBoundary

import * as React from 'react';

const changedArray = (prevArray: Array<unknown> = [], nextArray: Array<unknown> = []) =>
  prevArray.length !== nextArray.length || prevArray.some((item, index) => !Object.is(item, nextArray[index]));

interface ErrorBoundaryProps {
  onError?: (error: Error, info: { componentStack: string }) => void;
  resetKeys?: Array<unknown>;
  fallback?: React.ReactElement<unknown, string | React.FunctionComponent | typeof React.Component> | null
}

type ErrorBoundaryState = { error: Error | null };

const initialState: ErrorBoundaryState = { error: null };

class ErrorBoundary extends React.Component<React.PropsWithRef<React.PropsWithChildren<ErrorBoundaryProps>>,
  ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state = initialState;

  resetErrorBoundary = () => {
    this.reset();
  };

  reset() {
    this.setState(initialState);
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps,
                     prevState: ErrorBoundaryState,
  ) {
    const { error } = this.state;
    const { resetKeys } = this.props;

    if (
      error !== null &&
      prevState.error !== null &&
      changedArray(prevProps.resetKeys, resetKeys)
    ) {
      this.reset();
    }
  }

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error !== null) {
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      if (React.isValidElement(fallback)) {
        return fallback;
      }
      props.resetErrorBoundary();
    }
    return children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };
```

`ErrorBoundary`를 커스텀한 뒤, 새로고침을 할 수 있도록 `CustomErrorBoundary` 다음과 같이 컴포넌트를 생성해 주었다.

```ts
// CustomErrorBoundary

import { ComponentProps, CSSProperties, ReactNode, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

interface Props extends Omit<ErrorBoundaryProps, 'renderFallback'> {
  fallback?: ErrorBoundaryProps['fallback'];
  isRefresh?: boolean;
  style?: CSSProperties;
  onError?: (error: Error, info: { componentStack: string }) => void;
  children?: ReactNode;
}

const RefreshButton = ({
                         dispatch,
                         style
                       }: {
  dispatch: (flag: boolean) => void;
  style?: CSSProperties;
}): JSX.Element => {
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <button
        style={{ padding: '5px' }}
        onClick={() => {
          dispatch(false);
        }}
      >
        {'새로고침'}
      </button>
    </div>
  );
};

function CustomErrorBoundary({
                               fallback,
                               isRefresh,
                               style,
                               onError,
                               children,
                               ...errorBoundaryProps
                             }: Props): JSX.Element {
  const [refresh, setRefresh] = useState<boolean>(false);
  return (
    <ErrorBoundary
      fallback={fallback}
      resetKeys={[refresh]}
      onError={(error, info) => {
        isRefresh && setRefresh(true);
        onError && onError(error, info);
      }}
      {...errorBoundaryProps}
    >
      {!refresh ? children : <RefreshButton dispatch={(flag) => setRefresh(flag)} style={style}/>}
    </ErrorBoundary>
  );
}

export default CustomErrorBoundary;
```

이제 `CustomErrorBoundary`를 에러핸들링을 하려는 컴포넌트에 감싸주면 된다.
```js
// 특정 앱을 감싸고, fallback으로 새로고침 버튼 나타나게 하기
<CustomErrorBoundary
  isRefresh={true}
  style={{ height: 'calc(100vh - 140px)' }}
>
  <PostList/>
</CustomErrorBoundary>
```
이제, 감싼 컴포넌트에서 다음과 에러가 발생한다면, 다른 컴포넌트는 그대로 실행이 되고 에러가 발생한 해당 컴포넌트만 새로고침 fallback이 발생한다.
![](https://images.velog.io/images/rkd028/post/9342ec3a-6a59-4a12-82aa-b51b9aec1c6d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-31%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2012.03.10.png)

여기서, API 호출 같이 일시적인 오류일 때 새로고침을 눌러줘서 컴포넌트가 다시 정상적으로 렌더링 되는 것을 확인할 수 있다.
![](https://images.velog.io/images/rkd028/post/60f03869-1621-40ce-83da-2372ec53169e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-31%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2012.05.05.png)

```js
// 특정 앱을 감싸고, 지정 fallback 나타나게 하기
<CustomErrorBoundary
  fallback={<BoardLoading/>}
>
  <PostList/>
</CustomErrorBoundary>
```
`fallback`을 지정한다면, 에러가 발생 시, 다음과 같이 지정한 `fallback` 컴포넌트가 나오는 것을 확인할 수 있다.
![](https://images.velog.io/images/rkd028/post/0a74e225-17e1-479c-be07-4b1e084040ec/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-31%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2012.06.57.png)

### 🔑 결론
---
지금까지 `ErrorBoundary` 를 커스텀하는 방식을 소개해보았다. `ErrorBoundary`를 잘 활용한다면, 사용자에게 매우 좋은 경험을 선사해주고 개발과정에서도 에러를 핸들링하는데 큰 도움이 될 것이라 생각한다.

내가 커스텀한 에러 핸들링도 특정 상황에서 예기치 못한 문제가 생길 수 있을 것이다. 상황과 목표하는 에러 핸들링 방식에 따라 적절하게 커스텀을 해보기를 추천한다. 추후에 사용하는 핸들링 방식에 문제가 있거나 더 좋은 방법이 생긴다면 포스팅을 업데이트 할 수 있도록 하겠다.