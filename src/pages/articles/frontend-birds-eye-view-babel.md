---
templateKey: blog-post
title: '프론트엔드 기술 조감도 : Babel'
date: 2018-12-18T07:58:37.037Z
description: '자바스크립트 컴파일러 Babel과 관련된 플러그인, 프리셋, 폴리필 등의 개념에 대해 소개합니다.'
tags:
  - 프론트엔드
  - 자바스크립트
  - ECMAScript
  - Babel
---
## 들어가며
오늘날 프론트엔드 생태계에서 Babel은 필수 도구라 부르기에 부족함이 없다. 그런 만큼 튜토리얼과 스타터 킷 등 쉽게 도입할 수 있는 수단도 잘 마련되어 있다. 아이러니하게도, 그런 탓인지 Babel을 쓰면서도 막상 각 구성요소의 역할을 정확히 이해하지 못하는 경우를 종종 본다.

이 글은 Babel과 관련된 큰 단위의 개념에 대해 소개한다. 설정 옵션이나 주의할 점 등, 각 항목별로 알아야 할 자세한 내용은 공식 문서가 이미 충분히 잘 설명하고 있어 굳이 다루지 않았다.

> NOTE: 이 글은 Babel v7.1.0 기준으로 작성되었습니다.

## Babel?
**Babel은 최신 스펙 및 프로포절 등을 포함하는 자바스크립트 코드를 ES5 환경에서 잘 동작하도록 컴파일하는 자바스크립트 컴파일러다.**

