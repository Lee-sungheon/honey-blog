---
title: [Next js] Serverless + Github Actions으로 Next js 배포 및 자동화(CI,CD)하기
date: 2021-9-24 00:00:00
thumbnail: [Next js] Serverless + Github Actions으로 Next js 배포 및 자동화(CI,CD)하기.jpeg
---

### 📌 Intro
---
`Next js` 는 CSR과 SSR이 결합되어 있는 형태(나아가서 SSG까지..)라 다른 프론트 프로젝트 배포보다 신경 써야 할 일이 많다.

`Next js`로 만든 웹 애플리케이션을 배포하고, CI/CD를 통한 자동화를 하는 방법은 크게 다음과 같이 나눌 수 있을 것이다.

- `EC2 + NginX + CodeDeploy` 등의 조합으로 EC2를 위주로 웹서버를 직접 구축하는 방법
- `S3 + CloudFront + Lambda@Edge`를 직접 구축 또는 `serverless` 사용
- `Vercel`, `amplify`, `netlify` 등 배포 플렛폼을 사용


등등 다양한 방법이 있을 것이다.

각자 배포 속도, 관리, 비용 등에서 장단점이 명확하여 자신의 상황에 맞게 배포를 진행을 하면 될 것이다. 이 글에서는`Serverless`로 배포 하는 법을 A-Z까지 소개하고자 한다.


### 📌 Env && Tool
---
배포를 진행한 환경 및 사용 툴은 크게 다음과 같다.
>
- Next.js (프로젝트)
- Serverless (AWS) (배포)
- Github Action (자동화)


