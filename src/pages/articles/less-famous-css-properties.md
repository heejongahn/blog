---
templateKey: blog-post
title: less-famous-css-properties
date: 2018-10-28T07:37:26.643Z
description: 상대적으로 덜 알려졌지만 알아두면 유용한 CSS 속성들에 대해 소개합니다.
tags:
  - 프론트엔드
  - CSS
  - ''
---
## 들어가며

이 글에서는 

## [list-style-position](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position): 리스트 마커 위치 지정
리스트 아이템 앞에 따라오는 리스트 마커는 기본적으로 `li` 태그 바깥에 위치한다.

```html
<ul style="padding-left: 20px;">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

<ul style="padding-left: 20px;">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>

`list-style-position` 속성의 값으로 `inside`를 줘서 마커가 `li` 태그 안오로 들어오도록 설정할 수 있다.

```html
<ul style="padding-left: 20px; list-style-position: inside;">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

<ul style="padding-left: 20px; list-style-position: inside;">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>


## [will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change): 값이 변경될 속성에 대한 힌트
웹이 정적 문서만을 보여주던 플랫폼에서 동적으로 상호작용하는 복잡한 어플리케이션을 위한 플랫폼으로 진화함에 따라, 유저 인터랙션 등의 이유로 `opacity`, `transform` 등의 CSS 속성 값이 동적으로 변화는 상황은 갈수록 자주 발생하고 있다.

`will-change` 속성을 사용해 브라우저에게 엘리먼트의 어떤 속성이 높은 확률로 변할 것인지 힌트를 줄 수 있다. 예를 들어, 다음 스타일시트는 `.sidebar` 엘리먼트의 `transform` 속성 값이 변할 것임을 브라우저에게 알려주고 있다. 브라우저는 이 힌트를 사용해 앞으로 일어날 변화에 미리 대비해 더 매끄러운 트랜지션을 구사할 수 있다.

```css
.sidebar {
  will-change: transform;
}
```

`will-change` 속성은 다음 값을 가질 수 있다.

```
/* 키워드  */
will-change: auto;             /* 기본값 */
will-change: scroll-position;  /* 엘리먼트의 스크롤 위치가 바뀔 것 */
will-change: contents;         /* 엘리먼트의 컨텐츠 중 일부가 바뀔 것 */

/* 혹은 특정 CSS 속성을 명시할 수 있다. */
/* 허용되는 값은 
will-change: transform;        
will-change: left, top;        /* Example of two <animateable-feature> */

/* Global values */
will-change: inherit;
will-change: initial;
will-change: unset;
```


 다만 당연하게도 이러한 준비 작업은 공짜가 아니고, `will-change` 속성을 너무 남발한다면 오히려 성능 저하가 일어날 수 있음을 유의하라.

### 참고 링크
- [CSS will-change 프로퍼티에 관해 알아둬야 할 것](https://dev.opera.com/articles/ko/css-will-change-property/)

## object-fit

## overflow-wrap

## CSS counter

## :nth-child(n+2)

## :empty

## currentColor

## viewport-fit

## pointer-events, user-select