Babel의 전신은 [6to5](https://github.com/6to5) 라는 프로젝트다. 이름에서 드러나듯, 당시 최신 ECMAScript 스펙이던 ECMAScript2015(ES6) 코드를 ES5로 컴파일하는 도구였던 6to5가 2015년,[50만 다운로드를 앞두고 작성한 블로그 글](https://babeljs.io/blog/2015/02/15/not-born-to-die)에서 발표한 새 이름이 바로 Babel이다.

> 6to5 is now Babel.  

Babel 공식 웹사이트의 [What is Babel?](https://babeljs.io/docs/en/#babel-is-a-javascript-compiler) 문서는 아래와 같이 시작한다.

> 바벨은 주로 ECMAScript 2015+ 코드를 현재 및 과거의 브라우저와 같은 환경에서 호환되는 버전으로 변환하는데 주로 사용되는 도구입니다. _Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments._  

좀 더 쉽게 말하자면, Babel은 최신 자바스크립트 스펙과 기술을 사용해 작성한 코드를 오래 된 브라우저에서도 동작하는 코드로 변환해준다. 그렇다면 Babel은 과연 어떤 코드를 어떻게 변환할지 어떻게 판단할까?

### 참고자료
* [What is Babel? · Babel](https://babeljs.io/docs/en/)
* [ECMAScript와 TC39](https://ahnheejong.name/articles/ecmascript-tc39/)

## 플러그인
**Babel 플러그인은 Babel이 어떤 코드를 어떻게 변환 할지에 대한 규칙을 나타낸다.**

Babel이 소스 코드를 ES5 코드(타겟 코드)로 변환하는 과정은 크게 다음 세 단계로 나누어 생각할 수 있다.

1. 구문 분석_parsing_: 소스 코드를 읽어 [추상 구문 트리](https://ko.wikipedia.org/wiki/%EC%B6%94%EC%83%81_%EA%B5%AC%EB%AC%B8_%ED%8A%B8%EB%A6%AC)로 변환하는 단계.
2. 변환_transformation_: 정해진 규칙대로 추상 구문 트리에 변경을 가하는 단계.
3. 출력_printing_: 변경이 가해진 추상 구문 트리를 다시 코드로 출력하는 단계.

이 과정을 의사 코드로 표현하면 다음과 같다.

```typescript
import { AST, Rule } from './model';
import rules from './rules';

function parse(sourceCode: string): AST {
  /* 소스 코드를 AST로 변환 */
  /* ... */
  return sourceAST;
}

function transform(sourceAST: SourceAST, rules: Rule[]): AST {
  /* rules 에 들어있는 규칙에 기반해 AST 수준에서 코드 변환 */
  /* ... */
  return transformedAST;
}

function print(transformedAST: AST): string {
  /* 변환된 AST를 다시 코드로 변환 */
  /* ... */
  return outputCode;
}

function babel(sourceCode: string, rules: Rule[]) {
  return print(
    transform(
      parse(sourceCode),
      rules
    )
  );
}
```

아무런 설정 없이 실행한다면 Babel은 위 코드에서 `rules` 변수가  `[]` 인 상황처럼 동작한다. 즉, 아무런 변경이 가해지지 않은 소스 코드를 그대로의 결과물을 내뱉는다. Babel이 실제로 쓸모를 갖기 위해선 `transform` 단계에서 사용할 코드 변환 규칙(`Rule`)이 추가되어야 한다. 

Babel 플러그인은 바로 이 규칙의 역할을 한다. 모든 플러그인은 **어떤 조건을 만족하는 코드를 만나면 그 코드를 이렇게 해석하고 변환하라**는 규칙을 담고 있다. [몇 가지](https://babeljs.io/docs/en/babel-plugin-transform-spread) [예시 문서](https://babeljs.io/docs/en/babel-plugin-transform-exponentiation-operator)를 보면 플러그인의 역할이 무엇인지 쉽게 감을 잡을 수 있을 것이다.

### 플러그인의 종류
Babel 플러그인은 크게 두 종류로 나뉜다.

* **변환 플러그인**은 Babel에게 코드에 특정 표현/문법이 나타나면 특정 방식으로 변환하도록 한다.
* **문법 플러그인**은 Babel이 코드의 특정 표현/문법을 이해(파싱)할 수 있게 한다. 어떤 문법과 연관된 변환 플러그인은 문법 플러그인을 자동으로 포함한다.

어떤 플러그인이 어느 경우에 해당하는지는 플러그인 이름의 prefix (`plugin-transform-...` 또는 `plugin-syntax-...`) 유추할 수 있는 경우가 많다.

### 참고자료
* [Plugins · Babel](https://babeljs.io/docs/en/plugins)
* [babel-handbook](https://github.com/jamiebuilds/babel-handbook)

## 프리셋
**Babel 프리셋은 Babel 플러그인의 모음이다.**

함께 자주 쓰이는 (쓰여야 하는) 특정 플러그인의 조합을 생각해보자. 매번 프로그래머가 플러그인을 일일이 더해주는 일은 번거롭고 쉽게 실수를 유발할 것이다. 때문에 Babel은 프리셋이라는 개념을 통해 여러 플러그인을 묶어서 다루는 방법을 제공한다.

Babel 팀이 공식적으로 지원하는 프리셋으로는 [`preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript), [`preset-minify`](https://babeljs.io/docs/en/babel-preset-minify), [`preset-react`](https://babeljs.io/docs/en/babel-preset-react) 등이 존재하며, 프리셋은 기본적으로 플러그인의 조합에 불과한 만큼 그 외에도 수많은 [커뮤니티 기반 프리셋](https://www.npmjs.com/search?q=babel-preset)이 존재한다.

### `preset-env`
여러 플러그인의 정적인 집합인 여타 프리셋과 달리, `preset-env`는 필요한 플러그인을 **프로젝트가 지원하고자 하는 환경에 기반해 빌드 타임에 동적으로 결정**하는 ✨특별한✨ 프리셋이다.

`preset-env`를 사용하는 프로그래머는 지원하고자 하는 환경을 [`browserslist`  설정]([) 형식으로 명시할 수 있다. `preset-env`는 이렇게 명시된 환경에 필요한 플러그인을 [`compat-table`](https://github.com/kangax/compat-table)의 정보를 활용해 결정하고, 빌드 과정에 포함시킨다.

### 참고자료
* [Presets · Babel](https://babeljs.io/docs/en/presets)
* [@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env.html)

## 폴리필
**Babel 폴리필은 최신 ECMAScript 환경을 만들기 위해 코드가 실행되는 환경에 존재하지 않는 빌트인, 메소드 등을 추가한다.**

Babel을 사용해 최신 ECMAScript 명세에 도입된 **문법**을 ES5까지의 문법으로 컴파일할 수 있다. 하지만, 새 스펙에 추가된 **빌트인**이나 **프로토타입 메소드** 등의 추가는 Babel의 역할이 **아니다**.

빌드 과정에서 Babel을 거쳤더라도 (ES5 이후 환경에 추가된)  `Promise`와 같은 빌트인 또는 `Array.prototype.includes` 등의 인스턴스 메소드가 코드에 남아있을 수 있다. 당연하지만, 해당 빌트인/메소드를 지원하지 않는 환경에서는 에러가 발생한다.

Babel 폴리필은 실행 환경에서 이런 빌트인, 메소드 등이 존재하는지 확인하고, 만약 존재하지 않는다면 추가한다. 플러그인과 프리셋은 빌드 타임 동작에 대한 설정인 반면, 폴리필은 런타임에 동작한다는 점에 유의하라.

Babel 폴리필은 내부적으로 [`core-js`](https://github.com/zloirock/core-js)에 의존한다.

### `preset-env`와의 사용
Babel 폴리필 전체를 빌드에 포함한다면 번들 사이즈가 너무 커질 수 있다.  `preset-env`의  [`useBuiltIns`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) 옵션을 사용하면 빌드 타임에 `babel-polyfill` 임포트를 꼭 필요한 폴리필 임포트로 대체해 번들이 필요 이상으로 커지는 일을 방지할 수 있다. 자세한 설정 방법은 [공식 문서](https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack)를 참고하라.

### 참고자료
* [@babel/polyfill · Babel](https://babeljs.io/docs/en/babel-polyfill)
* [Compiling vs Polyfills with Babel (JavaScript)](https://tylermcginnis.com/compiling-polyfills/)

## 요약
* **Babel**은 최신 자바스크립트 문법을 ES5 표준으로 변환해주는 컴파일러다.
* **플러그인**을 통해 Babel에 컴파일 규칙을 추가할 수 있다.
* **프리셋**을 사용해 여러 서로 다른 플러그인을 한 묶음으로 다룰 수 있다.
	* `preset-env`를 사용해 지원하고자 하는 환경에 필요한 플러그인을 똑똑하게 명시할 수 있다.
* **폴리필**을 사용해 런타임에 필요한 빌트인, 프로토타입 메소드를 추가할 수 있다.
	* `preset-env`와 함께 사용하면 꼭 필요한 폴리필만 불러올 수 있고, 따라서 번들이 필요 이상으로 커지는 일을 방지할 수 있다.

~ 🌝 끝 🌚 ~