### 📌 Next.js 프로젝트 생성
---
- `yarn create next-app --typescript` 으로 Next.js 프로젝트를 생성해준다. 나는 타입스크립트를 사용할 것이기 때문에 typescript version으로 프로젝트를 생성하였다.
  ![](https://images.velog.io/images/rkd028/post/ea19205c-53a7-4eee-aa93-2edb7fae7d6f/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.28.40.png)
- 설치한 폴더로 이동하여 `yarn dev` 를 실행시켜보면 로컬에서 서버가 실행되는 것을 확인할 수 있다.
  ![](https://images.velog.io/images/rkd028/post/72b10749-465b-4c0e-b3a2-ac19cb884fe0/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.31.16.png)![](https://images.velog.io/images/rkd028/post/5f3b55e6-d7cf-475d-9ebb-2b65b55b94ae/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.32.20.png)


### 📌 Serverless 관련 설정
---
- 프로젝트 폴더 내의 `pacakage.json` 파일을 다음과 같이 설정해준다.
    - `script`에 `"deploy: "serverless"`를 추가하여 GitbubActions에서 `serverless`를 실행할 스크립트를 만들어준다.
        - `devDependencies`에 `serverless`를 추가해준다.
```js
// package.json
{
  "name": "@zaritalk/deploy",
  "version": "0.1.0",
  "description": "Next.js Deploy",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "serverless"
  },
  "dependencies": {
    "next": "^11.1.2",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
  },
  "devDependencies": {
    "@types/react": "17.0.26",
    "eslint": "7.32.0",
    "eslint-config-next": "11.1.2",
    "serverless": "^2.59.0",
    "typescript": "4.4.3"
  }
}

```
- 프로젝트 폴더의 루트에 `serverless.yml` 파일을 추가해준다.

```yml
# serverless.yml
myNextApplication:
  component: '@sls-next/serverless-component@latest'
  inputs:
    name:
      defaultLambda: DefaultLambda	#Default Lambda의 이름 설정 
      imageLambda: ImageLambda	# Image Lambda의 이름 설정
    bucketRegion: 'ap-northeast-2'	# S3 Bucket 지역 설정
    cloudfront:
      comment: 'next deploy'	# CloudFront 설명 설정
```

간단하게 `serverless` 설정이 끝났다. 이제 `Github Action` 관련 설정을 해서 repository에 push만 해줘도 배포가 자동화되도록 설정해보자.

### 📌 Github Action 설정
---

- 먼저 `Github Action`에서 `Serverless` 배포를 위해 AWS에서 접근하기 위한 Access Key를 설정해주어야 한다. 따라서 AWS에서 권한 키를 발급받아야 한다.
- `IAM` -> `사용자`에 접속하여  `사용자 추가`를 클릭한다.
  ![](https://images.velog.io/images/rkd028/post/748e69fc-5ca9-45a0-b8a2-adfbd2f7b1c1/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.30.35.png)

- 사용자 이름을 입력하고, `엑세스 키 - 프로그래밍 방식 엑세스`에 체크해준 뒤 다음으로 넘어가준다.
  ![](https://images.velog.io/images/rkd028/post/38024b86-516d-4388-b8fd-09ec96247623/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.32.22.png)

- `기존 정책 직접 연결`을 클릭해준 뒤, `AdministratorAccess`에 체크해준 뒤 다음으로 넘어가준다. (AdministratorAccess은 AWS의 전체 권한을 주는 것)
  ![](https://images.velog.io/images/rkd028/post/a547e5f4-89f1-4576-9bcc-1ecafc6d9696/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.33.49.png)

- 그 다음부터는 선택사항이므로 모두 다음으로 넘기고 최종적으로 사용자 추가를 완료해주면 다음과 같이 액세스 키와 비밀 액세스 키를 확인할 수 있다.
  ![](https://images.velog.io/images/rkd028/post/81a8b83e-70a1-4e8d-948e-0b098ed51f9a/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.38.03.png)

- `Github`의 프로젝트 Repository의 `Settings` -> `Secrets`로 가서 AWS에서 발급받은 `AWS 액세스 키`와 `비밀 엑세스 키`를 다음과 같이 등록해준다.
  ![](https://images.velog.io/images/rkd028/post/48808c6c-7f09-4eb4-a73c-71a295a91541/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.43.46.png)

- AWS 권한 관련 설정이 끝났다. 이제 프로젝트 폴더의 루트에 `.github` 폴더를 만들고 그 안에 `workflows` 폴더를 만든 뒤 `.github/workflows`	경로에  `serverless.yml` 파일을 다음과 같이 추가해준다.

```yml
name: NEXT Deploy
on:
  push:
    branches: master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code.
        uses: actions/checkout@master
        with:
          ref: master

      - name: Install Dependencies
        run: |
          npm install

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Deploy Next.js app
        run: |
          npm run deploy

```

여기까지 잘 따라왔다면, 배포를 위한 모든 설정이 끝났다고 볼 수 있다.

### 📌 실행 결과
---
자, 이제 프로젝트 Repository에 push를 해보자.
push 후 Repository에의 Actions 탭을 확인해보면 `Github Action`이 작동하는 것을 확인할 수 있다.
![](https://images.velog.io/images/rkd028/post/029a722c-5615-452f-a189-021722847672/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.56.03.png)
해당 워크플로우를 클릭하면 워크플로우의 현재 상황도 볼 수 있다.
![](https://images.velog.io/images/rkd028/post/620a1f02-234b-4a45-829d-f9ec96853f2d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.59.32.png)

드디어 배포가 완료됐다! 배포가 완료된 후 `Deploy Next.js app`  job의 실행내역을 보면 배포가 된 url과 bucketName, cloudfront Id를 확인할 수 있다.

![](https://images.velog.io/images/rkd028/post/1bb785af-db49-4826-8391-639b65df5c6e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.02.55.png)


배포가 완료된 url로 접속을 해보면 배포가 잘 된 것을 확인할 수 있다.
![](https://images.velog.io/images/rkd028/post/0c945195-c520-4f1a-8aa9-2a9e958976d4/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.06.40.png)

AWS에 접속해보면 CloudFront, S3, Lambda도 잘 생성돼 있는 것을 확인할 수 있다. (단, Lambda의 생성을 확인하려면 지역을 `미국 동부 (버지니아 북부)us-east-1`로 선택해주어야 한다)
![](https://images.velog.io/images/rkd028/post/ebc1a955-0385-4549-bf31-e17c586b1038/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.08.05.png)![](https://images.velog.io/images/rkd028/post/75aed35b-7bab-4900-bc9c-82ad6e8fe2f8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.08.27.png)
![](https://images.velog.io/images/rkd028/post/66beee84-e71d-4c97-9d91-49871c6f3899/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-03%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.08.57.png)

### 📌 추가 설정
---
추가적으로, serverless를 실행할 때마다 CloudFront와 S3 Bucket, Lambda가 새로 생성되는데, 이를 고정하고 싶다면 `serverless.yml`을 다음과 같이 수정해주자.

`bucketName`과 `distributionId` 는 AWS나 Github Action의 실행 결과를 보면 확인할 수 있다.
```yml
# serverless.yml
myNextApplication:
  component: '@sls-next/serverless-component@latest'
  inputs:
    name:
      defaultLambda: DefaultLambda
      imageLambda: ImageLambda
    bucketRegion: 'ap-northeast-2'
    bucketName: 'kw5btnot-k5yh9h'
    cloudfront:
      distributionId: 'E3V7OUUNVSTJZB',
      comment: 'next deploy'
```

### 📌 마무리
---
지금까지 `Next.js` 프로젝트를 `Serverless`와 `Github Action`을 사용해 배포를 자동화하는 법을 알아보았다.

정말 기본적인 환경에서 A-Z 까지 배포하는 법을 알려주려고 글을 작성했기 때문에 여러 예외 상황들은 배제하였다. (도메인 연결하기, Mono Repo에서 배포하기, 캐시컨트롤 처리, Node dev-product 배포 환경 구성 등등..)

추후에 기회가 된다면 이러한 예외 상황들도 포스팅 할 수 있도록 하겠다.