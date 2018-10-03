---
templateKey: blog-post
title: "ECMAScript와 TC39"
date: 2017-12-24T09:00:00+09:00
description: "자바스크립트 언어의 표준인 ECMAScript와 TC39에 대해 소개합니다."
tags:
  - 자바스크립트
  - ECMAScript
  - TC39
---
# 들어가며

수 년 전까지만 해도 자바스크립트는 기껏해야 브라우저 위에 경고 대화창을 띄우거나 웹 페이지의 사이드바를 열고 닫는 용도로만 사용되던, 장난감 같은 언어에 불과했다. 오늘날, 자바스크립트는 프론트엔드는 물론이거니와 서버, 모바일 어플리케이션, 심지어는 데스크톱 앱까지 모든 분야에서 사용된다. 대체 그 사이에 무엇이 달라졌길래 이런 극적인 변화가 생긴걸까?

물론 이 질문에 대한 하나의 간결한 대답은 존재하지 않는다. 그 동안 웹 브라우저를 실행하는 기기들의 스펙은 매우 빠른 속도로 좋아졌고, 전세계적으로 인터넷 보급율이 증가했으며, 또한 V8이라는 걸출한 자바스크립트 런타임 엔진이 등장하기도 했다. 그리고 빼놓을 수 없는 또다른 이유 중 하나로 **프로그래밍 언어로서의 자바스크립트의 발전**이 있다.

**지난 십수년간, 자바스크립트는 예전과는 거의 다른 언어라 해도 좋을 정도로 큰 변화를 겪어왔다**. 그리고 언어의 표준에 새로운 기능이 추가되거나 변경사항이 있을 때마다, 많은 사람들이 그에 대한 수많은 글을 쓰고, 발표를 진행했다. 하지만 그에 비해 그런 변화가 실제로 어떻게 태동하고 발전해 결국 표준에 편입되는지까지의 과정은 거의 다루어지지 않는다.

언어는 문법과 동작 방식만으로 이루어지지 않는다. 어플리케이션을 만드는 데에는 현재 존재하는 기능을 아는 것만으로 충분한 경우가 많다. **하지만 생태계를 보다 깊이 이해하고 앞으로 언어가 나아갈 길을 예상하기 위해선 역사와 더불어 언어가 발전하는 과정에 대한 이해가 필요하다**. 세상을 집어삼키고 있는 이 언어의 표준이 어떻게 발전하는지 살펴보자.

## ECMAScript 언어 표준과 TC39

자바스크립트의 역사를 극단적으로 간략히 서술해보자면 다음과 같다. 자바스크립트는 1990년대 중반, (지금은 사라진) Netscape Navigator 브라우저에 동적인 부분을 더하기 위한 목적으로 Brianden Eich에 의해 개발되었다. 인기를 끔에 따라 Microsoft는 (상표권 이슈를 피하기 위해) JScript라 이름 붙인 자바스크립트의 방언을 개발했다. JScript는 1996년 8월, IE 3.0에 포함되어 배포되었다.

이후 Netscape는 언어의 표준화 및 명세화를 위해 자바스크립트를 [Ecma 인터내셔널(Ecma International)][ecma-international]에 제출했다. Netscape와 Microsoft 등 이해당사자 간의 이름을 둘러싼 합의 끝에 **ECMAScript라는 이름과 [ECMA-262][ecma-262], "ECMAScript 언어 표준(ECMAScript Language Specification)"이 탄생했다**. 오늘날 우리가 말하는 자바스크립트는 ECMA-262을 만족하는 구현체를 가리킨다. Ecma 인터내셔널의 여러 기술 위원회(Technial Committee, 이하 TC) 중 **TC39 라는 위원회가 이 명세를 관리한다**.

## ECMAScript 언어 표준
1997년 6월에 발표된 첫 번째 판(edition)을 시작으로 2017년 12월 현재까지 ECMA-262의 총 8개 판이 존재한다. 각 판은 판 번호 또는 발표된 연도를 따라 이름붙여진다. 예를 들어, 2015년에 발표된 6판의 경우 ECMAScript2015 또는 ECMAScript6 이라 (또는 ECMAScript를 ES로 줄여 ES2015 또는 ES6이라) 불리운다.

