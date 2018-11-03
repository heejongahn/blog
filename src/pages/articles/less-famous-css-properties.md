---
templateKey: blog-post
title: 잘 알려지지 않은 유용한 CSS 속성들
date: 2018-10-28T07:37:26.643Z
description: >-
  pointer-events, object-fit, will-change, counter 등 상대적으로 덜 알려졌지만 알아두면 언젠가 유용하게
  써먹을 CSS 속성을 소개합니다.
tags:
  - 프론트엔드
  - CSS
  - ''
---
## 들어가며

웹 개발자로 일하다 보면 CSS의 세계는 참 무궁무진하다는 사실을 자주 느낀다. 매일같이 다루는 몇 가지 속성만으로도 대부분의 상황을 충분히 커버할 수 있지만, 오히려 그래서인지 여러 흔치 않은 용례를 고려하여 만들어진 속성들을 맞닥뜨릴때면 더더욱 즐거운 마음으로 놀라게 된다.

이 글에서는 잘 알려지지 않은, 하지만 알아두면 분명 유용하게 써먹을 일이 생길 CSS 속성 몇 가지를 소개한다. 하나씩 찾아보면 사실 이미 잘 정리된 자료들이 많은 만큼, 해당 속성에 관한 모든 세부 내용을 최대한 세세히 다루기보단 이런 속성이 존재하며 대략 어떤 용도로 사용된다는 점 정도를 소개하는 데에 초점을 맞추었다.

## [pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events), [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action): 클릭/터치 이벤트

`pointer-event` 속성을 통해 엘리먼트가 마우스 이벤트(호버, 클릭, 드래그 등)에 어떻게 반응할지를 지정할 수 있다. 대부분의 속성 값은 SVG 전용이고, `pointer-events: none`을 설정하여 마우스 이벤트의 타겟이 될 수 없도록 할 수 있다는 점만 기억하자.

해당 속성이 지정되었더라도 반드시 마우스 이벤트의 이벤트 리스너가 호출되지 않을 거라 보장되지 않는다는 점은 주의해야 한다. 예를 들어, 부모 엘리먼트가 `pointer-events: none` 속성을 갖고 있어도 자식 중`pointer-events: auto`를 가진 엘리먼트가 있다면, 해당 자식 엘리먼트에 트리거 된 이벤트가 [버블링 또는 캡쳐링](https://javascript.info/bubbling-and-capturing) 되는 과정에서 부모 엘리먼트의 이벤트 리스너가 호출될 수 있다.

```html
<ul>
  <li><a href="https://developer.mozilla.org">MDN</a></li>
  <li><a href="http://example.com" style="pointer-events: none;">example.com</a></li>
</ul>
```

<ul>
  <li><a href="https://developer.mozilla.org">MDN</a></li>
  <li><a href="http://example.com" style="pointer-events: none;">example.com</a></li>
</ul>

### 가능한 속성 값

```css
pointer-events: auto;  
pointer-events: none;
/* 이하 SVG 전용 값 생략 */
```

## [user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select): 선택 상호작용

`user-select` 속성을 사용해 엘리먼트 내부에서 텍스트 선택이 일어났을 때의 동작을 설정할 수 있다. 선택이 불가능하게 지정하거나, 엘리먼트 내에서 선택이 일어나면 무조건 엘리먼트 전체가 선택되도록 설정할 수 있다.

```html
<div style="user-select: auto; border: 1px solid black; padding: 12px; margin: 12px;">user-select: auto;</div>
<div style="user-select: none; border: 1px solid black; padding: 12px; margin: 12px;">user-select: none;</div>
<div style="user-select: all; border: 1px solid black; padding: 12px; margin: 12px;">all <span style="border: 1px solid black;">child</span></div>
<div style="user-select: text; border: 1px solid black; padding: 12px; margin: 12px;">user-select: text</div>
```

<div style="user-select: auto; border: 1px solid black; padding: 12px; margin: 12px;">user-select: auto;</div>
<div style="user-select: none; border: 1px solid black; padding: 12px; margin: 12px;">user-select: none;</div>
<div style="user-select: all; border: 1px solid black; padding: 12px; margin: 12px;">all <span style="border: 1px solid black;">child</span></div>
<div style="user-select: text; border: 1px solid black; padding: 12px; margin: 12px;">user-select: text</div>


### 가능한 속성 값

```css
user-select: auto;          /* 기본값 (::after, ::before 는 선택되지 않고, 부모의 속성을 따름) */
user-select: text;          /* 선택 가능 */
user-select: none;          /* 선택 불가능 */
user-select: all;           /* 엘리먼트 내에서 선택이 일어나면 해당 엘리먼트 전체가 선택된다 */
```

## [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit): 대체되는 엘리먼트의 내용물과 컨테이너 사이 관계 지정
`src` 속성을 사용하는 `img`, `video` 등과 같이, 내용물이 HTML 문서의 바깥에 존재하는 엘리먼트를 대체되는 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element)라 부른다. 이 때, 외부에 존재하는 내용물의 크기가 컨테이너의 그것과 차이날 때, 화면에는 어떻게 나타나야 할지에 대한 문제가 발생한다. 예를 들어, 너비 150px, 높이 200px 짜리 `img` 엘리먼트의 `src`로 너비 50px, 높이 600px의 이미지가 지정되었다면, 이 이미지는 어떻게 보여야 할까?

