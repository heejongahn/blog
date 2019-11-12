---
templateKey: blog-post
title: GitHub Action을 사용해 새로 올라온 전월세 방 목록 받아보기
date: 2019-11-12T08:02:58.726Z
description: 부동산 앱에 새로 올라오는 방을 매번 직접 체크하는 대신 편하게 받아볼 수 없을까?
tags:
  - 라이프해킹
  - 일상
---
# 들어가며

매일 아침 11시,  [피터팬의 좋은방 구하기](https://www.peterpanz.com/)라는 부동산 거래 사이트에 새로 올라온 특정 조건(가격대, 지역 등)을 만족하는 매물을 아래와 같이 정리해서 보내주는 프로그램을 만들었다. ([저장소](https://github.com/heejongahn/tinkerbell-template)) 요새 블로깅이 너무 뜸하기도 했고, 재밌는 작업이라 과정을 기록으로 남겨보았다.

![메일로 부동산 매물을 받아보는 스크린샷](/assets/tinkerbell-result.png)

2019-11-12 수정: [양성민](https://ysm.sh/) 님께서 [GitHub Action의 타임존 관련 수정이 필요한 부분](https://twitter.com/ysm0622_/status/1194173951678668805)을 알려주셔서 수정했습니다. 감사합니다!

# 문제의식

이번 여름, 학부 졸업을 위해 다니던 회사를 나와 학교로 돌아왔다. 다음으로 갈 회사가 정해지고 출근 일자가 다가오면서 슬슬 서울에 살 집을 구할 날짜가 다가왔다. 주중에는 대전에서 학교를 다녀 부동산에서 집을 볼 수 있는 시간이 한정적이다보니 직방, 다방 등의 앱과 더불어 [피터팬의 좋은방 구하기](https://www.peterpanz.com/)(이하 "피터팬") 등의 직거래 사이트에서 사전 조사를 열심히 하기로 했다.

지난 주말, 그렇게 조사한 방을 보러 처음으로 한 동네를 방문했다. 미리 연락해 둔 부동산에서 소개해준 방들, 직방에서 연락해둔 방들, 피터팬에서 찾아본 방들을 모두 본 결과는 **실망스러웠다**. 예산을 적지 않게 잡았다고 생각했는데도 마음에 드는 방이 없었다. 눈이 너무 높나, 뭔가 포기해야하나 싶은 생각이 스쳤지만 이내 첫술에 배부르길 바라는 것이 욕심이라 마음을 고쳐먹었다. 당장 입사하는 것도 아니니 좀 더 길게 보고 느긋하게 방을 찾기로 했다. 

마음이 편해졌지만, 한편으로는 **너무 귀찮았다**. 일단 한 플랫폼에만 올라오는 방들이 있으니 (직방에는 직거래 매물이 없고, 피터팬에는 부동산 매물이 덜 올라오는 등) 여러개의 앱을 모두 봐야한다. 아직 어느 동네로 갈지 정확히 정하지 못했으니 각 앱마다 여러 동네를 한 번씩 다 체크해야한다. 게다가 한 번 보고 관심이 안 생긴 집은 또 본다고 마음이 바뀌지 않는데 필터링하는 옵션이 없어 목록을 뒤지며 일일이 새 매물이 올라왔는지 확인해야 한다.

꾹 참고 수시로 방을 검색하다보니 자연스레 

> 이거 내가 매번 확인하기 너무 귀찮은데, 그냥 조건만 지정해두고 새 방이 올라온 것만 받아볼 수 없나?

하는 의문이 들었다. 그런데 생각해보니 

1. 어차피 요새 다들 SPA로 앱을 만들어 이미 데이터를 제공하는 API가 존재하는데다
2. 매물은 인증 없이도 볼 수 있는 것을 알고 있으니

생각보다 어렵지 않게 할 수 있을 것 같았다. 개발자 도구를 열어 네트워크 탭을 확인하니 실제로 가능한 구조였다. 마음에 드는 방을 구할 때까지 얼마나 걸릴지 마음 속으로 잠시 추측을 해본 뒤, **자동화가 충분히 수지타산이 맞다는(?) 결론을 내렸다**. 직방, 다방, 피터팬 등 다양한 사이트를 한 번에 모두 커버하려다보면 작업이 너무 커질 것 같아 선택을 해야했는데,  

1. 부동산에서 찾아줄 수 없는 직거래 매물이 올라오고 상대적으로 괜찮은 방이 많다고 느꼈다.
2. 반지하, 옥탑 방을 거르고 싶은데 공식 웹사이트 또는 웹 페이지가 해당 옵션을 존재하지 않아 불편하다.

두 이유로 인해 피터팬을 첫 목표로 정했다.

# 기술 선택

같은 목적을 달성하더라도 어떤 기술을 택해 어떤 형태로 구현하느냐에 따라 비용은 크게 널뛴다. 때문에 요구사항을 잘 파악하고 적절한 기술을 선택하는 것이 구현 자체만큼, 혹은 그 이상으로 중요한 경우가 많다. 내가 생각한 중요한 요구사항은 세 가지였다.

1. 이미 본 방을 또 보는 건 의미가 없으므로 마지막으로 본 이후로 새로 올라온 방만 보내줘야 한다.
2. 내가 매번 확인할 필요 없이 주기적으로 실행되어서 나에게 알려줘야 한다.
3. 공식 API를 사용하는 것이 아니라 CORS가 막히므로 웹 브라우저 상에서 돌아갈 순 없다.

그 외에, 필수는 아니지만 기왕이면 만들어서 다른 사람들도 (자신이 원하는 방을 받아볼 수 있도록) 쓸 수 있게 배포하기가 편하면 좋겠다고 생각했다.

요구사항을 만족시키는 안으로 도커 +  `cron`을 이용하는 방법과 일렉트론을 이용해 데스크탑 앱을 만드는 방법 두 가지 정도가 떠올랐다. (둘 다 익숙한 도구는 아니지만 금방 배울 수 있을거라 생각했다) 바로 작업에 들어가기 전에 더 좋은 방법이 없을지 아는 개발자들이 있는 톡방에 여쭤보았다.

![더 나은 방법이 없을지 물어보는 스크린샷](/assets/tinkerbell-question.jpg)

이후로 대화를 나누며 요구사항을 좀 더 명확히 정리하던 중 한 분께서 GitHub Action을 사용하면 어떻겠냐는 제안을 주셨다.

![GitHub Action 사용을 제안받는 스크린샷](/assets/tinkerbell-answer.jpg)

처음 들었을 때는 “이미 본 방의 목록”이라는 상태를 로컬에 저장할 계획이었어서 어려울 것이라 생각했다. 하지만 API 응답을 다시 보니 매물이 올라온 시간을 내려주고 있었다. “어제 이후로 올라온 방” 을 매일 받아볼 수단이 있으면 **원했던 목적을 달성할 수 있을 뿐더러 내가 생각한 안보다 훨씬 간단하고 나은 해결책 같았다**.

도움을 주신 분들께 감사를 표하고, GitHub Action을 이용해 개발하기로 결정했다.

# API 호출 및 데이터 정제

일단 배포에 앞서 실제로 매물을 받아오는 로직을 작성해야 했다. 피터팬에서 내부적으로 사용하는 페이로드 형태를 타입스크립트 인터페이스로 정의한 뒤,

```ts
import { ContractType } from "../filter";
import { differenceInCalendarDays, parse } from "date-fns";

export type RoomType = "일반" | "옥탑" | "반지하" | "복층";

export interface HousePayload {
  hidx: number;
  info: {
    subject: string;
    room_count: number;
    bedroom_count: number;
    thumbnail: string;
    created_at: string;
    live_start_date: string;
    is_octop: boolean;
    is_half_underground: boolean;
    is_multilayer: boolean;
  };
  type: {
    contract_type: ContractType;
    trade_type: "direct" | "agency";
    building_form: string | null;
    building_type: string;
    building_code: string;
    isCafe: boolean;
    fa3Code: 0;
  };
  price: { monthly_fee: number; deposit: number; maintenance_cost: number };
  floor: { target: 2; total: 4; floor_type: 1 };
  location: {
    coordinate: {
      latitude: string;
      longitude: string;
    };
    address: {
      sido: string;
      sigungu: string;
      dong: string;
    };
  };
}
```

가져다 쓰기 편한 형태와 좀 더 이해가 쉬운 변수명을 갖는 클래스로 한 번 감쌌다.

```ts
import { ContractType, RoomCount } from "../filter";
import { differenceInCalendarDays, parse } from "date-fns";

export class House {
  id: number;

  price: {
    deposit: number;
    rent: number;
    maintenance: number;
  };

  displayLocation: string;

  floor: {
    total: number;
    target: number;
  };

  info: {
    title: string;
    thumbnail: string;
    createdAt: string;
  };

  contractType: ContractType;
  roomType: RoomType;
  roomCount: RoomCount;

  get isNew() {
    // GitHub Action은 UTC 시간대에서 실행됨
    const now = addHours(Date.now(), 9);
    const createdAt = parse(
      this.info.createdAt.split(" ")[0],
      "yyyy-MM-dd",
      Date.now(),
    );

    const diff = differenceInCalendarDays(now, createdAt);
    return diff < 2;
  }

  constructor(payload: HousePayload) {
    const { hidx, info, price, type, floor, location } = payload;

    this.id = hidx;

    this.price = {
      deposit: price.deposit,
      rent: price.monthly_fee,
      maintenance: price.maintenance_cost,
    };

    this.displayLocation = [
      location.address.sigungu,
      location.address.dong,
    ].join(" ");

    this.floor = floor;

    this.info = {
      title: info.subject,
      thumbnail: info.thumbnail,
      createdAt: info.created_at,
    };

    this.contractType = type.contract_type;
    this.roomCount =
      info.room_count >= 3
        ? RoomCount.threeAndMoreRooms
        : info.room_count === 2
        ? RoomCount.twoRooms
        : RoomCount.oneRoom;
    this.roomType = info.is_half_underground
      ? "반지하"
      : info.is_multilayer
      ? "복층"
      : info.is_octop
      ? "옥탑"
      : "일반";
  }
}
```

그 뒤 관심있는 지역과 조건을 정의하는 예시를 작성했다.

```ts
import { Filter, RoomFloor, RoomCount, ContractType } from "../filter";

/**
 * 월세 한도 (단위 만원)
 */
const rentBudget = 100;

/**
 * 보증금 한도 (단위 만원)
 */
const depositBudget = 100;

const commonFilter = {
  priceRange: {
    rent: { max: rentBudget * 10000 },
    deposit: { max: depositBudget * 10000 },
  },
  roomFloors: [RoomFloor.lower, RoomFloor.higher],
  roomCounts: [RoomCount.twoRooms, RoomCount.threeAndMoreRooms],
  contractTypes: [ContractType.rent],
  shouldIncludeHalfUndergrounds: false,
  shouldIncludeLofts: true,
  shouldIncludeRooftops: true,
};

const candidates: Filter[] = [
  {
    id: "뚝섬 서울숲",
    ...commonFilter,
    bounds: {
      max: { lat: 37.5558485, lng: 127.060802 },
      min: { lat: 37.5317832, lng: 127.0328288 },
    },
  },
  {
    id: "양재",
    ...commonFilter,
    bounds: {
      max: { lat: 37.4854867, lng: 127.0506948 },
      min: { lat: 37.4667919, lng: 127.0319895 },
    },
  },
  {
    id: "회사 근처",
    ...commonFilter,
    bounds: {
      max: { lat: 37.508058, lng: 127.0463052 },
      min: { lat: 37.4893626, lng: 127.0275955 },
    },
  },
];

export default candidates;
```

마지막으로 피터팬에서 사용하는 형태로 조건 쿼리 파라미터를 포매팅하는 함수,

```ts
interface PriceRange {
  min?: number;
  max: number;
}

export enum RoomFloor {
  lower = "1층 ~ 5층",
  higher = "6층 이상",
}

export enum RoomCount {
  oneRoom = "원룸",
  twoRooms = "투룸",
  threeAndMoreRooms = "쓰리룸 이상",
}

export enum ContractType {
  rent = "월세",
  jeonse = "전세",
  sale = "매매",
  shortTerm = "단기임대",
}

interface Point {
  lat: number;
  lng: number;
}

export interface Filter {
  id: string;
  priceRange: {
    rent?: PriceRange;
    deposit?: PriceRange;
  };
  bounds: {
    max: Point;
    min: Point;
  };
  roomFloors: RoomFloor[];
  roomCounts: RoomCount[];
  contractTypes: ContractType[];
  shouldIncludeHalfUndergrounds: boolean;
  shouldIncludeLofts: boolean;
  shouldIncludeRooftops: boolean;
}

export function constructFilterQueryParam(filter: Filter) {
  const { priceRange, bounds, roomFloors, roomCounts, contractTypes } = filter;

  const tokens: string[] = [
    `latitude:${bounds.min.lat}~${bounds.max.lat}`,
    `longitude:${bounds.min.lng}~${bounds.max.lng}`,
  ];

  if (priceRange.rent) {
    tokens.push(
      `checkMonth:${priceRange.rent.min || 999}~${priceRange.rent.max}`,
    );
  }

  if (priceRange.deposit) {
    tokens.push(
      `checkDeposit:${priceRange.deposit.min || 999}~${priceRange.deposit.max}`,
    );
  }

  if (roomFloors.length > 0) {
    const totalRoomFloors = roomFloors.map(f => `"${f}"`);

    tokens.push(`roomCount_etc;[${totalRoomFloors.join(",")}]`);
  }

  if (roomCounts.length > 0) {
    tokens.push(`roomType;[${roomCounts.map(t => `"${t}"`).join(",")}]`);
  }

  if (contractTypes.length > 0) {
    tokens.push(`contractType;[${contractTypes.map(t => `"${t}"`).join(",")}]`);
  }

  return tokens.join("||");
}
```

그리고 API를 호출한 뒤 설정에 따라 반지하, 옥탑 등의 매물을 거르는 함수를 작성했다.

```ts
import axios from "axios";
import { stringify } from "query-string";

import { Filter, constructFilterQueryParam } from "../filter";
import { HousePayload, House } from "../models/House";

interface FetchHousesResponse {
  houses: {
    direct?: {
      image: HousePayload[];
    };
    agency?: {
      image: HousePayload[];
    };
  };
}

const apiEndpoint = "https://api.peterpanz.com/houses/area";

export async function fetchHouses(candidate: Filter): Promise<House[]> {
  const query: { [key: string]: any } = {
    filter: constructFilterQueryParam(candidate),
    pageSize: 100,
    pageIndex: 1,
  };

  const url = `${apiEndpoint}?${stringify(query)}`;

  const { data } = await axios.get<FetchHousesResponse>(url, {
    headers: { "content-type": "application/json" },
  });

  const { direct = { image: [] }, agency = { image: [] } } = data.houses;

  const houses = [...direct.image, ...agency.image].filter(h => {
    return (
      (candidate.shouldIncludeHalfUndergrounds ||
        !h.info.is_half_underground) &&
      (candidate.shouldIncludeLofts || !h.info.is_multilayer) &&
      (candidate.shouldIncludeRooftops || !h.info.is_octop)
    );
  });

  return houses.map(payload => new House(payload)).filter(h => h.isNew);
}
```

위 코드엔 버그가 있다. API가 페이지네이션이 되어 있어서 제대로 된 동작을 위해선 응답으로 넘어온 `totalCount`를 보고 남은 데이터가 있는 경우 페이지를 넘겨가며 끝까지 호출한 뒤 전부 취합해 반환해야 한다. 하지만 내가 찾아보는 지역들은 새 매물이 있어봤자 10개를 넘기는 경우가 드물어서 100개를 넘어가는 경우는 굳이 처리하지 않았다.

# GitHub Action 설정

GitHub Action은 GitHub이 제공하는 CI/CD 솔루션이다. 선정된 특정 사용자에게만 제공되던 시기를 거쳐 [지난 8월 베타 버전을 공개한 소식](https://github.blog/2019-08-08-github-actions-now-supports-ci-cd/)은 들었지만, 아직까지 한 번도 사용해본 적은 없었다. GitHub Action을 택한 데에는 이 기회에 배워두면 좋겠다는 생각도 있었다. [공식 문서](https://help.github.com/en/actions/automating-your-workflow-with-github-actions)를 참고하면서 개발했는데 별로 어렵지 않게 설정이 가능했다.

GitHub Action 워크플로우는 저장소 루트의 `.github/workflows` 폴더에 `<action name>.yml` 파일을 통해 설정할 수 있다. 메일을 어떻게 보낼지 좀 고민이었는데, Watch 중인 저장소에 이슈가 올라오면 메일이 온다는 점에 착안해 **메일을 직접 보내는 대신 매일 필요한 정보를 담은 이슈를 만들도록 설정했다**.

먼저, API로부터 받아온 정보를 적당히 보기 편한 GitHub Flavored Markdown 형태로 포매팅한다.

```ts
const sections: string[] = [];

await Promise.all(
  candidates.map(async candidate => {
    const houses = await fetchHouses(candidate);
    const section = [
      `# ${candidate.id}: ${houses.length}개`,
      "",
      ...houses.map(
        ({
          displayLocation,
          info,
          price,
          roomType,
          roomCount,
          contractType,
          floor,
          id,
        }) => {
          const title = `## [${displayLocation}] ${info.title}`;
          const thumbnail = `<img src=${info.thumbnail} >`;
          const deposit = formatKRW(price.deposit);
          const monthly = ` ${formatKRW(price.rent)}<br>(+ ${formatKRW(
            price.maintenance,
          )})`;

          const floorInfo = `총 ${floor.total}층 중 ${floor.target}층`;

          return [
            title,
            thumbnail,
            "",
            `| 종류 | 보증금 | 월세<br>(+ 관리비) | 방 타입 | 층수 |`,
            `| - | - | - | - | - |`,
            `| ${roomCount} ${contractType} | ${deposit} | ${monthly} | ${roomType} | ${floorInfo} |`,
            "",
            `[바로가기](https://www.peterpanz.com/house/${id})`,
            "<hr>",
            "",
          ].join("\n");
        },
      ),
    ].join("\n");

    sections.push(section);
  }),
);

