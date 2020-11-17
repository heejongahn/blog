---
templateKey: blog-post
title: '「플렉스팀 프론트엔드 기술 스택의 이해: `lint`, `build`, `run`」 발표자료 공개'
date: 2020-11-17T14:12:21.081Z
description: 2020년 11월 17일 플렉스팀 엔지니어링 챕터 프론트엔드 위클리에서 발표한 자료를 공유합니다.
tags:
  - 프로그래밍
  - 프론트엔드
  - eslint
  - prettier
  - Babel
  - Webpack
  - next.js
  - swr
---
<iframe src="//www.slideshare.net/slideshow/embed_code/key/8qMcR0AESPryYB" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/HeejongAhn/lint-build-run-239299778" title="플렉스팀 프론트엔드 기술 스택의 이해: `lint`, `build`, `run`" target="_blank">플렉스팀 프론트엔드 기술 스택의 이해: `lint`, `build`, `run`</a> </strong> from <strong><a href="https://www.slideshare.net/HeejongAhn" target="_blank">Heejong Ahn</a></strong> </div>

1. 작년 말부터 [사람과 조직에 대한 문제를 해결하는 flex라는 제품](https://flex.team)을 만드는 플렉스팀에서 일하고 있습니다. 우리 팀 프론트엔드 개발자들은 매주 근황을 나누고, 여러 기술적인 주제에 대한 합의를 이루며, 고민과 지식을 공유하는 위클리 미팅을 합니다. 기술 관련 내용을 공유하는 테크 톡도 한 코너로 존재하는데, 저는 최근에 우리 제품을 구성하는 기술들에 대해 발표했습니다. 내부 구성원을 대상으로 만들기도 했고 준비에 많은 시간을 쓰지 못했다보니 부족한 부분이 많아 고민했지만, 시간 들여 만든 자료가 다른 분들께도 도움이 될까 싶어 공유합니다. 혹 오류가 보인다면 제보해 주시면 감사하겠습니다.

2. 화면을 그리거나 새 기능을 만드는 일에 비하면 상대적으로 플랫폼 내지는 데브옵스 업무라 불릴 이런 영역은, 가만히 냅두면 일단은 잘 돌아가고 건드리긴 무섭습니다. 그러다보니 - 특히 작은 조직일수록 - 상대적으로 잘 아는 한두 명이 일단 설정 마친 후엔 잘 안 보게 되고, 그들에게만 관련 업무가 몰리는 경향도 있는 것 같습니다. 하지만 **오히려 팀원 모두가 영향을 받는 이런 영역이야말로 팀의 누구나 알고 또 고칠 수 있을 때 정말 큰 임팩트가 생기지 않을까?** 라는 생각, 또 그게 가능한 팀을 만들고 싶다는 생각을 한지가 좀 되었습니다. 이러나 저러나, 프로젝트를 구성하는 모든 영역에 친숙해지는 건 구성원 각각에게도 좋은 일 아니겠어요? 그 첫 걸음이 될 수 있다면 좋겠다는 마음으로 발표를 준비했습니다.

3. 사실 앞서 말씀드린 FE 개발자 위클리 미팅은 지지난 주에, 테크 톡은 이번 주에, 둘 다 구성원들의 자발적인 제안으로 처음 시작됐습니다. FE 개발자는 이제 막 6명이 모여 조직으로서 더 시너지를 내고 함께 성장할 다양한 방법을 하나둘 고민하고 찾아나가기 시작한 단계입니다. 다른 직군도 구체적인 구성원 수의 차이는 있지만 대부분 비슷한 상황이고요. 우리는 우리 팀과 제품이 지금으로부터 아주 멀리 갈 것이라 믿고, 그 여정은 이제 시작이라 생각합니다. 훌륭하고 친절한 동료들, 많이 어렵지만 그만큼 풀었을 때 만들어 낼 가치가 거대한 문제들, 매일 느끼는 갈증을 채워줄 제품을 애타게 찾는 온갖 분야의 고객들이 기다립니다. [최근 받은 투자](https://platum.kr/archives/151902https://platum.kr/archives/151902)에 힘입어 전 직군에서 좋은 동료 분들을 모시고 있으니, 부디 [채용 페이지](https://bit.ly/flexteam_recruit)를 확인해보시고 관심이 동하시거든 지원 부탁드립니다.