이런 상황에서 대체되는 엘리먼트의 내용물이 컨테이너를 어떻게 채울지를 지정하는 데에 사용되는 것이 `object-fit` 속성이다. 이 속성의 동작방식을 설명하는 데에는 말보다 [MDN 페이지의 CSS 데모](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)가 훨씬 효과적일 것이다. 링크를 타고 가기 귀찮은 독자를 위해 MDN의 예제도 아래에 (약간의 설명과 함께) 옮겨두었다.

### 가능한 속성 값과 예시
#### fill
**내용물의 가로세로비를 무시하고 컨테이너의 크기에 맞추어** 늘리거나 줄인다. 원래 비율이 유지되지 않으므로, 컨테이너의 크기에 따라 내용물이 가로 혹은 세로로 늘어날 수 있다.

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

#### contain
내용물의 가로세로비를 유지하는 채로, **내용물이 컨테이너에 포함되는 최대 크기가 되도록** 늘리거나 줄인다.

```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>
```
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: contain;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>

#### cover
내용물의 가로세로비를 유지하는 채로, **내용물이 컨테이너 전체를 덮는 최소 크기가 되도록** 늘리거나 줄인다.

```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: cover;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"/>
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: cover;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>
```
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: cover;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"/>
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: cover;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />

#### none
내용물이 전혀 리사이징 되지 않는다.

```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: none;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: none;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>
```
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: none;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: none;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
</div>

#### scale-down
`none` 과 `contain` 중 내용물의 크기가 더 적은 쪽과 동일하게 동작한다.

```html
<div>
  <img style="width: 150px; height: 100px; border: 1px solid #000; object-fit: scale-down;" src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo" />
  <img style="width: 100px; height: 150px; border: 1px solid #000; margin-top: 10px; object-fit: scale-down;"src="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" alt="MDN Logo"  />
</div>
```

## [overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap): 오버플로우가 일어날 때 단어 내 줄바꿈 처리

CJK 언어로 된 사이트를 자주 만드는 개발자라면 `word-break: keep-all;` 속성을 아주 유용하게 사용하고 있을 것이다. `keep-all` 속성값을 사용하면 CJK에서도 단어 단위로 줄바꿈을 끊어줄 수 있다. 그런데 만약 한 단어의 길이 컨테이너의 너비보다 더 긴 경우에는 어떻게 해야할까?

```html
<div style="width: 200px; border: 1px solid black; word-break: keep-all;">
  굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서의미는없는문자열
</div>
```
<div style="width: 200px; border: 1px solid black; word-break: keep-all;">
  굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서의미는없는문자열
</div>

이런 경우, `overflow-wrap` 속성에 `break-word` 값을 주어서 만약 오버플로우가 일어날 경우 적절하게 단어를 끊고 줄바꿈이 일어나도록 설정할 수 있다. 

```html
<div style="width: 200px; border: 1px solid black; word-break: keep-all; overflow-wrap: break-word;">
  굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서의미는없는문자열
</div>
```
<div style="width: 200px; border: 1px solid black; word-break: keep-all; overflow-wrap: break-word;">
  굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서굉장히길고엄청나게길면서의미는없는문자열
</div>

### 가능한 속성 값
```css
overflow-wrap: normal;        /* 기본 */
overflow-wrap: break-word;    /* 오버플로우가 일어나면 단어를 쪼개서 줄바꿈 */
```


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

## [counter](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)

마지막으로 살펴볼 속성은 `counter` 이다. 앞에서 보았던 속성들과 다르게, `counter`는 단순히 해당 속성이 정의된 엘리먼트 뿐만이 아닌 문서 전체와 엮어 동작하는, 다소 특이한 성질을 갖는 속성이다.

