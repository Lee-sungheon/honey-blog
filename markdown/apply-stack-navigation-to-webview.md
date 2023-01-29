---
title: [React Native] Webview에 Stack Navigation 적용하기
date: 2022-2-5 00:00:00
thumbnail: [React Native] Webview에 Stack Navigation 적용하기.jpeg
---

## 🎯 Intro
---
최근 사이드 프로젝트에서 앱 개발이 필요해 `하이브리드 앱` 을 만들고 있는데, `React Native` 와 `Webview` 를 이용하여 앱을 구현하고 있다.

웹뷰 기반의 하이브리드앱을 유독 해결이 어려운 문제가 하나 있었는데, 바로 `웹을 앱처럼 보이기 위해 페이지 전환을 할 때 스택 형태로 페이지 전환 효과를 주는 문제`였다.

웹뷰가 아닌 형태로 개발을 하는건 `react-navigation`을 쓰면 간단하게
해결이 되는데 웹뷰 형태에서는 웹 자체에 애니메이션을 주는게 맞는지, 앱 자체에 처리를 해야하는지에 대해 많은 삽질과 고민이 있었다. (관련 자료도 정말 찾기 힘들다..)

많은 고민 끝에 앱 단에서 `react-navigation` 및 `onMessage`를 사용하고, 웹에서 스택 네비게이션과 관련된 페이지를 전환시 `postMessage`를 사용하여 앱에 신호를 보내는 식으로 현재 사이드 프로젝트에 적용을 하였으며, 그 방법을 공유하고자 이렇게 포스팅을 하게 되었다.



## 📱React Native
---
React Native의 처리 과정이 가장 중요한데, 크게 해야할 것은 다음과 같다.

#### 1.`react-navigation` 설치 및 적용

https://reactnavigation.org/docs/getting-started
를 참고하여 `@react-navigation/native` 및 `@react-navigation/stack` 를 설치하여 준 뒤, `App.tsx` 에 `react-navigation`을 적용해준다.

``` tsx
// App.tsx

import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import WebviewContainer from './components/WebviewContainer';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Details"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        }}>
        <Stack.Screen
          options={{
            transitionSpec: {
              open: {
                animation: 'spring',
                  config: {
                    stiffness: 2000,
                      damping: 1000,
                  },
                  },
                    close: {
                      animation: 'spring',
                        config: {
                          stiffness: 1000,
                            damping: 500,
                        },
                        },
                    },
              }}
          name="Details"
          component={WebviewContainer}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;

```

위와 같이 `Stack Navigator`을 적용해주면 된다. `screenOptions`의 `headerShown` 속성을 `false`로 하여 헤더가 안보이도록 설정했으며, `TransitionPresets.SlideFromRightIOS`는 IOS의 transitionPresets을 android에서도 똑같이 적용하기 위해 설정했다.

`<Stack.Screen>`에서는 `components`를 웹뷰 컴포넌트로 설정해주고, `options`를 따로 주어 페이지 전환 애니메이션 속도를 조금더 빠르게 조절하였다.

#### 2. `webview 에서 onMessage` 처리

```tsx
// WebviewContainer.tsx

import React from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {StackActions} from '@react-navigation/native';

export default function WebviewContainer({navigation, route}) {
  const targetUrl = 'https://d1gbspr5q497yq.cloudfront.net';
  const url = route.params?.url ?? targetUrl + '/community';

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
    if (nativeEvent?.type === 'ROUTER_EVENT') {
      const path: string = nativeEvent.data;
      if (path === 'back') {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      } else {
        const pushAction = StackActions.push('Details', {
          url: `${targetUrl}${path}`,
          isStack: true,
        });
        navigation.dispatch(pushAction);
      }
    }
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{uri: url}}
      onMessage={requestOnMessage}
    />
  );
}

```

`Webview`의 `onMessage`를 이용하여 웹에서 스택 네비게이션이 필요한 페이지 이동에 대한 `message` 가 왔을 때, `stackActions`을 주는 식으로 처리를 하였다.



## 💻 Web(Next.js)
---

웹에서는 스택 네이게이션이 필요한 페이지에서 라우팅 처리를 해주기 위한 유틸 함수를 다음과 같이 커스텀 하였다.

``` ts
// stackRouter.ts

import { NextRouter } from 'next/router';

// react native app 환경인지 판단
const isApp = () => {
  let isApp = false;

  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    isApp = true;
  }

  return isApp;
};

// ReactNative Webview에 postMessage 요청
const sendRouterEvent = (path: string): void => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ROUTER_EVENT', data: path }));
};

// 뒤로가기 하는 경우
export const stackRouterBack = (router: NextRouter) => {
  if (isApp()) {
    sendRouterEvent('back');
  } else {
    router.back();
  }
};

// push 하는 경우
export const stackRouterPush = (router: NextRouter, url: string) => {
  if (isApp()) {
    sendRouterEvent(url);
  } else {
    router.push(url).then();
  }
};
```

웹인지 앱인지 체크를 하고, 웹일 때는 기존처럼 `next router`을 통해서 라우팅을 해주고, 앱일 경우 `postMessage`를 보내서 앱에서 스택 네비게이션 처리를 하는 방식이다.

사용법은 스택 네비게이션을 적용하려는 페이지 또는 컴포넌트에 다음과 같은 방법으로 사용해주면 된다.
```tsx
import { useRouter } from 'next/router';
import { stackRouterPush, stackRouterBack } from '@/utils/index';

export default function TestPage() {
  const router = useRouter();
  return (
    <>
      <button onClick={() => stackRouterPush(router, '/community')}>{'push 이동'}</button>
      <button onClick={() => stackRouterBack(router)}>{'뒤로 가기'}</button>
    </>
  );
}
```

여기까지 적용을 완료하고, 앱에서 확인을 해보면 다음과 같이 `Stack Navigation`이 잘 적용이 된 것을 확인할 수 있다.

![](https://images.velog.io/images/rkd028/post/0d1477af-e93c-4c16-a3db-49069daa778f/Feb-05-2022%2019-38-35.gif)



## 🙌 Outro
---
지금까지 `React Native`의 `Webview` 환경에서 `Stack Navigation`을 적용하는 법을 알아보았다.

웹뷰로 스택 에니매이션을 적용하기 위해 정말 많은 고민을 하였는데, 지금의 나로선 이 방법이 최선(?)이었던 것 같다.

지금의 구현 형태는 웹과 앱에서 모두 처리를 해줘야하는데 뭔가 한쪽에서만 처리를 할 수 있는 방법이 있지 않을까? 라는 고민도 계속 해보고 있는 중이다.

하이브리드 + 웹뷰 환경에서 스택 네비게이션을 구현하기 위한 더 좋은 방법을 알게 된다면 추후에 또 소개를 할 수 있도록 해보겠다.