그 중 약 9년만의 메이저 버전 업이 될 예정이었던 ES4는 굉장히 많고 복잡한 변경사항을 포함하고 있었다. 그 복잡도와 하위 호환성을 파괴하는 변경사항은 많은 논쟁을 야기했고, 결국 컨센서스를 불러일으키는데 실패한 ES4는 **기각되었다**. 비록 4판은 받아들여지지 않았지만, 당시 제안되었던 기능 중 다수는 이후 점진적으로 표준에 추가되었다.

## Technical Committee 39
Ecma 인터내셔널의 여러 기술 위원회(Technial Committee, 이하 TC) 중 ECMA-262 명세의 관리는 TC39 위원회가 맡고 있다.. TC39의 구성원 목록은 Mozilla, Google, Apple, Microsoft 등의 메이저 브라우저 벤더를 비롯해 Facebook, Twitter 등의 다양한 단체로 이루어져 있다. 대부분의 구성원이 표준을 올바르게 구현해야 할 책임을 갖는, 언어 표준의 변화에 직접적으로 영향을 받는 단체다. 엄밀히는 기업/단체가 구성원이지만, 'TC39 구성원' 이라는 용어가 해당 기업/단체가 보낸 대리인을 지칭하는 경우도 많다.

TC39는 정기적으로 만나 회의를 진행하는데, 회의록은 모두 [웹상에 공개된다][tc39 notes]. **TC39에서 내리는 결정이 단순 다수결이 아닌 컨센서스 체제로 이루어진다는 점은 주목할 만 하다**. 대부분이 동의하는 안이라도 한 명이 강하게 거부권을 행사한다면 섣불리 결정을 내리기보단 합의를 이루어내기 위해 더 시간을 갖고 논의를 해 보는 식이다. TC39의 모든 의사 결정이 구성원 대다수의 이해관계와 직결되어 있다는 점을 감안했을 때, 이러한 정책은 이례적이다.

---

# TC39 프로세스

> 이하 *1단계: 제안* 단계와 구분하기 위해 앞으로 0단계에서 4단계에 이르기까지, 아직 표준에 편입되지도, 명시적으로 거절되지도 않은 제안을 통틀어 프로포절이라 칭한다.

ECMA-262 표준에 새로운 명세를 추가하기 위한 과정은 공식적으로 명문화되어 있다. [TC39 프로세스][tc39 process]라고도 불리는 이 과정은 0단계부터 4단계까지 총 5개의 단계로 나누어져 있으며, **각 단계로의 승급을 위한 명시적인 조건들이 존재한다**. 해당 조건을 만족한 이후 위원회의 동의를 얻은 프로포절만이 다음 단계로 넘어간다. 물론 그 과정에서 최종적으로 표준에 편입되지 않기로 결정되어 버려지는 제안들도 존재한다.

모든 프로포절은 [TC39의 깃헙 단체 계정][tc39 github]의 [proposals 저장소][tc39 proposals]에 등재된다. 2017.12.19 기준, 0단계의 경우 stage-0-proposals.md 파일에서, 4단계에 이르러 표준에 편입된 프로포절은 finished-proposals.md 파일에서 확인할 수 있다. 활성화된 프로포절(active proposal)이라 불리는 1-3단계 프로포절의 경우 README.md에 등재되어 있다. 대부분의 프로포절은 별도의 저장소를 갖고 있고, 그 곳에선 해당 프로포절을 어떻게 발전시킬지, 어떤 어려움이 예상되는지 등의 다양한 논의가 이루어진다.

## 0단계: 허수아비 (stage 0: strawman)
TC39 프로세스에 프로포절을 내놓기 위해선 기본적으로 별다른 제약이 없다. 라이센스 관련 조항에 동의하고 TC39의 컨트리뷰터로 등록한 누구라도 프로포절을 내놓을 수 있다. 해당 프로포절 중 어떤 경로로든 TC39의 회의의 안건으로 상정되고 앞서 언급된 0단계 문서에 등재되면 0단계 제안이 된다.

