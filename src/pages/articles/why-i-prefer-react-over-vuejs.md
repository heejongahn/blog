---
templateKey: blog-post
title: React를 Vue.js보다 선호하는 이유
date: 2018-03-03T00:00:00.000Z
description: 가장 뜨거운 두 프론트엔드 라이브러리 중 React를 더 선호하는 이유를 정리 해 보았습니다.
tags:
  - 자바스크립트
  - React
  - Vue.js
  - 프론트엔드
---
2021-11-02 수정 : 이 글이 작성된지 3년 반이 넘는 시간이 지났습니다. 저는 글 작성 후 얼마 지나지 않아 진행된 이직 이후로 Vue.js 를 실무에서 사용한 경험이 없고, 때문에 지금은 원 주제와 관련하여 유의미한 주장을 하기 위해 필요한 지식을 갖고 있지 않습니다.

웹 생태계가 변화하는 속도를 감안하면, 이 글이 이제는 사실과 동떨어진 내용을 담고 있을 가능성이 클 것으로 예상됩니다. 따라서 **현 시점에서 라이브러리 선택을 고민하는 분께서는 판단의 근거로 이 글의 내용을 사용하지 않으시길 강력하게 권장드립니다**.

그와 별개로 React 는 여전히 만족하며 잘 사용하고 있고, 최근 2021년 FEConf 에서도 관련된 발표([「왜 나는 React를 사랑하는가」](https://www.youtube.com/watch?v=dJAEWhR83Ug&t=15s&ab_channel=FEConfKorea))를 진행했습니다. 관심 있는 분께서는 참고하세요.


- - -

# 들어가며

회사에서 나는 주로 SPA 기반의 웹 프론트엔드를 개발한다.  [전 회사](spoqa.com)에서는 [React](https://reactjs.org/)를, [현 회사](https://career.hpcnt.com/)에서는 [Vue.js](https://vuejs.org/)를 메인 기술로 사용했으니 이 분야에서 요새 가장 많은 관심을 받는 두 기술을 각각 몇 달 씩 경험한 셈이다. 그 결과 나름대로 내린 결론이 있는데, **선택권이 있는 상황에선 무조건 React를 사용하겠다**는 것이다.

최근 웹 프로젝트를 시작할 때의 기술 선택에 대해 직·간접적으로 조언을 요청받았는데, 매번 위의 입장을 기초로 대답했다. 그런데 비슷한 대답을 세네번 쯤 하고 있자니 이런 입장을 갖게 된 이유를 한 번 글로 정리해두면 편하기도 하고, 좀 더 도움이 될 수 있겠다는 생각이 들어서 이 글을 적게 되었다.

글에 들어가기 앞서 이 글의 제목이 ”React가 Vue.js보다 우월하고 모두가 React를 사용해야 하는 이유”가 아니란 점을 강조하고 싶다. 모든 Vue.js 사용자가 React를 사용하도록 만드는 건 이 글의 목표가 아니다. 오류에 대한 지적, 또 미처 생각하지 못한 점에 대한 의견은 환영한다.

내가 React를 Vue.js보다 선호하는 이유는 크게 세 가지 정도로 정리할 수 있다.

* 타입스크립트 지원
* 단순한 컴포넌트 정의의 용의함
* 더 빠르고 담대한 개선

하나씩 살펴보자.

# 타입스크립트 지원

이 항목은 상대적으로 다른 항목에 비해 React의 비교우위가 명백하다. React와 타입스크립트(이하 TS)의 결합은 아주 매끄럽다. 큰 보일러플레이트 없이도 SFC와 클래스 기반 컴포넌트 둘 모두의 타입을 정확하게 기술할 수 있고, [redux](https://github.com/reactjs/redux)를 비롯한 컴패니언 툴도 대부분 훌륭한 타입 지원을 제공한다.

반면 Vue.js는 2.5 버전 업데이트 당시 TS 지원의 큰 개선을 홍보했지만 아직까지도 많이 미흡하다. 예를 들어  `computed`나 `methods` 내의  `this` 타입은 여전히 제대로 추론되지 않는다. [vue-class-component](https://github.com/vuejs/vue-class-component)를 사용하면 상황이 좀 나아지지만 이는 아직 실험 기능인 데코레이터에 의존하며, 주류 문법과 이질적이다. [vuex](https://github.com/vuejs/vuex)의 타입 지원 또한 redux의 그것과 비슷한 수준이 되기는 요원해보인다.

TS의 필요성에 공감하지 못하거나 도입이 너무 어렵고 귀찮게 느껴져 사용하지 않는 사람들을 꽤 보았는데, 그런 이들에겐 이 항목은 별로 해당 사항이 없다. 개인적으론 TS 도입을 권하는 [발표](https://www.slideshare.net/HeejongAhn/typescript-flow-81799404)까지 할 정도로 기술의 팬이고, 그 지원 수준에 따라 생산성이 극명하게 달라질 정도로 의존성이 크다. 따라서 Vue.js의 TS 지원이 눈에 띄게 개선되기 전까지는 이 점 하나만 해도 나에겐 React를 선택할 충분한 이유가 될 듯 하다.

# 단순한 컴포넌트 정의의 용이함

Vue.js는 컴포넌트에 관한 템플릿, 스타일과 스크립트를 `.vue` 확장자를 갖는 한 파일 내에 모두 작성할 수 있는 [단일 파일 컴포넌트(Single File Component)](https://vuejs.org/v2/guide/single-file-components.html)를 제공한다. 이를 사용해 허구의 `UserList` 컴포넌트를 작성하는 경우를 생각해보자.

```html
<template>
  <ul :id="$style.userList">
    <li
      v-for="user in users"
      :key="user.id"
      :class="{
        [$style.userItem]: true,
        [$style.selected]: user.id === selectedUserId
      }">
      {{ user.name }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return { selectedUserId: undefined }
  },
  props: ['users']
}
</script>

<style module>
/* style definition */
</style>
```

React를 사용한다면 이 컴포넌트를 대략 아래와 같이 작성할 것이다.

```jsx
import React, { Component } from 'react'
import classNames from 'classnames'
import * as styles from './UserList.css'

const UserItem = ({ user, selected }) => (
  <li className={classNames(style.userItem, { [style.selected]: selected })}>
    { user.name }
  </li>
)

export default class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedUserId: undefined }
  }

  render() {
    const { users } = this.props
    const { selectedUserId } = this.state

    return (
      <ul className={styles.userList}>
        {users.map(user => (
          <li className={classNames(styles.userItem, { [styles.selected]: user.id === selectedUserId })}>
            { user.name }
          </li>
        )}
      </ul>
    )
  }
}
```

이 시점에서는 비교해보면, Vue.js에 비해 React의 문법이 갖는 몇 가지 단점이 눈에 띈다.

* [styled-components](https://github.com/styled-components/styled-components)등을 사용하지 않는 이상 컴포넌트의 스타일시트를 별도의 파일에 작성해야 한다.
* 특정 조건에 따라 엘리먼트의 클래스 명을 다르게 주고 싶을 때 [classnames](https://github.com/JedWatson/classnames)등의 써드파티에 의존해야 한다.
* 상태를 갖는 컴포넌트를 정의할 때 필요한 보일러플레이트가 Vue.js에 비해 크다.

하지만 이 파일 내에서만 사용 될 `UserItem` 컴포넌트를 별도의 컴포넌트로 빼는 경우를 생각해보자.

Vue.js에서는 두 가지 선택지가 있다. 하나는 별도의 `UserItem.vue`를 만드는 것이다.

```html
<template>
  <ul :id="$style.userList">
    <user-item
      v-for="user in users"
      :key="user.id"
      :user="user"
      :selected="user.id === selectedUserId"
    />
  </ul>
</template>

<script>
import UserItem from './UserItem.vue'

export default {
  components() {
    UserItem
  },
  data() {
    return { selectedUserId: undefined }
  },
  props: ['users']
}
</script>

<style module>
/* style definition */
</style>
```

또는 파일 내에서  `ComponentOption` 객체를 정의 할 수 있다.

```html
<template>
  <ul :id="$style.userList">
    <user-item
      v-for="user in users"
      :key="user.id"
      :user="user"
      :selected="user.id === selectedUserId"
    />
  </ul>
</template>

<script>
const UserItem = {
  template: '<li :class="{ [styles.userItem]: true, [styles.selected]: selected }">{{ user.name }}</li>',
  props: ['user', 'selected']
}

export default {
  components() {
    UserItem
  },
  data() {
    return { selectedUserId: undefined }
  },
  props: {
    users: {
      type: Array,
      default: []
    }
  }
}
</script>

<style module>
/* style definition */
</style>
```

이러한 두 가지 방법은 각각의 단점을 갖고 있다.

먼저 단일 파일 컴포넌트를 사용한 접근의 경우, 한 군데에서만 사용될 작은 컴포넌트를 정의할 때에도 무조건 새 파일을 만들어야 한다. 이는 보일러플레이트의 증가로 이어진다.

한 편, `ComponentOptions`를 사용한 접근의 경우, 템플릿을 플레인 문자열로 표현하는 탓에 많은 정보를 잃게 된다. `template` 대신 `render` 함수를 사용하고 그 안에서 JSX를 사용할 수 있지만, Vue.js가 권장하는 방식은 아니라는 인상을 받았다.

React의 무상태 함수 컴포넌트(Stateless Functional Component)를 사용하면 같은 작업을 아래와 같이 우아하게 해낼 수 있다.

```jsx
import React, { Component } from 'react'
import classNames from 'classnames'
import * as styles from './UserList.css'

const UserItem = ({ user, selected }) => (
  <li className={classNames(style.userItem, { [style.selected]: selected })}>
    { user.name }
  </li>
)

export default class UserList extends Component {
  render() {
    const { users } = this.props
    const { selectedUserId } = this.state

    return (
      <ul className={styles.userList}>
        {users.map(user => (
          <UserItem user={user} selected={this.selectedUserId === user.id} />
        )}
      </ul>
    )
  }
}
```

보일러플레이트가 훨씬 적을 뿐더러, `UserItem` 컴포넌트가 부모가 던져준 데이터에 의존하는 함수라는 점이 코드 자체에서 아주 명백하게 드러난다.

컴포넌트를 잘게 쪼갤 때 React는 Vue.js에 비해 다음 강점을 갖는다.

* 작은 컴포넌트를 정의하는 문법이 직관적이고 간결하다.
* 컴포넌트 정의하는 두 문법(SFC, 클래스 기반 컴포넌트)이 상대적으로 더 일관적이다.
* 템플릿을 문자열로 표현하지 않으므로 여러 정보를 잃어버리지 않는다.

커다란 로직을 함수로 쪼개 의도를 명시적으로 인코딩하고 프로그램을 보다 쉽게 소화할 수 있는 의미 덩어리로 나누듯, 컴포넌트를 쪼개는 작업도 비슷한 효과를 갖는다. React는 Vue.js에 비해 UI를 조그마한 컴포넌트들의 조합으로 표현 하는데에 더 적합한 문법을 갖고 있다. 나는 이런 장점이 React의 단점을 상쇄하고 남을 정도라 생각한다.

# 더 빠르고 담대한 개선

마지막 항목은 두 라이브러리의 현재를 비교한 앞선 두 항목과 달리 이 항목은 미래에 대한 이야기인데, 어느 정도 믿음의 영역이라 사람에 따라 의견 차이가 클 수 있겠다. 나는 React가 Vue.js에 비해 앞으로 더 빠르고 담대한 개선을 이루어낼 것이라 기대한다.

최근 그다지 길지 않은 시간 동안 React에는 Fiber를 비롯해 Fragment, Portal 등 굵직한 변화 내지는 기능 추가가 있었다. 또한 새로운 Context API, 라이플사이클 메소드, [time slicing과 suspense](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html) 등 다양한 변경사항이 예고되어 있다. 모든 변경사항이 좋은 변경사항이라고 할 순 없겠으나, 그와 별개로 React 팀이 빠르게 움직이고 있다는 사실 자체는 이견의 여지가 없다.

반면 Vue.js의 릴리즈는 상대적으로 느리게 이루어지고, 주로 마이너한 변경사항 위주인 경우가 많다. 이런 속도의 차이는 결국 [현존하는 두 라이브러리 사이의 간극](https://stateofjs.com/2017/front-end/results)이 더 벌어지는 결과를 낳을 것이다. 빠르게 변화하고, 배우고, 그리고 발전해 결국은 앞서 나갈 React에 베팅하는게 맞다고 생각하는 이유다.

# 맺으며

이상 내가 React를 Vue.js보다 더 선호하는 이유를 정리해 보았다. 끝으로 덧붙이자면, 사실 위 내용 중 많은 부분이 두 라이브러리의 보다 근본적인 철학 차이에서 파생되었다 생각한다. 두 라이브러리가 추구하는 바에 대해 내가 받은 인상은 아래와 같다.

* React에는 Vue.js에 비해 매직이 덜하다. Vue.js는 사용자에게 쉽게 느껴지는 API를 제공하기 위해 라이브러리가 직접 헤비 리프팅을 하는 경우가 많다.
* React는 Vue.js에 비해 플레인 자바스크립트에 더 가깝다. 새로운 문법 내지는 컨벤션을 정의하는 대신 자바스크립트의 그것을 활용하는데 무리가 없다면 그리 한다.
* React는 Vue.js에 비해 사용자 및 사용처에 대해 더 적은 가정을 하고, 컴포넌트 기반의 선언적 UI 렌더링이라는 가장 핵심적인 기능과 관련된 부분만 코어에 포함한다.

두 가지 다른 방향 중 나는 React의 방향에 더 공감한다. 미래에 두 라이브러리가 어떻게 변할지, 그리고 어떤 새로운 라이브러리가 등장할 지 모른다. 하지만 React가 지금 보여주는 철학을 앞으로도 고수하며 꾸준히 발전해 나간다면 앞으로도 나는 React를 즐겁게 사용할 것이다.

끝으로 노파심에 다시 덧붙이자면, 글의 목적 상 Vue.js의 단점을 더 많이 언급했지만 Vue.js 역시 분명 좋은 도구다. 만약 1. 상대적으로 자바스크립트에 익숙하지 않은 팀원이 많이 참여하는 2. 소규모의, 오래 유지보수하지 않을 프로젝트라면 Vue.js도 좋은 선택이 될 수 있다고 생각한다. 두 라이브러리가 긍정적인 경쟁을 통해 함께 발전하길 바란다.