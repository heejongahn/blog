---
templateKey: blog-post
title: 잘 알려지지 않은 유용한 CSS 속성들
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

### 가능한 속성 값
```css
list-style-position: inside;  /* 마커가 `li` 태그 안에 위치 */
list-style-position: outside; /* 마커가 `li` 태그 바깥에 위치 */
```


## [will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change): 값이 변경될 속성에 대한 힌트
웹이 정적 문서를 위한 플랫폼에서 동적으로 상호작용하는 복잡한 어플리케이션을 위한 플랫폼으로 진화함에 따라, `opacity`, `transform` 등의 CSS 속성 값이 동적으로 변화는 상황이 갈수록 자주 생긴다.

이 때, `will-change` 속성을 사용해 브라우저에게 엘리먼트의 어떤 속성이 높은 확률로 변할 것인지 힌트를 줄 수 있다. 브라우저는 이 힌트를 사용해 앞으로 일어날 변화에 미리 대비해 더 매끄러운 트랜지션을 구사할 수 있다. 예를 들어, 다음 스타일시트는 `.sidebar` 엘리먼트의 `transform` 속성 값이 변할 것임을 나타낸다.

```css
.sidebar {
  will-change: transform;
}
```

### 가능한 속성 값
```css
/* 키워드  */
will-change: auto;             /* 기본값 */
will-change: scroll-position;  /* 엘리먼트의 스크롤 위치가 바뀔 것 */
will-change: contents;         /* 엘리먼트의 컨텐츠 중 일부가 바뀔 것 */

/* 혹은 특정 CSS 속성을 명시할 수 있다. */
/* transform, opacity, top, left, right, bottom 정도가 자주 사용된다. */
will-change: transform;        
will-change: left, top;        /* 여러 속성을 동시에 명시할 수도 있다. */
```

당연하지만, 이렇게 미리 변경에 대비하는 준비 작업은 공짜가 아니다. `will-change` 속성을 너무 남발한다면 오히려 성능 저하가 일어날 수 있음을 유의하라. 이런 속성이 존재함은 알아두되, 어떤 속성이 동적으로 바뀌는 상황이 성능 문제 없이 잘 동작한다면 `will-change` 를 직접 건드리지 않는 것이 좋다.

### 참고 자료
* [CSS will-change 프로퍼티에 관해 알아둬야 할 것](https://dev.opera.com/articles/ko/css-will-change-property/)
* [Silky Smooth Animation with CSS](https://speakerdeck.com/lonekorean/silky-smooth-animation-with-css)

## object-fit: 대체되는 엘리먼트의 내용물과 컨테이너 사이 관계 지정
`src` 속성을 사용하는 `img`, `video` 등과 같이, 내용물이 HTML 문서의 바깥에 존재하는 엘리먼트를 대체되는 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element)라 부른다. 이 때, 외부에 존재하는 내용물의 크기가 컨테이너의 그것과 차이날 때, 화면에는 어떻게 나타나야 할지에 대한 문제가 발생한다. 예를 들어, 너비 150px, 높이 200px 짜리 `img` 엘리먼트의 `src`로 너비 50px, 높이 600px의 이미지가 지정되었다면, 이 이미지는 어떻게 보여야 할까?

이런 상황에서 대체되는 엘리먼트의 내용물이 컨테이너를 어떻게 채울지를 지정하는 데에 사용되는 것이 `object-fit` 속성이다. 이 속성의 동작방식을 설명하는 데에는 말보다 [MDN 페이지의 CSS 데모](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)가 훨씬 효과적일 것이다. 링크를 타고 가기 귀찮은 분들을 위해 MDN의 예제도 아래에 (약간의 설명과 함께) 옮겨두었.

### 가능한 속성 값과 예시
#### fill
내용물의 가로세로비를 무시하고 컨테이너의 크기에 맞추도록 늘리고 줄인다. 원래 비율이 유지되지 않으므로, 컨테이너의 크기에 따라 내용물이 가로 혹은 세로로 늘어날 수 있다.

```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: fill;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"  />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: fill;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"  />
</div>
```

<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: fill;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"  />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: fill;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"  />
</div>

### contain
내용물의 가로세로비를 유지하는 채로, *내용물이 컨테이너에 포함되도록*
```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />

  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>
```

  <h2>object-fit: cover</h2>
  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 150px; height: 100px; border: 1px solid #000; object-fit: cover;"/>

  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: cover;" />

  <h2>object-fit: none</h2>
  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 150px; height: 100px; border: 1px solid #000; object-fit: none;" />

  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: none;" "/>

  <h2>object-fit: scale-down</h2>
  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 150px; height: 100px; border: 1px solid #000; object-fit: scale-down;" />

  <img src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: scale-down;" />
</div>
```


### 가능한 속성 값
```css
object-fit: contain;           /* 기본값 */
object-fit: cover;             /* 기본값 */
object-fit: fill;              /* 기본값 */
object-fit: none;              /* 기본값 */
object-fit: scale-down;        /* 기본값 */
```


## overflow-wrap
`word-break: keep-all` 속성은 CJK 문자에서 유용하다.

## counter: 

## viewport-fit

## pointer-events, user-select