## 1단계: 제안 (stage 1: proposal)
1단계에 들어오기 위해선 가장 먼저 **챔피언(champion)** 을 구해야 한다. 챔피언이란 해당 제안을 책임지고 다음 단계로 끌고 나아갈 TC39 구성원을 일컫는다. 또한, 1단계 프로포절은 풀고자 하는 문제와 하이 레벨 API 및 잠재적 장애물을 제시해야 한다. 구현상으로는 폴리필, 데모 등을 필요로 한다.

위에서 살펴보았듯 0단계는 기본적으로 TC39 회의에서 안건으로 논의되어야 한다는 것 이외에는 제약이 전무하다시피 하다. 어떤 프로포절이 1단계에 진입한다는 것은 본격적으로 위원회 수준에서 시간과 노력을 투자해 해당 프로포절에 관해 논의할 의사를 표명한 것으로 해석할 수 있다. 1단계 제안은 추후 단계를 거치며 많은 부분 변화할 수 있다.

## 2단계: 초고 (stage 2: draft)
**2단계에 올라오기 위해선 ECMAScript 표준의 형식 언어(formal description)로 작성 된 형식적인 서술(formal description) 초안이 필요하다**. 이 초안은 만약 프로포절이 실제로 표준에 편입 될 경우 사용할 명세의 초기 버전이다. 2단계까지는 앞으로 해야 할 일 등을 TODO 마크 등으로 표시해 놓는 등의 일부 불완전한 명세가 허용된다. 또한 실험적인(플래그에 의해 켜지고 꺼지는) 구현이 요구된다.

어떤 프로포절이 2단계에 올라왔다는 것은 위원회가 이 프로포절을 발전시켜 궁극적으로는 표준에 포함시키고자 하는 의지가 있다고 해석할 수 있다. 2단계 이후로는 상대적으로 적은 변경만이 허용된다.

## 3단계: 후보 (stage 3: candidate)
3단계 프로포절은 대부분 완성에 가깝고, 구현 주체나 사용자들로부터 피드백을 좀 더 받아보는 일만이 남은 상태다. 3단계에 들어오기 위해서는 2단계의 초안과는 다르게 **빈칸 없이 문법, 동작, 그리고 API까지 모든 부분이 기술되어 있도록 마무리 된 명세**가 필요하다.

**3단계까지 올라온 프로포절은 이후 구현상 심각한 문제가 발견되지 않는 이상 변경이 허용되지 않는다**. 이 시점에서는 실제로 ECMA-262 표준에 편입시키고자 하는 해당 표준의 명세가 거의 마무리 된 상태여야 한다.

## 4단계: 완료됨 (stage 4: finished)
마지막 4단계는 모든 단계를 거치고 마침내 제안이 수락되고 다음 표준에 포함되어 발표되기만을 기다리는 단계이다. 3단계의 프로포절이 ECMA-262의 단위 테스트 슈트인 Test262에 관련 테스트가 작성되고, 최소 2개 이상의 구현이 제공되는 등의 까다로운 추가 조건을 모두 만족하면 마침내 4단계로 올라올 수 있다.

**4단계까지 올라온 프로포절은 별다른 이변이 없는 이상 다가오는 새 표준에 포함되어 발표된다**. 2015년을 기점으로 매년 6월 새로운 ECMAScript 표준이 발표되는데, 당해 3월 전까지 4단계를 달성하고 3월 회의에서 최종 승인된 제안들이 새 표준에 포함된다.

각 과정에 대한 보다 자세한 설명은 공식 문서에 기재되어 있다. 또한, 언제든지 앞서 언급한 proposals 저장소에서 현재 진행중인 모든 ECMAScript 표준에 관한 프로포절과 그 상태를 확인할 수 있다.

---

# 실제 예시 – Array.prototype.includes

TC39 프로세스가 구체적으로 어떻게 진행되는지 좀 더 구체적인 감각을 갖기 위해, 실제 예시를 들어 살펴보자. 오늘의 초대 손님은 `Array.prototype.includes` 메소드다. 이 메소드는 이름이 암시하듯 배열에 어떤 원소가 들어있는지 검사한다.

매우 흔한 요구사항인 것을 감안하면 놀랍게도 이 메소드는 2016년이 되어서야 표준 – ECMAScript 2016 – 에 추가되었다. 이 프로포절의 챔피언은 Google의 Domenic Denicola이 맡았고, [2014년 4월 9일 회의][20140409]에서 처음 언급되었다.

