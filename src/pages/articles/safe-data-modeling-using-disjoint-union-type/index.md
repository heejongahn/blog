---
templateKey: blog-post
title: safe-data-modeling-using-disjoint-union-type
date: 2020-04-05T04:56:50.757Z
description: 이것이거나 저것이거나 조것인 데이터를 어떻게 모델링할까?
tags:
  - 타입스크립트
  - 타입
  - 타입 시스템
  - 서로소 유니온 타입
  - 대수 타입
  - 프로그래밍
---
특별한 언급이 없는 이상 이 글의 모든 예시 코드는 TypeScript 코드입니다.

---

# 동기부여
코드를 짜다보면 “여러 가지 중 하나의 경우”를 모델링할 일이 많이 생긴다.

예를 들어, 쇼핑몰 애플리케이션에서 사용자의 결제 수단을 모델링하는 경우를 생각해보자. 결제 수단은 신용카드일수도, 가상 계좌를 통한 계좌 이체일수도, [토스 결제](https://toss.im/pay/)등의 간편결제수단일 수도 있다.  [열거형]( https://ko.wikipedia.org/wiki/%EC%97%B4%EA%B1%B0%ED%98%95)은 이런 “여러 경우의 수 중 하나”인 데이터를 모델링하기 위해서 흔히 사용되는 수단이다. (이 경우의 수를 이하 가지/branch/라 부르자) TypeScript 역시 [열거형을 지원한다](https://ahnheejong.gitbook.io/ts-for-jsdev/03-basic-grammar/enums).

```ts
enum PaymentMethodType {
  CreditCard,
  BankTransfer,
  Toss,
}
```

*하지만 실제 데이터의 모델링이 이 정도에서 끝나는 일은 흔치 않다*. 위 예시를 이어가보자. 신용카드의 경우는 카드 번호, 카드사 등의 정보를, 계좌 이체의 경우 해당 사용자에게 할당된 가상계좌 정보를 추가로 가질 것이다. 이 때, 이 추가적인 정보는 어떤 가지에 해당하는 데이터인지에 따라 필요할 수도, 그렇지 않을 수도 있다.

이런 데이터를 어떻게 모델링하면 좋을까?

# 첫 번째 시도: 선택 속성
가장 쉽게 생각할 수 있는 방법은 경우에 따라 존재할 수도, 그러지 않을 수도 있는 모든 필드를 선택 속성(optional property)로 정의하는 것이다.

```ts
enum PaymentMethodType {
  CreditCard,
  BankTransfer,
  Toss,
}

interface PaymentMethod {
  type: PaymentMethodType;
  creditCardInformation?: {
    providerCode: number;
    cardNumber: string;
  };
  bankAccountInformation?: Array<{
    bankCode: number;
    bankAccount: string;
  }>;
  tossUserIdentifier?: string;
}
```

새로 정의된 `PaymentMethod` 타입은 아래와 같이 신용카드, 계좌 이체 등의 결제 정보를 담을 수 있다.

```ts
const creditCardPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
};

const bankAccountPaymentMethod: PaymentMethod = {
  type: PaymentMethodType. BankTransfer,
  bankAccountInformation: [
    {
      bankCode: 42,
      bankAccount: ‘1234123412341234’,
    },
  ],
};
```

원하는 값을 표현할 수 있게 되었다! 이걸로 충분할까? 사실 이 타입은 몇 가지 문제를 안고 있다. 예를 들어, 지금의  `PaymentMethod` 타입은 아래와 같은 값도 허용한다. 

```ts
const weirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
  bankAccountInformation: [
    {
      providerCode: 42,
      cardNumber: ‘1234123412341234’,
    },
  ],
};

const anotherWeirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
};
```

하지만 신용카드 결제 수단 데이터가 가진 `bankAccountInformation` 필드의 의미는 무엇일까? 또한 신용카드 정보가 없는 신용카드 결제 수단 데이터는 과연 올바른 값일까? *현재의 `PaymentMethod` 타입은 [불가능한 상태를 불가능하게 만들지 않는다](https://kentcdodds.com/blog/make-impossible-states-impossible)*.

그 뿐만이 아니다. 어떤 함수가 `PaymentMethod` 타입의 값을 받되, 해당 값이 신용카드 결제수단 데이터일 때에만 신용카드 정보를 쓰고픈 경우를 생각해보자. 매번 이 값이 신용카드 결제수단 데이터인지(`paymentMethod.type === PaymentMethodType.CreditCard`), 그리고 신용카드 정보가 실제로 존재하는지  (`paymentMethod.creditCardInformation != null` ) 두 번씩 검사해야하는 불편함이 발생한다.

```ts
function getCreditCardInformation(paymentMethod: PaymentMethod): CreditCardInformation | null {
  if (paymentMethod.type !== PaymentMethod.CreditCard) {
    return null;
  }

  // `type`을 체크했지만 여전히 paymentMethod.creditCardInformation 필드가 존재함이 보장되지 않는다.
  if (paymentMethod.creditCardInformation == null) {
    return null;
  }

  return paymentMethod.creditCardInformation;
}
```

이런 문제가 생기는 근본적인 원인 역시 위에서 언급했듯 불가능한 상태를 불가능하게 만들지 않았기 때문이다. 그럼 해결책은 무엇일까? 불가능한 상태를 불가능하게 만드는 것이다!

# 개선안: 불가능한 상태를 불가능하게
한발짝 물러서서, 이 타입으로 표현하고 싶은 데이터의 형태를 생각해보자. 

우리는 `PaymentMethod` 타입의 다음 셋 중 한 가지에 해당하는 값을 담을 수 있기를 바란다.

* 카드 정보를 갖는 신용카드 결제수단
* 가상 계좌 정보를 갖는 계좌이체 결제수단
* 토스 서비스의 유저 식별자 정보를 갖는 토스 결제수단

또한, 우리는 `PaymentMethod` 타입이 다음과 같은 값을 담을 수 없기를 바란다.

* 카드 정보를 갖는 계좌이체 결제수단 (???)
* 가상 계좌 정보가 없는 계좌이체 결제수단 (???)

*이 정보를 그대로 타입으로 옮기는 것이 우리 목표다.* 다행히도, TypeScript의 [문자열 리터럴 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)(또는 [숫자 리터럴 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#numeric-literal-types))과 [유니온 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)의 조합으로 이 목표를 달성하는 타입을 정의할 수 있다!

먼저 각 가지를 나타내는 타입을 정의해보자. 이 때, 해당 데이터가 어떤 가지에 속하는지를 나타내는 `type` 필드를 해당 `PaymentMethodType` 를 사용한 리터럴 타입으로 정의하자. 리터럴 타입을 사용해 *딱 하나의 값으로 고정되는 타입*을 정의할 수 있다. 예를 들어, 다음 코드에서 `CardPaymentMethod` 타입의 모든 값의 `type` 필드값은 항상 `PaymentMethodType.CreditCard`으로 고정된다.

```ts
// 신용카드 결제수단은
// 신용카드를 나타내는 값을 담은 type 필드와
// 카드 정보를 담은 creditCardInformation 필드를 갖는다.
type CardPaymentMethod = {
  type: PaymentMethodType.CreditCard;
  creditCardInformation: {
    providerCode: number;
    cardNumber: string;
  };
};

// 계좌이체 결제수단은
// 계좌이체를 나타내는 값을 담은 type 필드와
// 계좌 정보를 담은 bankAccountInformation 필드를 갖는다.
type BankPaymentMethod = {
  type: PaymentMethodType.BankTransfer;
  bankAccountInformation: Array<{
    bankCode: number;
    bankAccount: string;
  }>;
};

// 토스 결제수단은
// 토스를 나타내는 값을 담은 type 필드와
// 토스 사용자 아이디를 담은 tossUserIdentifier 필드를 갖는다.
type TossPaymentMethod = {
  type: PaymentMethodType.Toss;
  tossUserIdentifier: string;
};
```

각 가지의 정의가 끝났으니, 유니온 타입을 이용해 `PaymentMethod` 타입이 이 가지 중 하나에 해당함을 나타내보자. 유니온 타입을 사용해 *이 타입이거나 저 타입인* 타입을 정의할 수 있다.

```ts
// 결제수단은
// 신용카드 결제수단이거나
// 계좌이체 결제수단이거나
// 토스 결제수단이다.
type PaymentMethod =
	| CardPaymentMethod
  | BankPaymentMethod
  | TossPaymentMethod;
```

*이게 전부다*! 우리가 의도한 바를 그대로 코드로 옮긴, 새로운 `PaymentType` 이 완성되었다!

하지만 정말 이 타입이 아까 전보다 나아진 걸까? 이 정의가 우리의 첫 시도보다 나은지 확인해보자. 먼저, 이 타입은 첫 번째 시도에서처럼 *우리의 의도에 알맞는 올바른 값을 허용한다*.

```ts

// OK
const creditCardPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
};

// OK
const bankAccountPaymentMethod: PaymentMethod = {
  type: PaymentMethodType. BankTransfer,
  bankAccountInformation: [
    {
      bankCode: 42,
      bankAccount: '1234123412341234',
    },
  ],
};
```

하지만, 첫 번째 시도와는 달리, *이제 `PaymentMethod`에 올바르지 않은 값을 할당할 수 없다*. 만약 이상한 값을 할당하려 하면, TypeScript 컴파일러가 빨간펜을 들고 아래와 같이 경고해 줄 것이다.

```ts
// 해석: `type` 필드를 보니 `CardPaymentMethod` 가지일 수 밖에 없는데,
// `CardPaymentMethod` 가지에 존재하지 않는 `bankAccountInformation` 필드 값이 넘어왔다.
//
// TypeError(TS2322)
// Type ‘{ type: PaymentMethodType.CreditCard; creditCardInformation: { cardNumber: string; providerCode: number; }; bankAccountInformation: { providerCode: number; cardNumber: any; 1234123412341234: any; }[]; }’ is not assignable to type ‘PaymentMethod’.
//   Object literal may only specify known properties, and ‘bankAccountInformation’ does not exist in type ‘CardPaymentMethod’.(2322)
const weirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
  bankAccountInformation: [
    {
      providerCode: 42,
      cardNumber: ‘1234123412341234’,
    },
  ],
};

// 해석: `type` 필드를 보니 `CardPaymentMethod` 가지일 수 밖에 없는데,
// `CardPaymentMethod` 가지에 필요한 `creditCardInformation` 필드가 없다.
//
// TypeError (TS2322)
// Type ‘{ type: PaymentMethodType.CreditCard; }’ is not assignable to type ‘PaymentMethod’.
//  Property ‘creditCardInformation’ is missing in type ‘{ type: PaymentMethodType.CreditCard; }’ but required in type ‘CardPaymentMethod’.
const anotherWeirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
};
```

또한, `type` 필드만 보면 어떤 가지인지 식별할 수 있고, 특정 가지임이 판별되었다면 필요한 데이터가 함께 존재함이 타입 수준에서 보장되므로 동일한 의미의 체크를 두 번 할 필요 또한 없어졌다.

```ts
function getCreditCardInformation(paymentMethod: PaymentMethod): CreditCardInformation | null {
  // 여기서 `paymentMethod.creditCardInformation` 필드에 접근하려
  // 시도하면 타입 에러가 발생한다.
  if (paymentMethod.type !== PaymentMethod.CreditCard) {
    return null;
  }

  // `type` 체크를 통과하면 paymentMethod.creditCardInformation 필드가 존재함이 보장된다.
  return paymentMethod.creditCardInformation;
}

function getFormattedDisplayName(paymentMethod: PaymentMethod) {
  // switch - case 문 또한 의도대로 동작한다.
  switch (paymentMethod.type) {
    case PaymentMethodType.CreditCard {
      return `신용카드 ${paymentMethod.creditCardInformation. cardNumber}`;
    }
    case PaymentMethodType.BankTransfer: {
      return `가상계좌 ${paymentMethod.bankAccountInformation.bankAccount}`;
    }
    case PaymentMethodType.Toss: {
      return `토스 ${paymentMethod.tossUserIdentifier}`;
    }
  }
}
```

이 쯤 되면 더 나아졌다고 부르기 큰 부족함이 없을 것 같다. 😁

# 서로소 유니온 타입
 안전한 `PaymentMethod` 타입을 정의하기 위해 거친 과정을 생각해보자.

1. 원하는 타입(`PaymentMethod`)을 서로 겹치지 않는 여러 가지로 나누었다.
2. 각 가지의 타입(`CardPaymentMethod`, `BankPaymentMethod`, …)을 정의했다. 이 때, 가지 별로 존재하는 데이터와 함께 각기 다른 리터럴 타입의 `type` 필드를 두어 `if`-`else`, 또는 `switch`-`case` 등에서의 구분에 사용했다.
3. 유니온 타입을 사용해 원하는 타입을 “이 경우 또는 저 경우 또는 요 경우 또는…”으로 (`PaymentMethod = CardPaymentMethod  | BankPaymentMethod `) 정의했다.

이렇게 *겹치지 않는 가지들 중 하나*로 정의된 타입을 *서로소 유니온 타입*(disjoint union type)이라 부른다. “서로소”는 교집합이 없는 집합 사이의 관계를 의미하는 “서로소 집합”에서와 같은 의미를 갖는다.

이런 식의 타입 정의는 매우 다양한 경우에 응용해볼 수 있다.

네트워크 요청을 통해 데이터를 받아오는 작업의 상태:

```ts
type FetchStatus<Data, Error> =
  | { type: ‘idle’ }
  | { type: ‘pending’ }
  | { type: ‘fulfilled’, data: Data }
  | { type: ‘rejected’, error: Error }
  | { type: ‘cancelled’ };
```

쇼핑몰의 쿠폰 데이터:

```ts
type CommonCouponData = {
  name: string;
  description?: string;
  expireDate?: Date;
  /* ... */
}

type FixedAmountDiscountCoupon = CommonCouponData & {
  type: ‘fixedAmountDiscount’;
  discountAmount: Currency;
};

type RateDiscountCoupont = CommonCouponData & {
  type: ‘rateDiscount’;
  discountRate: number;
};

type: FreeDeliveryCoupon = CommonCouponData & {
  type: ‘freeDelivery’;
};

type Coupon =
  | FixedAmountDiscountCoupon
  | RateDiscountCoupont
  | FreeDeliveryCoupon;
```

등등. 가능성은 무한하다!

# 맺으며
서로소 유니온 타입이 어떤 문제를 해결하는지, 어떻게 정의하고 사용할 수 있는지 다루어 보았다.

이 글에서는 리터럴 타입과 유니온 타입을 사용했지만, 이는 TypeScript의 언어적 제약일 뿐, 언어에 따라 서로소 유니온 타입을 구현하는 방법은 다양하다. [Haskell](https://www.haskell.org/) 이나 [Rust](https://www.rust-lang.org/) 등 보다 강력한 타입 시스템을 갖춘 언어는 대부분 서로소 유니온 타입을 정의하는, 그리고 손쉽게 사용할 수 있게 하는 문법(패턴 매칭)을 언어 수준에서 제공한다.

핵심은 “둘 이상의 경우의 수를 갖는 타입을[상호배제와 전체포괄](https://ko.wikipedia.org/wiki/MECE)을 만족하는 가지들로 나누고, 각 가지의 타입을 정확히 정의한 뒤, 전체를 가지들의 합으로 나타내기”라 볼 수 있다. 이 원리를 이해한다면 (이 글에서 그러했듯) 언어 수준의 직접적인 지원이 없는 환경에서도 비슷한 접근을 얼마든 구현할 수 있다.

서로소 유니온 타입을 이용해 프로그래머의 의도를 명확히 타입으로 표현하고, 타입 시스템으로부터 더 많은 안정성을 보장받고, 사용의 편리함까지 얻을 수 있다. 앞으로 만나는 문제, 또는 지금 고민하는 문제를 한 번쯤 서로소 유니온 타입의 렌즈를 통해 바라보길 바란다. 

```ts
type Programmer =
  | { type: ‘lovesDisjointUnion }
  | { type: ‘willLoveDisjointUnion, from: Date };
```

뱀발: 글을 적기 시작할 무렵, 문득 ‘서로소 유니온 타입이 상속과 어떻게 다르지?’ 라는 궁금증이 들어 트위터에 올렸다. 친절하게 답변해주신 분들이 계셔서 어느정도 정리가 되었는데, 궁금한 분들은  [타래](https://twitter.com/heejongahn/status/1234444534471221248)를 보시길.

뱀발2: [한국어 위키피디아 항목](https://ko.wikipedia.org/wiki/%EB%B6%84%EB%A6%AC_%ED%95%A9%EC%A7%91%ED%95%A9)은 “Disjoint Union”을 “분리 합집합” 또는 "서로소 합집합"으로 지칭한다. 하지만 프로그래밍의 맥락에서는 “Union Type”의 번역어로 "합집합 타입" 보다는 "유니온 타입”이 훨씬 흔하게 쓰인다고 판단해, “서로소 합집합 타입" 대신 "서로소 유니온 타입" 이라는 번역어를 사용했다.

---

# 부록 1: 서로소 유니온 타입의 다른 이름
서로소 유니온 타입은 몇 가지 다른 이름도 갖고 있다. 체감상 다른 이름보다 압도적으로 많이 불리는 – 사실상 표준인 – 이름이 존재하진 않는 느낌이라, 다 알아두면 쓸모가 있을 것이라 생각한다. 관련해 이전에 적은 글의 일부를 부록으로 첨부. [출처](https://ahnheejong.gitbook.io/ts-for-jsdev/06-type-system-deepdive/disjoint-union-type)

> 이러한 타입은 ‘서로소 유니온 타입’ 이외에도 여러가지 다른 이름을 갖고 있다.
> 
> 먼저 위의 type 속성처럼, 특정 속성을 통해 값이 속하는 브랜치를 식별할 수 있다는 이유로 *식별 가능한 유니온*(discriminated union type)또는 *태그된 유니온*(tagged union)이라는 이름을 갖는다. 브랜치를 식별하기 위해 쓰이는 type 속성은 식별자(discriminator) 또는 태그(tag)라 불린다.
> 
> 서로소 유니온 타입의 또 다른 이름으로는 *합 타입*(sum type)이 있다. 다음 코드를 보자. `Bool` 타입은 2개의 값, `Num` 타입은 3개의 값을 갖는다.
> 
> ```ts
> type Bool = true | false;
> type Num = 1 | 2 | 3;
> ```
> 
> 이 때 아래와 같이 정의한 서로소 유니온 타입 SumType은 몇 개의 값을 가질까?
> 
> ```ts
> type SumType = { type: ‘bool’, value: Bool } | { type: ‘num’, value: Num }; 
> ```
> 
> 두 브랜치에 동시에 속하는 값이 없으므로 SumType은 2 + 3 = 5 개의 값을 갖는다. 합 타입이라는 이름은 이렇듯 각 브랜치가 갖는 값의 수를 합친 만큼의 값을 갖는 타입이라는 데에서 유래했다. 

개인적으로 가장 좋아하는 이름은 “합 타입”이다. 이유는 부르기 쉽고 직관적이어서!

# 부록 2: 읽을거리
* [서로소 유니온 타입(태그된 유니온)의 위키피디아 항목](https://en.wikipedia.org/wiki/Tagged_union)
*  [서로소 유니온 타입(합 타입)을 포함하는 대수 타입의 위키피디아 항목](https://en.wikipedia.org/wiki/Algebraic_data_type)
* [서로소 유니온 타입의 사용을 훨씬 편리하게 만들어 줄 pattern matching 프로포절](https://github.com/tc39/proposal-pattern-matching)# 서로소 유니온 타입을 사용한 안전한 데이터 모델링
특별한 언급이 없는 이상 이 글의 모든 예시 코드는 TypeScript 코드입니다.

---

# 동기부여
코드를 짜다보면 “여러 가지 중 하나의 경우”를 모델링할 일이 많이 생긴다.

예를 들어, 쇼핑몰 애플리케이션에서 사용자의 결제 수단을 모델링하는 경우를 생각해보자. 결제 수단은 신용카드일수도, 가상 계좌를 통한 계좌 이체일수도, [토스 결제](https://toss.im/pay/)등의 간편결제수단일 수도 있다.  [열거형]( https://ko.wikipedia.org/wiki/%EC%97%B4%EA%B1%B0%ED%98%95)은 이런 “여러 경우의 수 중 하나”인 데이터를 모델링하기 위해서 흔히 사용되는 수단이다. (이 경우의 수를 이하 가지/branch/라 부르자) TypeScript 역시 [열거형을 지원한다](https://ahnheejong.gitbook.io/ts-for-jsdev/03-basic-grammar/enums).

```ts
enum PaymentMethodType {
  CreditCard,
  BankTransfer,
  Toss,
}
```

*하지만 실제 데이터의 모델링이 이 정도에서 끝나는 일은 흔치 않다*. 위 예시를 이어가보자. 신용카드의 경우는 카드 번호, 카드사 등의 정보를, 계좌 이체의 경우 해당 사용자에게 할당된 가상계좌 정보를 추가로 가질 것이다. 이 때, 이 추가적인 정보는 어떤 가지에 해당하는 데이터인지에 따라 필요할 수도, 그렇지 않을 수도 있다.

이런 데이터를 어떻게 모델링하면 좋을까?

# 첫 번째 시도: 선택 속성
가장 쉽게 생각할 수 있는 방법은 경우에 따라 존재할 수도, 그러지 않을 수도 있는 모든 필드를 선택 속성(optional property)로 정의하는 것이다.

```ts
enum PaymentMethodType {
  CreditCard,
  BankTransfer,
  Toss,
}

interface PaymentMethod {
  type: PaymentMethodType;
  creditCardInformation?: {
    providerCode: number;
    cardNumber: string;
  };
  bankAccountInformation?: Array<{
    bankCode: number;
    bankAccount: string;
  }>;
  tossUserIdentifier?: string;
}
```

새로 정의된 `PaymentMethod` 타입은 아래와 같이 신용카드, 계좌 이체 등의 결제 정보를 담을 수 있다.

```ts
const creditCardPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
};

const bankAccountPaymentMethod: PaymentMethod = {
  type: PaymentMethodType. BankTransfer,
  bankAccountInformation: [
    {
      bankCode: 42,
      bankAccount: ‘1234123412341234’,
    },
  ],
};
```

원하는 값을 표현할 수 있게 되었다! 이걸로 충분할까? 사실 이 타입은 몇 가지 문제를 안고 있다. 예를 들어, 지금의  `PaymentMethod` 타입은 아래와 같은 값도 허용한다. 

```ts
const weirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
  bankAccountInformation: [
    {
      providerCode: 42,
      cardNumber: ‘1234123412341234’,
    },
  ],
};

const anotherWeirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
};
```

하지만 신용카드 결제 수단 데이터가 가진 `bankAccountInformation` 필드의 의미는 무엇일까? 또한 신용카드 정보가 없는 신용카드 결제 수단 데이터는 과연 올바른 값일까? *현재의 `PaymentMethod` 타입은 [불가능한 상태를 불가능하게 만들지 않는다](https://kentcdodds.com/blog/make-impossible-states-impossible)*.

그 뿐만이 아니다. 어떤 함수가 `PaymentMethod` 타입의 값을 받되, 해당 값이 신용카드 결제수단 데이터일 때에만 신용카드 정보를 쓰고픈 경우를 생각해보자. 매번 이 값이 신용카드 결제수단 데이터인지(`paymentMethod.type === PaymentMethodType.CreditCard`), 그리고 신용카드 정보가 실제로 존재하는지  (`paymentMethod.creditCardInformation != null` ) 두 번씩 검사해야하는 불편함이 발생한다.

```ts
function getCreditCardInformation(paymentMethod: PaymentMethod): CreditCardInformation | null {
  if (paymentMethod.type !== PaymentMethod.CreditCard) {
    return null;
  }

  // `type`을 체크했지만 여전히 paymentMethod.creditCardInformation 필드가 존재함이 보장되지 않는다.
  if (paymentMethod.creditCardInformation == null) {
    return null;
  }

  return paymentMethod.creditCardInformation;
}
```

이런 문제가 생기는 근본적인 원인 역시 위에서 언급했듯 불가능한 상태를 불가능하게 만들지 않았기 때문이다. 그럼 해결책은 무엇일까? 불가능한 상태를 불가능하게 만드는 것이다!

# 개선안: 불가능한 상태를 불가능하게
한발짝 물러서서, 이 타입으로 표현하고 싶은 데이터의 형태를 생각해보자. 

우리는 `PaymentMethod` 타입의 다음 셋 중 한 가지에 해당하는 값을 담을 수 있기를 바란다.

* 카드 정보를 갖는 신용카드 결제수단
* 가상 계좌 정보를 갖는 계좌이체 결제수단
* 토스 서비스의 유저 식별자 정보를 갖는 토스 결제수단

또한, 우리는 `PaymentMethod` 타입이 다음과 같은 값을 담을 수 없기를 바란다.

* 카드 정보를 갖는 계좌이체 결제수단 (???)
* 가상 계좌 정보가 없는 계좌이체 결제수단 (???)

*이 정보를 그대로 타입으로 옮기는 것이 우리 목표다.* 다행히도, TypeScript의 [문자열 리터럴 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#string-literal-types)(또는 [숫자 리터럴 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#numeric-literal-types))과 [유니온 타입](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types)의 조합으로 이 목표를 달성하는 타입을 정의할 수 있다!

먼저 각 가지를 나타내는 타입을 정의해보자. 이 때, 해당 데이터가 어떤 가지에 속하는지를 나타내는 `type` 필드를 해당 `PaymentMethodType` 를 사용한 리터럴 타입으로 정의하자. 리터럴 타입을 사용해 *딱 하나의 값으로 고정되는 타입*을 정의할 수 있다. 예를 들어, 다음 코드에서 `CardPaymentMethod` 타입의 모든 값의 `type` 필드값은 항상 `PaymentMethodType.CreditCard`으로 고정된다.

```ts
// 신용카드 결제수단은
// 신용카드를 나타내는 값을 담은 type 필드와
// 카드 정보를 담은 creditCardInformation 필드를 갖는다.
type CardPaymentMethod = {
  type: PaymentMethodType.CreditCard;
  creditCardInformation: {
    providerCode: number;
    cardNumber: string;
  };
};

// 계좌이체 결제수단은
// 계좌이체를 나타내는 값을 담은 type 필드와
// 계좌 정보를 담은 bankAccountInformation 필드를 갖는다.
type BankPaymentMethod = {
  type: PaymentMethodType.BankTransfer;
  bankAccountInformation: Array<{
    bankCode: number;
    bankAccount: string;
  }>;
};

// 토스 결제수단은
// 토스를 나타내는 값을 담은 type 필드와
// 토스 사용자 아이디를 담은 tossUserIdentifier 필드를 갖는다.
type TossPaymentMethod = {
  type: PaymentMethodType.Toss;
  tossUserIdentifier: string;
};
```

각 가지의 정의가 끝났으니, 유니온 타입을 이용해 `PaymentMethod` 타입이 이 가지 중 하나에 해당함을 나타내보자. 유니온 타입을 사용해 *이 타입이거나 저 타입인* 타입을 정의할 수 있다.

```ts
// 결제수단은
// 신용카드 결제수단이거나
// 계좌이체 결제수단이거나
// 토스 결제수단이다.
type PaymentMethod =
	| CardPaymentMethod
  | BankPaymentMethod
  | TossPaymentMethod;
```

*이게 전부다*! 우리가 의도한 바를 그대로 코드로 옮긴, 새로운 `PaymentType` 이 완성되었다!

하지만 정말 이 타입이 아까 전보다 나아진 걸까? 이 정의가 우리의 첫 시도보다 나은지 확인해보자. 먼저, 이 타입은 첫 번째 시도에서처럼 *우리의 의도에 알맞는 올바른 값을 허용한다*.

```ts

// OK
const creditCardPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
};

// OK
const bankAccountPaymentMethod: PaymentMethod = {
  type: PaymentMethodType. BankTransfer,
  bankAccountInformation: [
    {
      bankCode: 42,
      bankAccount: '1234123412341234',
    },
  ],
};
```

하지만, 첫 번째 시도와는 달리, *이제 `PaymentMethod`에 올바르지 않은 값을 할당할 수 없다*. 만약 이상한 값을 할당하려 하면, TypeScript 컴파일러가 빨간펜을 들고 아래와 같이 경고해 줄 것이다.

```ts
// 해석: `type` 필드를 보니 `CardPaymentMethod` 가지일 수 밖에 없는데,
// `CardPaymentMethod` 가지에 존재하지 않는 `bankAccountInformation` 필드 값이 넘어왔다.
//
// TypeError(TS2322)
// Type ‘{ type: PaymentMethodType.CreditCard; creditCardInformation: { cardNumber: string; providerCode: number; }; bankAccountInformation: { providerCode: number; cardNumber: any; 1234123412341234: any; }[]; }’ is not assignable to type ‘PaymentMethod’.
//   Object literal may only specify known properties, and ‘bankAccountInformation’ does not exist in type ‘CardPaymentMethod’.(2322)
const weirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
  creditCardInformation: {
    cardNumber: ‘1234123412341234’,
    providerCode: 42,
  },
  bankAccountInformation: [
    {
      providerCode: 42,
      cardNumber: ‘1234123412341234’,
    },
  ],
};

// 해석: `type` 필드를 보니 `CardPaymentMethod` 가지일 수 밖에 없는데,
// `CardPaymentMethod` 가지에 필요한 `creditCardInformation` 필드가 없다.
//
// TypeError (TS2322)
// Type ‘{ type: PaymentMethodType.CreditCard; }’ is not assignable to type ‘PaymentMethod’.
//  Property ‘creditCardInformation’ is missing in type ‘{ type: PaymentMethodType.CreditCard; }’ but required in type ‘CardPaymentMethod’.
const anotherWeirdPaymentMethod: PaymentMethod = {
  type: PaymentMethodType.CreditCard,
};
```

또한, `type` 필드만 보면 어떤 가지인지 식별할 수 있고, 특정 가지임이 판별되었다면 필요한 데이터가 함께 존재함이 타입 수준에서 보장되므로 동일한 의미의 체크를 두 번 할 필요 또한 없어졌다.

```ts
function getCreditCardInformation(paymentMethod: PaymentMethod): CreditCardInformation | null {
  // 여기서 `paymentMethod.creditCardInformation` 필드에 접근하려
  // 시도하면 타입 에러가 발생한다.
  if (paymentMethod.type !== PaymentMethod.CreditCard) {
    return null;
  }

  // `type` 체크를 통과하면 paymentMethod.creditCardInformation 필드가 존재함이 보장된다.
  return paymentMethod.creditCardInformation;
}

function getFormattedDisplayName(paymentMethod: PaymentMethod) {
  // switch - case 문 또한 의도대로 동작한다.
  switch (paymentMethod.type) {
    case PaymentMethodType.CreditCard {
      return `신용카드 ${paymentMethod.creditCardInformation. cardNumber}`;
    }
    case PaymentMethodType.BankTransfer: {
      return `가상계좌 ${paymentMethod.bankAccountInformation.bankAccount}`;
    }
    case PaymentMethodType.Toss: {
      return `토스 ${paymentMethod.tossUserIdentifier}`;
    }
  }
}
```

이 쯤 되면 더 나아졌다고 부르기 큰 부족함이 없을 것 같다. 😁

# 서로소 유니온 타입
 안전한 `PaymentMethod` 타입을 정의하기 위해 거친 과정을 생각해보자.

1. 원하는 타입(`PaymentMethod`)을 서로 겹치지 않는 여러 가지로 나누었다.
2. 각 가지의 타입(`CardPaymentMethod`, `BankPaymentMethod`, …)을 정의했다. 이 때, 가지 별로 존재하는 데이터와 함께 각기 다른 리터럴 타입의 `type` 필드를 두어 `if`-`else`, 또는 `switch`-`case` 등에서의 구분에 사용했다.
3. 유니온 타입을 사용해 원하는 타입을 “이 경우 또는 저 경우 또는 요 경우 또는…”으로 (`PaymentMethod = CardPaymentMethod  | BankPaymentMethod `) 정의했다.

이렇게 *겹치지 않는 가지들 중 하나*로 정의된 타입을 *서로소 유니온 타입*(disjoint union type)이라 부른다. “서로소”는 교집합이 없는 집합 사이의 관계를 의미하는 “서로소 집합”에서와 같은 의미를 갖는다.

이런 식의 타입 정의는 매우 다양한 경우에 응용해볼 수 있다.

네트워크 요청을 통해 데이터를 받아오는 작업의 상태:

```ts
type FetchStatus<Data, Error> =
  | { type: ‘idle’ }
  | { type: ‘pending’ }
  | { type: ‘fulfilled’, data: Data }
  | { type: ‘rejected’, error: Error }
  | { type: ‘cancelled’ };
```

쇼핑몰의 쿠폰 데이터:

```ts
type CommonCouponData = {
  name: string;
  description?: string;
  expireDate?: Date;
  /* ... */
}

type FixedAmountDiscountCoupon = CommonCouponData & {
  type: ‘fixedAmountDiscount’;
  discountAmount: Currency;
};

type RateDiscountCoupont = CommonCouponData & {
  type: ‘rateDiscount’;
  discountRate: number;
};

type: FreeDeliveryCoupon = CommonCouponData & {
  type: ‘freeDelivery’;
};

type Coupon =
  | FixedAmountDiscountCoupon
  | RateDiscountCoupont
  | FreeDeliveryCoupon;
```

등등. 가능성은 무한하다!

# 맺으며
서로소 유니온 타입이 어떤 문제를 해결하는지, 어떻게 정의하고 사용할 수 있는지 다루어 보았다.

이 글에서는 리터럴 타입과 유니온 타입을 사용했지만, 이는 TypeScript의 언어적 제약일 뿐, 언어에 따라 서로소 유니온 타입을 구현하는 방법은 다양하다. [Haskell](https://www.haskell.org/) 이나 [Rust](https://www.rust-lang.org/) 등 보다 강력한 타입 시스템을 갖춘 언어는 대부분 서로소 유니온 타입을 정의하는, 그리고 손쉽게 사용할 수 있게 하는 문법(패턴 매칭)을 언어 수준에서 제공한다.

핵심은 “둘 이상의 경우의 수를 갖는 타입을[상호배제와 전체포괄](https://ko.wikipedia.org/wiki/MECE)을 만족하는 가지들로 나누고, 각 가지의 타입을 정확히 정의한 뒤, 전체를 가지들의 합으로 나타내기”라 볼 수 있다. 이 원리를 이해한다면 (이 글에서 그러했듯) 언어 수준의 직접적인 지원이 없는 환경에서도 비슷한 접근을 얼마든 구현할 수 있다.

서로소 유니온 타입을 이용해 프로그래머의 의도를 명확히 타입으로 표현하고, 타입 시스템으로부터 더 많은 안정성을 보장받고, 사용의 편리함까지 얻을 수 있다. 앞으로 만나는 문제, 또는 지금 고민하는 문제를 한 번쯤 서로소 유니온 타입의 렌즈를 통해 바라보길 바란다. 

```ts
type Programmer =
  | { type: ‘lovesDisjointUnion }
  | { type: ‘willLoveDisjointUnion, from: Date };
```

뱀발: 글을 적기 시작할 무렵, 문득 ‘서로소 유니온 타입이 상속과 어떻게 다르지?’ 라는 궁금증이 들어 트위터에 올렸다. 친절하게 답변해주신 분들이 계셔서 어느정도 정리가 되었는데, 궁금한 분들은  [타래](https://twitter.com/heejongahn/status/1234444534471221248)를 보시길.

뱀발2: [한국어 위키피디아 항목](https://ko.wikipedia.org/wiki/%EB%B6%84%EB%A6%AC_%ED%95%A9%EC%A7%91%ED%95%A9)은 “Disjoint Union”을 “분리 합집합” 또는 "서로소 합집합"으로 지칭한다. 하지만 프로그래밍의 맥락에서는 “Union Type”의 번역어로 "합집합 타입" 보다는 "유니온 타입”이 훨씬 흔하게 쓰인다고 판단해, “서로소 합집합 타입" 대신 "서로소 유니온 타입" 이라는 번역어를 사용했다.

---

# 부록 1: 서로소 유니온 타입의 다른 이름
서로소 유니온 타입은 몇 가지 다른 이름도 갖고 있다. 체감상 다른 이름보다 압도적으로 많이 불리는 – 사실상 표준인 – 이름이 존재하진 않는 느낌이라, 다 알아두면 쓸모가 있을 것이라 생각한다. 관련해 이전에 적은 글의 일부를 부록으로 첨부. [출처](https://ahnheejong.gitbook.io/ts-for-jsdev/06-type-system-deepdive/disjoint-union-type)

> 이러한 타입은 ‘서로소 유니온 타입’ 이외에도 여러가지 다른 이름을 갖고 있다.
> 
> 먼저 위의 type 속성처럼, 특정 속성을 통해 값이 속하는 브랜치를 식별할 수 있다는 이유로 *식별 가능한 유니온*(discriminated union type)또는 *태그된 유니온*(tagged union)이라는 이름을 갖는다. 브랜치를 식별하기 위해 쓰이는 type 속성은 식별자(discriminator) 또는 태그(tag)라 불린다.
> 
> 서로소 유니온 타입의 또 다른 이름으로는 *합 타입*(sum type)이 있다. 다음 코드를 보자. `Bool` 타입은 2개의 값, `Num` 타입은 3개의 값을 갖는다.
> 
> ```ts
> type Bool = true | false;
> type Num = 1 | 2 | 3;
> ```
> 
> 이 때 아래와 같이 정의한 서로소 유니온 타입 SumType은 몇 개의 값을 가질까?
> 
> ```ts
> type SumType = { type: ‘bool’, value: Bool } | { type: ‘num’, value: Num }; 
> ```
> 
> 두 브랜치에 동시에 속하는 값이 없으므로 SumType은 2 + 3 = 5 개의 값을 갖는다. 합 타입이라는 이름은 이렇듯 각 브랜치가 갖는 값의 수를 합친 만큼의 값을 갖는 타입이라는 데에서 유래했다. 

개인적으로 가장 좋아하는 이름은 “합 타입”이다. 이유는 부르기 쉽고 직관적이어서!

# 부록 2: 읽을거리
* [서로소 유니온 타입(태그된 유니온)의 위키피디아 항목](https://en.wikipedia.org/wiki/Tagged_union)
*  [서로소 유니온 타입(합 타입)을 포함하는 대수 타입의 위키피디아 항목](https://en.wikipedia.org/wiki/Algebraic_data_type)
* [서로소 유니온 타입의 사용을 훨씬 편리하게 만들어 줄 pattern matching 프로포절](https://github.com/tc39/proposal-pattern-matching)