const body = sections.join("\n\n");
createIssue(`${format(Date.now(), "yyyy-MM-dd")}일 새로 올라온 방`, body);
```

다음으로 이렇게 포매팅한 스트링을 받아 실제 이슈를 생성한다. 이슈 생성에는 [create-an-issue](https://github.com/JasonEtco/create-an-issue)의 코드를 참고했다. 처음엔 그대로 가져다쓸 수 있을 줄 알았는데 내 용례에는 필요없는 중간 파일을 만들어야 하는 문제가 있어, 소스를 가져다 데이터를 바로 넘기도록 수정했다.

```ts
import { Toolkit } from "actions-toolkit";

export default function createIssue(title: string, body: string) {
  Toolkit.run(
    async tools => {
      tools.log.info(`Creating new issue ${title}`);

      try {
        const issue = await tools.github.issues.create({
          ...tools.context.repo,
          title,
          body,
        });

        tools.log.success(
          `Created issue ${issue.data.title}#${issue.data.number}: ${issue.data.html_url}`,
        );
      } catch (err) {
        tools.log.error(err);
        if (err.errors) {
		    tools.log.error(err.errors);
		  }

        tools.exit.failure();
      }
    },
    {
      secrets: ["GITHUB_TOKEN"],
    },
  );
}
```

이슈 생성을 npm 스크립트로 등록한 뒤 먼저 GitHub에서 제공하는 Node.js 워크플로우를 참고해 작업을 정의했다. GitHub Action의 맥락 내에서는 `secrets.GITHUB_TOKEN` 이라는 토큰이 자동으로 들어오는데, 이 토큰을 환경변수로 넘겨 GitHub API 인증을 처리할 수 있다.

```yaml
jobs:
  fetch:
    name: Fetch
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Use Node.js 10.x
        uses: actions/setup-node@v1
        with:
          node-version: 10.x
      - name: 이슈 생성
        run: |
          npm ci
          npm run fetch
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