## 0단계: 허수아비 (stage 0: strawman)
앞서 언급된 2014년 4월 9일 회의록에서 Rick Waldron은 ES6에 추가될 예정인 `String.prototype.contains` 와 비슷한 메소드 `Array.prototype.contains` 를 배열 프로토타입에 추가하는 것이 어떻겠냐는 제안을 제시한다. 메일링 리스트에서 논의되던 이 프로포절은 이로서 0단계 프로포절이 된다.

## 1단계: 제안 (stage 1: proposal)
이 프로포절은 [2014년 7월 31일 회의][20140731]에서 다음으로 등장한다. 동작에 대한 간단한 논의 (인자로 받는 게 배열의 원소여야 하는지 서브 배열이어야 하는지)와 네이밍에 대한 논의 후에 1단계 승격이 결정된다. 이후 논의에서 상대적으로 간단한 제안인 만큼 프로세스를 TC39 회의 밖에서 비동기적으로 진행하고 싶다는 의견이 나오는데, Allen Wirfs-Brock와 Mark Miller에 의해 기각된다.

[1단계 프로포절로 승격된 시점의 저장소][stage1 repo]를 보면, 이 프로포절이 필요한 이유와 API, 그리고 많이들 궁금해 할 법한 질문과 사용 예시 모두가 `README.md` 에 정리되어 있으며, 데모 구현 또한 저장소에 포함되어 있다. 승격에 필요한 요건의 체크리스트는 [6번 이슈][stage1 issue]에서 볼 수 있다.

> 이후 이 제안은 [2014년 11월 18일 회의][20141118]의 안건으로 올라온다. 이 안건에서는 `Array.prototype.contains` 가 표준에 포함되면 이를 구현한 브라우저에서 [Mootools][mootools]라는 라이브러리를 사용하고 있는 기존 웹사이트가 깨질 것이라는 문제가 제기된다.
> [당일 챔피언이 도착하고 이어진 논의][20141118]에서 결국 `String.prototype.contains` 와 `Array.prototype.contains` 의 메소드 명을 `includes` 로 변경하는 결정이 난다. 회의 전에 이루어진 [관련 대화 쓰레드][esdiscuss-mootools]를 읽어보면 **설령 유용한 새 기능을 포기하더라도 (그리고 그것이 TC39나 브라우저의 잘못으로 인한 상황이 아니더라도) 이미 존재하는 웹을 깨트리지 않겠다는 참여자들의 의지를 엿볼 수 있어 흥미롭다**.

## 2단계: 초고 (stage 2: draft)

이름을 바꾸기로 결정한 논의의 이틀 후인 [2014년 11월 20일][20141120], 이 프로포절을 2단계로 승격시키는 안건이 올라오고, 통과된다. 1단계와 마찬가지로 [2단계로 승격된 시점의 저장소][stage2 repo]와 [체크리스트를 담은 이슈][stage2 issue]를 깃헙 저장소에서 확인할 수 있다.

저장소를 확인해보면 스펙 초안은 사실 1단계가 되는 시점에서 이미 준비되어 있다. 2단계의 또다른 요구사항인 (예를 들어 V8에서 `--harmony-array-includes `등의 플래그에 의해 제어되는) 실험적인 구현이 완성된 시점에서 안건에 올라온 것으로 보인다. 앞으로 패치가 좀 더 있을 예정이므로 3단계로 올릴 수는 없다는 내용이 언급된다.

## 3단계: 후보 (stage 3: candidate)
2단계로 승격된 지 여덟 달이 지난 [2015년 7월 28일][20150728], 이 제안은 3단계로 승격된다. ([저장소][stage3 repo], [이슈][stage3 issue])

각종 엣지 케이스들에 대한 디자인 문제를 해결한 후 명세 문서가 완전히 정리된 상태다. 또한 지명된 리뷰어와 ECMAScript 편집자의 승인도 받은 것을 볼 수 있다. 실제로 명세를 담고 있는 [`spec.html` 파일의 히스토리][spec history]를 보면 **3단계로 승격된 이후에는 명세를 적은 마크업의 문법 버전 변경을 제외하면 변경 사항이 거의 전무하다**.