작업을 정의했으면 마지막으로 이슈를 만드는 동작을 실행할 트리거를 정의해주어야 한다. GitHub Action은 워크플로우를 트리거하기 위한 [다양한 이벤트를 제공하는데](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows), 나는 매일 아침 11시([`schedule`](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows#scheduled-events-schedule)), 그리고 저장소에 새 코드가 푸시된 경우 ([`push`](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows#push-event-push)) 작업이 실행되도록 설정했다.

```yaml
name: 새로 올라온 직거래 방 정보 받아오기
on:
  push:
    branches:
      - master
  schedule:
    # 오전 11시 (GitHub Action은 UTC 타임존)
    - cron: "0 2 * * *"
jobs:
  fetch:
    name: Fetch
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Use Node.js 10.x
        uses: actions/setup-node@v1
        with:
          node-version: 10.x
      - name: 이슈 생성
        run: |
          npm ci
          npm run fetch
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

설정 파일 시행착오로 인한 몇 차례의 `git add -A; git commit —amend; git push -f`를 거친 후, 원하는 대로 새로운 매물 정보를 담은 리포트가 메일로 날아오는 것을 확인했다.

![메일로 부동산 매물을 받아보는 스크린샷](/assets/tinkerbell-result.png)

**만세!**

원래 바라던 대로 프로그래밍 지식이 없는 사용자도 사용할 수 있는 형태는 아니지만, 이미 내가 원하던 수준을 달성한 상태라 추가적으로 노력을 들일 의욕이 별로 생기지 않았다. 그래도 Git과 GitHub의 기본적인 사용법을 익힌 사람에게는 유용할 수 있을 것 같아 간단하게 커밋을 정리하고 README를 작성해 새로운 공개 저장소를 파서 [GitHub에 공개했다](https://github.com/heejongahn/tinkerbell-template).

# 마치며

만들면서 재미있었다. 아주 개인적인 필요에 의해 시작해, 열 시간이 채 안 되는 시간 투자로 매일 앱을 켜서 여러 동네에 새 방이 올라왔는지 확인하는 노동에서 해방되었다. 이런 삶의 소소한 불편/비효율을 개선할 때면 프로그래밍을 배워두길 잘했다는 기분이 든다. 직방, 다방 등도 비슷한 자동화가 가능할 것 같은데 **누군가 대신 해주신다면 매일 자기 전 계신 방향으로 큰절을 올리겠습니다**.

GitHub Action을 처음 써본 소감은 상당히 괜찮았다. 설정이 쉽고 직관적이고, 어차피 GitHub을 사용하는 입장에서 GitHub 내에서 모든 것을 처리 가능한 점이 매력적으로 느껴졌다. 복잡한 용례를 얼마나 잘 커버하는지는 모르겠지만, 적어도 간단한 작업에는 앞으로도 종종 사용할 생각이다. 로컬 테스트가 불가능한 점은 좀 아쉬웠다.

**무엇보다도 만든 보람이 있도록 좋은 집이 구해졌으면 좋겠다! 응원해주세요!**