## 4단계: 완료됨 (stage 4: finished)
[2015년 11월 17일 회의][20151117]에서 `Array.prototype.includes` 메소드 프로포절은 최종적으로 4단계로 승격된다. 이 프로포절은 2016년 6월에 발표된 ECMAScript 2016 표준에 거듭제곱 연산자(`**`)와 함께 언어의 표준 기능으로 포함되어 배포된다.

---

# 맺으며

이렇게 ECMA-262 표준과 TC39, 그리고 TC39 프로세스에 대해 다루어보았다. 글을 끝맺기 전 마지막으로 이 모든 과정은 TC39의 구성원인 큰 기업만 참가할 수 있는 ‘그들만의 리그’가 아니라는 점을 강조하고 싶다. 앞서 언급했듯 모든 회의록과 프로포절의 진행상황은 전부 깃헙을 통해 언제든 조회할 수 있다. 누구든 챔피언을 구해 프로포절을 제출할 수 있으며, 진행중인 프로포절/현 표준에 대한 의견을 저장소, [메일링 리스트][esdiscuss mailing list] 또는 [포럼][esdiscuss forum]를 통해 밝힐 수 있다.

자바스크립트는 매우 명백한 결점과 고유의 매력을 동시에 가진 언어로 출발했다. 그 후 지난 20여년 간 꾸준하고 빠르게 더 나은 방향을 향해 발전해왔다. 이 애증의 언어의 결점을 고치고 더 매력적인 모습으로 바꾸어 낼 기회는 생태계의 모든 참여자에게 열려 있다. (물론 `Array.prototype.includes`의 사례에서 보았듯 그 길은 험난하고 굴곡져 있는 경우가 많다.) 이 언어와 웹에 애착을 가진 한 개발자로서, 그건 굉장히 멋진 일이라 생각한다.

[ecma-international]: https://www.ecma-international.org/

[ecma-262]: https://tc39.github.io/ecma262/

[tc39 notes]: https://github.com/tc39/tc39-notes

[tc39 process]: https://tc39.github.io/process-document/

[tc39 github]: https://github.com/tc39

[tc39 proposals]: https://github.com/tc39/proposals

[20140409]: http://tc39.github.io/tc39-notes/2014-04_apr-9.html#45-arrayprototypecontains

[20140731]: http://tc39.github.io/tc39-notes/2014-07_jul-31.html

[stage1 repo]: https://github.com/tc39/Array.prototype.includes/tree/4fafe65eaa57e6da65ecbe48aa3978b199087645

[stage1 issue]: https://github.com/tc39/Array.prototype.includes/issues/6

[20141118]: http://tc39.github.io/tc39-notes/2014-11_nov-18.html#44-arrayprototypecontains-breaks-mootools

[mootools]: https://mootools.net/

[20141118-2]: http://tc39.github.io/tc39-notes/2014-11_nov-18.html#51--44-arrayprototypecontains-and-stringprototypecontains

[esdiscuss-mootools]: https://esdiscuss.org/topic/having-a-non-enumerable-array-prototype-contains-may-not-be-web-compatible

[20141120]: http://tc39.github.io/tc39-notes/2014-11_nov-20.html#55-arrayprototypeincludes-proposal-to-move-to-stage-2

[stage2 repo]: https://github.com/tc39/Array.prototype.includes/tree/6e3b78c927aeda20b9d40e81303f9d44596cd904

[stage2 issue]: https://github.com/tc39/Array.prototype.includes/issues/10

[20150728]: http://tc39.github.io/tc39-notes/2015-07_july-28.html#6i-advance-arrayprototypeincludes-to-stage-3

[stage3 repo]: https://github.com/tc39/Array.prototype.includes/tree/5c3538772881d6efefb6c328d2c6ac0f8fe5170a

[stage3 issue]: https://github.com/tc39/Array.prototype.includes/issues/12

[spec history]: https://github.com/tc39/Array.prototype.includes/commits/master/spec.html

[20151117]: http://tc39.github.io/tc39-notes/2015-11_nov-17.html#arrayprototypeincludes

[esdiscuss mailing list]: https://mail.mozilla.org/listinfo/es-discuss

[esdiscuss forum]: https://esdiscuss.org/
