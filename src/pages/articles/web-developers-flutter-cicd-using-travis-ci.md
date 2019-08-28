---
templateKey: blog-post
title: 웹 개발자의 Travis CI 기반 Flutter 앱 지속적 빌드 및 배포 환경 구축기
date: 2019-08-28T08:20:31.303Z
description: >-
  Flutter로 앱 생태계에 처음 발을 담근 웹 개발자가 Travis CI를 이용한 iOS, Android 두 플랫폼의 빌드 및 배포
  자동화를 위해 고군분투한 기록.
tags:
  - Flutter
  - Dart
  - 모바일
  - 프론트엔드
  - CI/CD
  - Travis CI
  - DevOps
---
# 들어가며

얼마 전, 구글의 크로스 플랫폼 UI 프레임워크 [Flutter](https://flutter.dev/)를 사용해 [인생 첫 앱을 만들어 배포했다.](https://ahnheejong.name/articles/galpi-development-diary/)  앱 개발에 대한 지식은 전무하다시피 했지만, Flutter 덕에 생각보다 짧은 시간 안에 만족할 만한 앱을 iOS, Android 두 플랫폼에 배포할 수 있었다. 처음 써보는 언어와 프레임워크지만 선언적 렌더링 기반인 덕에 적응하기도 쉬웠다. 문서도 잘 되어 있고 전반적인 개발 경험도 훌륭했다.

문제는 배포였다. 웹 개발만 해오다가 앱 개발의 빌드–업로드–심사–배포 프로세스를 경험해보니 타르가 무릎 높이까지 차오른 오르막길에서 무거운 돌덩이를 굴려 올리는 기분이 들었다. 게다가 이걸 두 플랫폼에 대해서 반복해야 한다니!

릴리즈가 필요할 때마다 CLI로 각 타겟을 빌드하고, 빌드 완료를 기다렸다가 App Store Connect와 Play Console에 들어가서 바이너리를 올린다. 생각만으로 우울해졌다. 코드를 짜는 것이 문제가 아니라, 이 짓을 하다 지쳐서 개발을 포기할 날이 금세 오리라는 확신이 들었다.

그래서 자동화했다.

![모든 자동화가 완료된 시점의 스크린샷](/assets/flutter_cicd_endgame.png)

위 스크린샷은 GitHub 푸시에 의해 CI 머신에서 Android, iOS 빌드가 각각 트리거되어 TestFlight / Google Play 내부 테스트 트랙까지 올라가는 설정을 처음으로 성공했을 때 (마음 속으로) 감격의 눈물을 흘리며 찍은 화면이다.

이 설정에 이르기까지, 원래 각오했던 것보다 훨씬 많은 고생과 삽질을 겪었다. 앱 개발 자체보다 훨씬 어렵다 느낄 정도로, 너무 고통스러웠다. 앱 개발 생태계에 처음 발을 들인 웹 개발자의 입장에서, 나중에 비슷한 고생을 할 사람을 위해 이 경험, 그리고 그 과정에서 배운 지식을 기록으로 남겨기로 결심했다.

어떤 파일을 어떻게 바꾸라는 기계적인 전달 사항보다는 이 생태계가 어떤 요소들로 이루어지고, 각 작업이 어떤 의미가 있는지 설명하려 노력했다. 그러다보니 생각보다 글이 길어졌다. 앱 개발 생태계에 발을 들였다면 언젠가는 정면돌파 해야 할 내용이라, 긴 분량을 감수할 가치가 있다고 생각한다. 그 생각대로 도움이 되는 내용이면 좋겠다.

글에서 다룬 모든 설정이 끝난 상태의 코드는 [해당 시점의 갈피 GitHub 저장소](https://github.com/heejongahn/galpi/tree/84e9f3d260667d207c3bf868c669768e10bfeefc)에서 확인할 수 있다.

## 본론에 들어가기 앞서

이 글은 아래 환경을 기준으로 쓰였습니다.  ( `flutter doctor -v` 커맨드 출력의 일부) 기준이 된 버전과 다른 환경에서는 글에 적힌 내용과 다르게 동작하는 부분이 있을 수 있습니다.

```
[✓] Flutter (Channel dev, v1.9.2-pre.34, on Mac OS X 10.14.4 18E226, locale en-US)
    * Flutter version 1.9.2-pre.34 at /Users/travis/build/heejongahn/galpi/flutter
    * Framework revision e833a5820e (12 hours ago), 2019-08-20 11:00:21 -0700
    * Engine revision 10167db433
    * Dart version 2.5.0
```

또한, **이 글은 독자가 웹 인터페이스를 이용해 Play Store 내부 테스트 트랙 / TestFlight 에 각각 빌드를 최소 한 번 이상 올려봤다고 가정합니다.** 아직 수동 빌드 및 배포를 경험해 본 적이 없다면 이 글을 읽기 전에 먼저 공식 문서(  [Android](https://flutter.dev/docs/deployment/android) ,  [iOS](https://flutter.dev/docs/deployment/ios))를 참고해 해당 과정을 밟아보세요. 

이 글에서 사용한 자동화 도구 fastlane은 [공식적으로 macOS만을 지원합니다](https://docs.fastlane.tools/#system-requirements). Linux와 Windows 환경에서도 (제한된 버전의) CLI는 사용가능하다고 쓰여 있지만, 제가 개발 환경으로 맥북을 사용하고 있어서 다른 환경에서는 테스트 해 보지 못했습니다.

처음부터 글 작성을 염두에 두고 작업을 한게 아닌 탓에, 사후에 커밋 로그와 빌드 히스토리로부터 기억을 되살려가며 글을 적었습니다. 때문에 빠져있거나 잘못된 부분이 있을 수 있습니다. 막히는 부분이나 틀린 내용을 발견하신다면 댓글이나 메일로 남겨주세요. 제가 겪어본 상황이라면 답변을 드리고 글 또한 적절하게 수정하겠습니다.

- - -

# 👨‍💻 공통: Travis CI 기본 셋업

가장 먼저, 빌드가 돌아가야 할 시점, 이 글의 경우 GitHub 저장소로의 코드 푸시를 감지하는 것부터 시작해보자. [Travis CI의 GitHub Marketplace 페이지](https://github.com/marketplace/travis-ci)에서 리포지토리에 Travis CI를 붙일 수 있다. 오픈 소스 프로젝트의 경우 무료 플랜을 사용 가능하다.

![GitHub Travis CI 어플리케이션 추가 화면 스크린샷](/assets/flutter_cicd_travis.png)

Open Source 플랜을 선택하고 `Install it for free` 버튼을 눌러 원하는 저장소에 Travis CI 어플리케이션을 설치할 수 있다. 설치된 어플리케이션은 GitHub 저장소의 메뉴바 “Settings” 를 클릭한 뒤 좌측 “Integrations & services” 에서 확인할 수 있다.

어플리케이션이 잘 설치되었다면 Travis 설정 파일을 추가할 차례다. 프로젝트 루트에 `.travis.yml` 파일을 추가해 Travis CI가 어떤 일을 실행해야 할지 알려줄 수 있다. 일단 GitHub 푸시에 Travis 빌드가 트리거되는 것을 확인하기 위해 의존성을 내려받기만 하는 스크립트를 추가해보자.

```yaml
# .travis.yml #1: 의존성 설치를 수행한다.

language: generic

before_script:
  - git clone https://github.com/flutter/flutter.git -b stable
  - export PATH=`pwd`/flutter/bin:`pwd`/flutter/bin/cache/dart-sdk/bin:$PATH

script:
  - flutter packages get
```

이 때, 만약 `stable` 이외의 [빌드 릴리즈 채널](https://github.com/flutter/flutter/wiki/Flutter-build-release-channels)을 사용하고 싶다면 `git clone` 커맨드에서 브랜치를 적절히 설정하면 된다. 예를 들어, 나는 `beta` 채널을 사용하고 있으므로 `-b stable` 대신 `-b beta` 옵션을 사용했다.

## 선택 사항: 써드 파티 API Key

만약 구글, 네이버, 카카오 등의 써드 파티 API를 사용하는 경우, 시크릿 API 키를 CI 머신에서 참조할 수단이 필요하다. 보통 이런 용도로는 VCS에 체크인하지 않는 로컬 파일, 또는 환경 변수를 사용한다. 현재 Flutter는 빌드 시 컴파일 타임 인자를 넘길 수단을 제공하지 않으므로(참고: [flutter/flutter issue #26638](https://github.com/flutter/flutter/issues/26638) ) 이 정보는 앱 프로젝트 내의 파일로 넘겨줘야 한다.

로컬에서는 VCS에 체크인하지 않는 시크릿 키를 담은 파일을 만들면 간단하게 해결되는 문제다. 하지만 매번 새로운 환경에서 빌드가 일어나는 CI 머신에서는 이런 방식을 적용하기 어렵다. 해결할 방법은 여럿 있겠지만, 나는 다음과 같은 방식을 선택했다.

1. [Travis CI 저장소 설정에서 암호화된 환경 변수를 설정한다](https://docs.travis-ci.com/user/environment-variables/) .
2. 스크립트에서 해당 환경 변수의 내용을 파일에 저장한다.
3. Flutter 소스코드에서 해당 파일을 참조한다.

구체적으로 갈피의 예를 들면, 책 검색에 사용하는 카카오 REST API 키를 불러오기 위해 Travis CI 의 `KAKAO_REST_API_KEY` 환경 변수에 해당 시크릿 키를 추가한 뒤, 아래와 같은 bash 스크립트를 저장소에 추가했다.

```bash
# scripts/populate_secret.sh

touch secrets/keys.json
echo "{ \"KAKAO_REST_API_KEY\": \"$KAKAO_REST_API_KEY\" }" > secrets/keys.json
```

Travis CI 스크립트에서 빌드 전에 `bash scripts/populate_secret.sh` 커맨드를 실행하면 Dart 코드가 시크릿 키를 읽어올 `secrets/keys.json` 파일이 만들어진다.

```yaml
# .travis.yml #2: 환경 변수로부터 써드 파티 API 시크릿 토큰을 준비한다.

language: generic

before_script:
  - git clone https://github.com/flutter/flutter.git -b stable
  - export PATH=`pwd`/flutter/bin:`pwd`/flutter/bin/cache/dart-sdk/bin:$PATH

script:
  - bash scripts/populate_secret.sh
  - flutter packages get
```

> NOTE: 글을 적다보니 `keys.json` 파일도 아래 Android 빌드에서 다루듯이 Travis CI CLI의 `travis encrypt-file`로 처리할 수 있다는 것을 깨달았다. (보시다시피 블로깅은 도움이 된다! 우리 모두 블로깅을 합시다!) 하지만 당장 진행한다고 임팩트가 있는 작업은 아니라 일단은 그대로 내버려둔다.

# 👨‍💻 공통: Fastlane 설정

Travis CI를 설정해, 코드가 푸시될 때마다 저장소의 의존성을 내려받을 수 있게 되었다!

하지만 안타깝게도 이런 스크립트는 CI 머신의 탄소 발자국을 늘려 지구 온난화를 가속화할 뿐, 아무런 실질적인 도움을 제공하지 않는다. 우리의 최종 목표는 **GitHub에서 코드가 푸시되면 자동으로 Android, iOS 두 플랫폼 대상의 빌드가 각각 만들어지는 것**이다.

이 목표를 달성하기 위해  [fastlane](https://fastlane.tools/)을 사용할 것이다. fastlane은 앱 자동화를 위한 오픈소스 툴체인으로, Android 및 iOS 앱 빌드, 릴리즈, 자동 스크립샷 등을 비롯한 다양한 작업의 자동화를 도와준다. 게다가 별도의 과금 없이 사용할 수 있다. 와우!

fastlane은 Ruby로 작성된 프로그램이다. `gem install fastlane`[(RubyGems)](https://rubygems.org) 또는 `brew cask install fastlane`([HomeBrew](http://brew.sh))로 설치할 수 있다. 

fastlane을 설치한 후 Flutter 프로젝트의 `android`, `ios` 폴더에 각각 들어가 `fastlane init` 커맨드를 실행하면 대화형 CLI의 도움을 받아 기본적인 fastlane 프로젝트를 설정할 수 있다.

참고로 나는 iOS 설정 시의 `What would you like to use fastlane for?` 질문에는 `2. 👩‍✈️  Automate beta distribution to TestFlight` 를 선택했다. Android 설정에서는 json secret key file 경로는 일단 스킵 (아무것도 작성하지 않고 엔터), 메타데이터는 yes 로 응답했다. 이 글은 해당 선택지들을 기준으로 작성했다.

더 나아가기 전에, `fastlane init`을 이용해 생성된 파일이 각각 어떤 역할을 하는지 간단히 알아보자.

## Fastfile

`Fastfile`은 `fastlane` 키워드를 사용해 실행할 모든 자동화 작업 설정을 저장하는 파일이다. 이 파일이 포함하는 여러 내용 중 우리가 지금 알아야 할 개념은 두 가지, lane과 action 이다.

### lane

lane([공식 문서](https://docs.fastlane.tools/advanced/lanes/))은 `fastlane [lane_name]` 커맨드를 이용해 CLI에서, 또는 다른 lane에서, 실행할 수 있는 Ruby 스크립트다. 예를 들어, 베타 릴리즈를 위한 `beta` lane을 정의한 뒤 `fastlane beta`  커맨드로 실행할 수 있다.

### action

lane은 0개 이상의 (보통은 1개 이상의) action([공식 문서](https://docs.fastlane.tools/actions/))을 호출한다. action은 말 그대로 앱 자동화에 필요한 여러 **행동**을 정의한 Ruby 함수다. 대표적인 예로는 다음과 같은 동작이 있다.

* 빌드 관련: `build_ios_app`, `gradle`
* 배포 관련: `upload_to_testflight`, `upload_to_play_store`, `upload_to_app_store`

fastlane은 이 외에도 다양한 사전 정의된 action을 제공한다. fastlane이 제공하는 전체 action 목록은 공식 문서에서 확인할 수 있다.

action은 Ruby로 작성된 평범한 함수이므로, 필요하다면 얼마든지 자신만의 action을 정의할 수 있다. 이 글의 범위 내에서는 그럴 일은 없지만, 나중에 필요한 경우가 생긴다면 [공식 문서](https://docs.fastlane.tools/create-action/)를 참고.

## Appfile

`Appfile`([공식 문서](https://docs.fastlane.tools/advanced/Appfile/))은 앱에 관련된 정보 (거꾸로 된 도메인 형태의 앱 식별자, App Store ID, Play Console 서비스 계정 등)을 포함한다. `Appfile`에 적힌 정보는 fastlane의 모든 커맨드가 바라볼 수 있다. 당연하지만 iOS와 Android 프로젝트의 `Appfile`에는 각자의 플랫폼에 알맞은, 다른 내용이 들어있다.

## Gemfile

`Gemfile`([공식 문서](https://bundler.io/v2.0/man/gemfile.5.html))은 node의 `package.json`와 비슷하게 Ruby 프로그램의 의존성을 기술하는 파일이다. `fastlane` 은 여러 환경에서 동일한 결과를 보장하기 위해 [Bundler](https://bundler.io)를 사용한 설치 및 실행을 권장한다.

- - -

# 🍎 iOS: TestFlight 배포

fastlane 설정을 마쳤다면 본격적으로 fastlane을 이용한 배포 설정을 시작하자. 먼저 iOS다.

## 🍎 fastlane을 사용한 로컬 배포

Flutter 공식 문서는 클라우드 기반의 배포를 테스트하기 전에 로컬에서 `fastlane`을 통한 빌드 업로드가 동작하는지 테스트해볼 것을 권장하고 있다. `fastlane init`을 마친 시점에서 `ios/fastlane/Appfile` 파일은 아래와 같이 생겼을 것이다.

```ruby
# ios/fastlane/Appfile

default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
    upload_to_testflight
  end
end
```

사실 TestFlight 배포에 필요한 액션은 이걸로 충분하다.  [앱을 빌드](https://docs.fastlane.tools/actions/build_ios_app/) 하고, [TestFlight에 업로드](https://docs.fastlane.tools/actions/upload_to_testflight/)하는 것.

이미 TestFlight에 수동으로 업로드 한 적이 있다는 전제 하에, `flutter build ios` 커맨드를 실행한 뒤  `ios` 폴더에서 `bundle exec fastlane beta` 커맨드를 실행하면 (CLI 프롬프트를 통한 Apple 계정 비밀번호 입력 이후) TestFlight에 빌드가 업로드된다.

![로컬에서 fastlane을 사용한 iOS 배포에 성공한 경우의 스크린샷](/assets/flutter_cicd_local_fastlane_ios.png)

위처럼 들뜨는 메시지를 만났다면 성공이다. TestFlight에 들어가보면 실제로 업로드 된 번들을 확인할 수 있을 것이다. 총 걸린 시간이 7분 가량이라 7분을 아껴줬다고 이야기하는 것 같은데 말이 되는 계산인지는 모르겠다.

## 🍎 CI 머신에서의 코드 사이닝을 위한 fastlane match 세팅

로컬에서 fastlane을 사용해 iOS 번들을 빌드하고 TestFlight에 올리는 데에 성공했다! 이제 같은 일을 로컬이 아닌 CI 머신에서 수행할 수 있도록 설정할 차례다.

[Flutter의 공식 iOS 배포 가이드](https://flutter.dev/docs/deployment/ios) 를 따라왔다면 아마 이 시점에서 코드 사이닝을 위한 인증서는 Xcode가 자동으로 관리하는 상태일 것이다. (아래 그림과 같이 Xcode `Runner` 타겟의 “General > Signing > Automatically manage signing” 체크박스가 체크되어 있는 상태)

![빌드 설정의 Automatically manage signing 옵션이 켜져있는 Xcode 화면](/assets/flutter_cicd_xcode_autosign_on.png)

iOS 앱을 TestFlight와 App Store에 배포하기 위해서는 배포 인증서(distribution certificate)를 사용한 코드 사이닝이 필요한다. 위 설정이 켜져있는 경우, 이 동작은 Xcode가 알아서 처리해준다. (iOS 코드 사이닝의 큰 그림에 대해선 [이 미디엄 글](https://medium.com/ios-os-x-development/ios-code-signing-provisioning-in-a-nutshell-d5b247760bef)이 잘 설명하고 있다)

이러한 설정은 로컬에서 개발 및 배포를 수행하기엔 충분했다. 하지만 CI 빌드가 일어날 때마다 로컬 머신에서 했던 것처럼 매번 CI 머신의 키체인 접근에 들어가 인증서를 직접 생성/설정할 수는 없는 노릇이다. CI 머신 상에서는 코드 사이닝을 어떻게 처리할 수 있을까?

### fastlane match 소개

fastlane이 제공하는 [match](https://docs.fastlane.tools/actions/match/) 액션은 원격 저장소를 사용해 코드 사이닝에 관련된 여러 문제를 풀어준다. 주제가 주제인만큼 다소 복잡하게 느껴질 수 있지만, 기본적인 개념은 다음과 같이 간단하다.

1. 로컬에 저장된 인증서를 사용하는 대신, 인증서를 사용자가 입력한 패스프레이즈로 암호화한 뒤 원격 Git (또는 Google Cloud Storage) 저장소에 저장한다.
2. 해당 저장소에 접근 권한이 있는 사용자는 임의의 기기에서 암호화된 인증서를 내려받는다.
3. 1번에서 암호화에 사용한 패스프레이즈를 알고 있는 사용자는 2번에서 내려받은 인증서를 복호화해 코드 사이닝에 사용한다.

이 글에서는 원격 저장소로 GitHub에서 호스팅되는 Git 저장소를 사용할 것이다.

### match 인증서 저장소 설정

match를 사용하기 위해 가장 먼저 GitHub에 프라이빗 저장소를 하나 만들어야 한다. 예를 들어 이 글에서는 `myaccount` 라는 계정으로 `my-app-cert` 라는 저장소를 만들었다고 하자.

저장소를 만들었다면 `ios` 폴더 내에서 `bundle exec fastlane match init` 키워드를 실행한다. 저장소 URL을 묻는 프롬프트에는 위에서 생성한 저장소의 URL(`https://github.com/myaccount/my-app-cert`)을 넘겨준다.

> **선택사항**: 다음으로 넘어가기 전, `bundle exec fastlane match nuke` 커맨드를 이용해 지금까지 사용해온 인증서를 날리고 모든 인증서를 fastlane이 관리하도록 설정할 수 있다.
>
> 나는 협업자가 없어 부담도 적고, 기왕이면 깔끔하게 시작하고 싶어서 `match nuke`를 실행했다. 어느 쪽이 좋은 선택일지는 [공식 문서](https://docs.fastlane.tools/actions/match/#nuke)를 참고해서 스스로 결정하면 된다. 참고로 기존 인증서를 날려도 이미 배포된 앱을 내려받지 못하는 사태는 생기지 않는다.

`match init` 은 실행시 `ios/fastlane/Matchfile`를 생성한다. 이 파일은 (당연하게도) `match` 커맨드가 필요로 하는 정보 – 인증서 저장소의 URL, 인증서 타겟, 깃 브랜치 등 – 를 저장한다.

`Matchfile`이 생성된 것을 확인했으면 App Store 및 TestFlight 배포를 위해 `appstore` 타겟 인증서를 생성해보자. 최초로 `bundle exec fastlane match appstore`  커맨드를 실행하면 인증서가 생성된 뒤 `match init`에서 제공한 저장소에 암호화되어 업로드된다. **이 때 입력하는 패스프레이즈는 나중에 필요하니 반드시 안전한 장소에 보관해야 한다**.

암호회된 인증서를 업로드했으면, Travis CI 빌드 머신이 해당 인증서를 복호화할 수 있도록 `MATCH_PASSWORD`  환경 변수에 앞서 설정한 패스프레이즈 값을 설정해준다.

> **NOTE: 최초 `fastlane match` 실행시 입력한 패스프레이즈는 절대 외부에 평문으로 노출되어선 안 된다!**

### Xcode 설정 변경

모든 과정이 정상적으로 끝났다면 `Matchfile`은 아래와 비슷한 모양을 하고 있을 것이다.

```ruby
# ios/fastlane/Matchfile

git_url("https://github.com/myaccount/my-app-cert")

storage_mode("git")

type("appstore")

app_identifier("거꾸로 된 도메인 형태의 앱 식별자")
username("Apple ID 이메일") 
```

`ios` 폴더에서 `bundle exec fastlane match appstore` 커맨드를 실행하면 

1. 저장소로부터 인증서를 받아온 뒤
2. 패스프레이즈를 이용해 복호화한 후
3. 프로비저닝 프로파일을 설치하는

것을 확인할 수 있다. 만약 `MATCH_PASSWORD` 환경 변수가 설정되어있지 않다면 2번 과정에서 패스프레이즈를 입력하라는 프롬프트를 만날 것이다.

다음으로, Xcode가 직접 관리하는 인증서 대신 match가 설치한 인증서를 바라보도록 설정해줘야 한다. Xcode를 켜서 `Runner` 타겟의 “General > Signing > Automatically manage signing” 체크박스를 해제한다. 그 뒤, 각 환경의 “Signing Provisioning Profile” 에서 match 가 설치한 적절한 프로파일을 설정해준다.

![빌드 설정의 Automatically manage signing 옵션이 꺼져있는 Xcode 화면](/assets/flutter_cicd_xcode_autosign_off.png)

> 위 스크린샷에서 사실 Debug용 프로파일은 별도로 존재해야 맞다. 글 작성 시점에서 아직까지 TestFlight 출시 없이 직접 기기에 설치할 일이 없어 따로 설정을 해두지 않았다. 시뮬레이터에서 개발하기에는 위 설정으로 충분하지만, 개발 프로파일 설치가 필요하다면 `bundle exec fastlane match development`를 실행한 뒤 “Signing (Debug)” 의 프로파일을 알맞게 변경해주면 될 것이다.

match 설정이 완료되었으니 마지막으로  `beta` lane에서 앱 빌드 이전에 match를 실행하도록 `Fastfile`을 아래와 같이 수정하자.

```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
 desc "Push a new release build to the TestFlight"
  lane :beta do
    match(
      type: "appstore",
      readonly: is_ci, 
      verbose: true
    )

    build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
    upload_to_testflight
  end
```

### 인증서 저장소 클론을 위한 GitHub 토큰 세팅

match를 사용해서 생성한 인증서에 Travis CI가 접근하기 위해선 해당 private GitHub 저장소에 접근할 수 있어야 한다. Travis 문서에서 추천하는 [User Key](https://docs.travis-ci.com/user/private-dependencies/#user-key) 방식은 travis-ci.com의 private 저장소에만 사용 가능하다. 갈피는 공개되어 있는 오픈 소스 프로젝트이므로, 대신 [API Token](https://docs.travis-ci.com/user/private-dependencies/#api-token)을 사용한 인증을 사용했다. 

먼저 CI 머신에서 사용할 GitHub 토큰을 발급한다. “Setting > Developer Settings > Personal access tokens” 페이지의 “Generate new token” 버튼을 눌러 `repo`  권한을 갖는 토큰을 생성할 수 있다. 토큰은 최초 생성 시를 제외하고는 다시 읽을 수 없으니 생성 직후 안전한 장소에 보관한다.

> **NOTE: 이 때 생성한 GitHub 토큰은 절대 외부에 평문으로 노출되어선 안 된다!**

![GitHub 토큰을 생성하는 페이지 스크린샷](/assets/flutter_cicd_github_token.png)

토큰 값을 얻어왔으면 Travis CI 저장소 설정에 `GITHUB_TOKEN` 환경 변수를 추가하고, `.travis.yml`의 `before_script`에 아래 스크립트를 추가한다. 

```bash
echo -e "machine github.com\n  login $GITHUB_TOKEN" >> ~/.netrc
```

이제 Travis CI는 GitHub API Token을 사용해 인증서가 보관된 저장소에 접근할 수 있다. 

## 🍎 빌드 파일 업로드를 위한 App Specific Password 설정

지금쯤 지칠대로 지친 채로 “대체 언제 끝나냐…” 라고 생각하고 있을 독자들의 모습이 눈에 훤하다. 하지만 아직 한 발 남았다.

Apple은 2019년 2월부터 [Account Holder 역할의 애플 개발자 계정 로그인 시 2FA(2-factor authentication) 설정을 필수화했다](https://developer.apple.com/news/?id=02202019a). 새로운 기기에서 애플 로그인을 하려고 하면 다른 애플 기기에서 확인한 6자리 숫자를 입력하라고 반겨주는 귀찮은 프롬프트가 바로 2FA 프롬프트다.

Apple Developer Program에 등록된 계정이 하나뿐인 경우 계정이 자동적으로 Account Holder 역할을 갖게 된다. 때문에 CI에서 빌드 업로드를 시도해보면 2FA를 위한 `Please enter the 6 digit code:`  프롬프트가 뜨는 것을 확인할 수 있다. 누구도 입력해주지 않으니 빌드는 당연히 타임아웃으로 실패한다.

하지만 [app-specific password](https://support.apple.com/en-asia/HT204397)를 사용하면 2FA 없이 빌드를 업로드할 수 있다. 단, app-specific password를 사용하는 경우 App Store Connect 로그인을 필요로 하는 행동(예를 들어 메타데이터 변경)은 불가능하다. 오직 빌드 파일 업로드만이 허용된다. 이러나 저러나, 별도의 Apple Developer Program을 구매할 생각이 없다면 이게 현존하는 최선의 방식이다. (만약 별도 계정 구매가 가능한 경우의 설정은 [fastlane CI 문서](https://docs.fastlane.tools/best-practices/continuous-integration/#separate-apple-id-for-ci) 참고)

먼저 [fastlane 공식 문서](https://docs.fastlane.tools/best-practices/continuous-integration/#application-specific-passwords)에 적혀있는 스텝을 따라 배포하려는 앱의 app-specific password를 발급받는다. 발급받은 값을 Travis CI의 `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` 환경 변수로 넣어준 뒤, 아래와 같이 `upload_to_testflight` 액션이 빌드만 업로드하도록 추가 인자를 넘겨준다.

```ruby
# before: 이 부분을
upload_to_testflight

# after: 이렇게 변경한다
upload_to_testflight(
  skip_waiting_for_build_processing: true,
  apple_id: "배포하려는 앱의 apple id"
)
```

`apple_id` 인자로 넘겨야 할 값은 아래 그림과 같이 App Store Connect의 “App Information” (또는 URL path) 에서 확인할 수 있다. 숫자가 아닌 문자열이라는 점에 유의하자.

![App Information 페이지에서 Apple ID를 찾는 방법을 설명하는 스크린샷](/assets/flutter_cicd_app_information.png)

## 🍎 Pitfall: dsym 버그

마지막 Travis CI 설정으로 넘어가기 전에, 갈피 저장소를 설정하면서 겪었던 두가지 장애물을 소개한다.

먼저, macOS 버전에 따라 `fastlane beta`를 실행했을 때  `*Generating 'Runner.app.dSYM'*` 로그 이후로 아무 일도 일어나지 않고 빌드가 타임아웃으로 실패하는 경우가 발생할 수 있다. [Flutter 저장소 이슈](https://github.com/flutter/flutter/issues/27315)로도 등록되어 있는데, 원인은 Xcode 10의 일부 버전에 존재하는 버그다.

이슈에 링크된 StackOverflow 답변처럼 Xcode의 `Runner` 타겟의 “Build Settings > Debug Information Format” 설정을 `DWARF`로, “Enable Bitcode” 설정을 `No`로 설정한 후에 `ios/Runner.xcodeproj/project.pbxproj` 파일을 저장하고 다시 시도해보면 해결된 것을 확인할 수 있다.

![디버그 옵션이 글에서 설명한 대로 설정된 Xcode](/assets/flutter_cicd_xcode_debug_option.png)

## 🍎 Pitfall: Travis CI macOS Sierra 코드 사이닝 버그

위의 dsym 버그를 해결한 후에도 Travis CI 상에서의 빌드가 `*Copying* /Users/travis/build/myaccount/my_app/ios/Flutter/App.framework`  등의 로그를 끝으로 아무런 반응이 없다가 타임아웃이 나서 실패하는 경우가 발생할 수 있다.

이 문제는 Travis CI의 [Common Build Problems 문서](https://docs.travis-ci.com/user/common-build-problems/#mac-macos-sierra-1012-code-signing-errors) 에 소개되어 있는데, Travis CI가 사용하는 macOS Sierra 머신에서 코드 사이닝 스텝이 끝나지 않는 버그가 존재하는 것이 원인이다. 문서에 제시된 대로 `match` 액션 이전에 [`create_keychain`](https://docs.fastlane.tools/actions/create_keychain/)  액션으로 생성한 키체인을 사용하도록  `Fastfile`을 수정해 해결할 수 있다. ([해당 수정 관련 diff](https://github.com/heejongahn/galpi/commit/1767f40bc109aab8da00bffbb86770afa07b9958#diff-cd2067cf40564fd83a01bcbe6af1623eR21-R36))

이 변경사항이 동작하기 위해선 Travis CI의 설정에서 `MATCH_KEYCHAIN_NAME`, `MATCH_KEYCHAIN_PASSWORD` 두 환경 변수를 추가해줘야 한다. `MATCH_KEYCHAIN_PASSWORD`는 어떤 값이든 무관하고, `MATCH_KEYCHAIN_NAME` 는  `login.keychain`을 제외한 임의의 `<name>.keychain`이 모두 유효한 듯 하다. 나는 `ios-build.keychain`을 사용했다.

```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Push a new release build to the TestFlight"
  lane :beta do
    create_keychain(
      name: ENV["MATCH_KEYCHAIN_NAME"],
      password: ENV["MATCH_KEYCHAIN_PASSWORD"],
      default_keychain: true,
      unlock: true,
      timeout: 3600,
      add_to_search_list: true
    )

    match(
      type: "appstore",
      readonly: is_ci, 
      keychain_name: ENV["MATCH_KEYCHAIN_NAME"],
      keychain_password: ENV["MATCH_KEYCHAIN_PASSWORD"],
      verbose: true
    )

    build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      apple_id: "배포하려는 앱의 apple id"
    )
  end
end
```

사실 갈피 앱 환경을 이렇게 설정해서 문제가 해결된 것을 보고 올바른 해결법을 도입했으며 더 이상의 변경은 필요 없다고 생각했다. 하지만 이 글을 쓰면서 구글링을 하다 fastlane에 이 작업을 알아서 해주는 [`setup_travis`](https://docs.fastlane.tools/actions/setup_travis/) 액션이 존재하는 것을 발견했다. (보시다시피 블로깅은 도움이 된다! 우리 모두 블로깅을 합시다!) 

이 액션을 사용하면 `Fastfile`이 다음과 같이 단순해진다. [소스 코드](https://github.com/fastlane/fastlane/blob/master/fastlane/lib/fastlane/actions/setup_ci.rb#L23-L45)를 보면 위와 거의 동일한 작업을 함을 확인할 수 있다.

```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  desc "Push a new release build to the TestFlight"
  lane :beta do
    setup_travis

    match(
      type: "appstore",
      readonly: is_ci, 
      verbose: true
    )

    build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      apple_id: "배포하려는 앱의 apple id"
    )
  end
end
```

이 때, `setup_travis` 액션을 사용하려면 앞서 설정한 `MATCH_KEYCHAIN_NAME` 환경 변수를 제거해야 함에 유의하라. (그러지 않으면 `match`가 _똑똑하게_ 환경 변수에 설정된 이름의 키체인을 읽어오려 시도해서 빌드가 실패한다.)

## 🍎 Travis CI에서 TestFlight 배포

모든 준비가 끝났다! 이제 로컬에서 돌려본 이 모든 스크립트를 Travis CI에서 실행하도록 하면 iOS 쪽 작업은 끝이 난다. iOS와 Android 두 플랫폼의 빌드가 동시에 도는 것이 최종 목적이므로 Travis CI의 [Build Matrix](https://docs.travis-ci.com/user/build-matrix/)를 사용할 것이다.

프로젝트 루트의 `.travis.yml` 파일을 아래와 같이 변경하자.

```yaml
# .travis.yml #3: iOS 배포 자동화
language: generic

env:
  - FLUTTER_BUILD_RELEASE_CHANNEL=stable # 사용할 빌드 릴리즈 채널

matrix:
  include:
    - name: iOS Build
      os: osx
      language: generic
      osx_image: xcode10.2

      before_script:
        - echo -e "machine github.com\n  login $GITHUB_TOKEN" >> ~/.netrc # match 인증서 저장소에 접근하기 위해 GitHub Token 설치

        - git clone https://github.com/flutter/flutter.git -b $FLUTTER_BUILD_RELEASE_CHANNEL
        - export PATH=`pwd`/flutter/bin:`pwd`/flutter/bin/cache/dart-sdk/bin:$PATH # Flutter를 내려받은 후 PATH 설정

        - gem install bundler
        - gem install cocoapods
        - cd ios && bundle install && cd .. # bundler, cocoapods 및 fastlane 설치

      script:
        - flutter doctor -v # 빌드 디버깅을 위한 Flutter 정보 로깅

        - bash scripts/populate_secret.sh # 환경 변수에 들어있는 써드 파티 라이브러리 시크릿을 파일로 작성

        - flutter build ios --no-codesign --build-number=$TRAVIS_BUILD_NUMBER # Flutter iOS 빌드에 필요한 파일을 내려받고 번들의 빌드 이름 및 빌드 번호 설정

        - cd ios
        - bundle exec fastlane beta # fastlane을 사용한 코드 사이닝, 빌드 및 TestFligth 배포
```

위 설정에서는 [Travis CI의 기본 환경 변수](https://docs.travis-ci.com/user/environment-variables/#default-environment-variables) 중 하나인 `TRAVIS_BUILD_NUMBER`를 버전 번호로 사용했다. 하지만 꼭 해당 값을 버전 번호로 사용할 필요는 없다. 앱 버저닝 관련 경험이 없는 독자라면 글 마지막 부분의 “부록: 버저닝 전략” 을 한 번 읽어보면 도움이 될 것이다.

## 🍎 최종 결과물

이제 GitHub 푸시에 의해 Travis CI에서 iOS 빌드가 돌고, TestFlight에 앱이 올라가는 것을 확인할 수 있을 것이다. iOS 준비가 완료된 시점에서의 `.travis.yml`, `Appfile`, `Fastfile`, `Matchfile`을 [gist](https://gist.github.com/heejongahn/0dc1c36ccef6fb69e209740ec45be25a)에서 확인할 수 있다.

- - -

# 🤖 Android: Google Play 내부 테스트 트랙 배포

다음은 Android의 차례다. 기본적으로 iOS와 해야할 일은 크게 다르지 않은데다 설정이 iOS 대비 단순한 편이라, 앞의 과정을 잘 따라왔다면 상대적으로 쉽게 느껴질 것이다.

## 🤖 로컬 배포를 위한 Fastfile 세팅

가장 먼저, iOS에서와 동일하게 로컬에서 fsatlane을 이용해 Play Store에 번들을 올리는 작업부터 진행해보자.

`fastlane init`이 실행된 시점에서, `android` 폴더 내에는 (`fastlane` 폴더 내의) `Appfile`과 `Fastfile`, 그리고 `Gemfile`이 만들어져 있을 것이다.

fastlane을 이용해 Android 앱을 배포하기 위해선 [Google 서비스 계정](https://cloud.google.com/iam/docs/service-accounts)이 필요하다. [공식 문서](https://docs.fastlane.tools/getting-started/android/setup/#setting-up-supply)에 나와있는 대로, 새로운 서비스 계정은 Play Console에서 발급받을 수 있다. Play Console의 좌측 드로어의 "모든 어플리케이션”을 클릭한 뒤, "설정" 내의 "개발자 계정 > API 액세스” 메뉴에 들어가 하단의 "서비스 계정 만들기"를 클릭한 뒤, 안내 모달의 "Google API 콘솔" 링크를 클릭한다. (왜 이런 식으로 만들었는지는 모르겠다) 

![Google 서비스 계정 생성을 위한 절차를 설명하는 스크린샷](/assets/flutter_cicd_google_service_account.png)

안내대로 Google API 콘솔로 들어가면 서비스 계정을 만들 수 있다. 생성시 **JSON 타입의 키를 선택하고, 해당 JSON 파일을 내려받아 `android/app/serviceAccount.json` 경로에 저장하자**. 다시 Play Console로 돌아오면 방금 생성한 서비스 계정이 목록에 나타날 것이다. 파란색 “액세스 권한 부여” 버튼을 눌러 “제품 출시 관리자” 권한을 주면 모든 준비가 끝난다.

> **NOTE: 이때 내려받은 서비스 계정 파일은 절대 Git 등의 VCS에 체크인 되어선 안 된다! 서비스 계정 파일을 프로젝트 내에 추가한 후엔 꼭 `.gitignore` 등에 추가하자.**

이제 `Appfile`의 내용을 적절하게 변경하자. `package_name` 필드에는 거꾸로 된 도메인 형태로 되어있는, Play Store에서 사용 중인 앱 식별자를 적어준다. `json_key_file`에는 아까 내려받은 서비스 계정 파일의 경로인 `"app/serviceAccount.json"`을 넘겨준다.

```ruby
# android/fastlane/Appfile

json_key_file("app/serviceAccount.json")
package_name("거꾸로 된 도메인 형태의 앱 식별자")
```

그 후 `bundle exec fastlane supply init` 커맨드를 실행하면 서비스 계정을 사용해 Google Play에 이미 올라가 있는 정보를 `android/fastlane/metadata/android` 폴더로 받아올 것이다.

`Appfile` 준비가 끝났으니 `Fastfile`을 수정해보자. `fastlane init`이 끝난 시점에서 `Fastfile`은 아래와 같은 형태를 하고 있을 것이다.

```ruby
# android/fastlane/Fastfile

default_platform(:android)

platform :android do
  desc "Runs all the tests"
  lane :test do
    gradle(task: "test")
  end

  desc "Submit a new Beta Build to Crashlytics Beta"
  lane :beta do
    gradle(task: "clean assembleRelease")
    crashlytics
  
    # sh "your_script.sh"
    # You can also use other beta testing services here
  end

  desc "Deploy a new version to the Google Play"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store
  end
end
```

우리는 [Crashlytics Beta](https://firebase.google.com/products/app-distribution) 가 아닌 Google Play 내부 테스트 트랙으로의 빌드를 배포한다. 또한 iOS와 마찬가지로, 빌드 이름과 빌드 번호를 넘겨주기 위해 fastlane의 Flutter CLI를 `gradle` 액션 대신 사용한다. 따라서 필요없는 배포 레인과 `gradle` 액션을 삭제하고, `crashlytics` 대신 적절한 인자를 갖는 `upload_to_play_store` 액션을 사용하도록 `Fastfile`을 수정한다.

```ruby
# android/fastlane/Fastfile

default_platform(:android)

platform :android do
  desc "Submit a new Beta Build to Google Play Internal Test Track"
  lane :beta do
    begin
      upload_to_play_store(
        track: 'internal',
        aab: '../build/app/outputs/bundle/release/app.aab',
      )
      rescue => exception
        raise exception unless exception.message.include?('apkUpgradeVersionConflict')
        puts 'Current version already present on the Play Store. Omitting this upload.'
    end
  end
end
```

이제 로컬에서 fastlane을 사용해 배포할 준비가 끝났다. 먼저 `flutter build appbundle --build-number=<빌드 번호>` 커맨드를 실행해 App Bundle을 만든다. 그 이후 `android` 폴더에서 `bundle exec fastlane beta` 커맨드를 실행하면 만들어진 App Bundle이 Google Play의 내부 테스트 트랙으로 배포되는 것을 확인할 수 있다.

![로컬에서 fastlane을 사용한 Android 배포에 성공한 경우의 스크린샷](/assets/flutter_cicd_local_fastlane_android.png)

> NOTE: 테스트 과정에서는 지금까지의 빌드 번호보다는 크되 최대한 작은 빌드 번호를 사용할 것을 권장한다. 이유는 글 하단의 “부록: 버저닝 전략” 부분 참고.

## 🤖 CI 머신에서의 코드 사이닝을 위한 파일 업로드

iOS에서와 마찬가지로, Android 앱 배포에도 코드 사이닝이 필요하다. [Flutter의 공식 Android 배포 가이드](https://flutter.dev/docs/deployment/android#signing-the-app) 를 따라 Play Store에 앱을 올려본 적이 있다면, `.jks` 확장자를 갖는 키스토어를 로컬 어딘가에 받아둔 뒤, `android/key.properties` 파일의 `storeFile` 필드로 참조하고 있을 것이다.

이제 코드 사이닝이 CI 머신에서도 가능하도록 만들 차례다. fastlane match를 사용했던 iOS와 달리, Android에서는 관련된 파일을 암호화한 뒤 Travis에 직접 업로드하는 방식으로 코드 사이닝을 풀어낼 것이다.

먼저, `android/key.properties`의 `storeFile` 필드에 적힌 경로에 존재하는 `.jks` 파일을 `android/app/upload.keystore`로 옮겨온 뒤, `android/key.properties`의 `storeFile` 필드 값을 `upload.keystore`로 변경하자.

> **NOTE: 이때 리포지토리 안으로 가져온 키스토어 절대 Git 등의 VCS에 체크인 되어선 안 된다! 서비스 계정 파일을 내려받았으면 꼭 `.gitignore` 등에 추가하자.**

CI 머신에서의 코드 사이닝을 위해 필요한 파일은 세 개다.

* `android/key.properties`: 키스토어 파일 위치와 복호화에 필요한 비밀번호
* `android/app/serviceAccount.json`: Google Play로의 바이너리 및 메타데이터 업로드에 필요한 계정 정보
* `android/app/upload.keystore`:  키스토어 파일

[Travic CI CLI 클라이언트](https://github.com/travis-ci/travis.rb) 를 사용해 이 파일들을 안전하게 업로드 및 암복호화 할 것이다. 먼저 `gem install travis`로 CLI 클라이언트를 설치한 뒤, 이후 모든 요청이 올바른 엔드포인트를 바라보도록 `travis endpoint --pro --set-default` 커맨드를 실행해준다. 만약 기본값을 변경하기 싫다면, 앞으로의 커맨드에 모두 `—pro` 인자를 넘겨주면 된다.

엔드포인트 설정이 끝났으면 `tar cvf secrets.tar android/key.properties android/app/serviceAccount.json android/app/upload.keystore` 커맨드로 코드 사이닝에 필요한 세 파일을 `secrets.tar`  파일로 묶어준다.

> **NOTE: 암호화되기 전의 압축 파일인 `secrets.tar`은 절대 Git 등의 VCS에 체크인 되어선 안 된다! 압축 파일을 생성했으면 꼭 `.gitignore` 등에 추가하자.**

그 뒤, `travis encrypt-file secrets.tar` 커맨드를 실행해 이 압축 파일을 암호화한다. 이 커맨드는 다음과 같은 일을 한다.

1. [OpenSSL](https://www.openssl.org)을 이용해 `secrets.tar` 파일을 `secrets.tar.enc` 파일로 암호화한다. **이 암호화된 파일은 VCS에 체크인 되어야 한다.**
2. 복호화에 사용할 키와  [초기화 벡터](https://ko.wikipedia.org/wiki/%EC%B4%88%EA%B8%B0%ED%99%94_%EB%B2%A1%ED%84%B0)  값을 Travis CI 저장소의 환경변수로 설정한다.
3. 해당 환경변수를 사용해 파일을 복호화하는 커맨드를 출력한다.

성공적으로 암호화 작업이 끝났다면 터미널에 `openssl aes-256-cbc -K $[키_환경변수_이름] -iv $[초기화_벡터_환경변수_이름] -in secrets.tar.enc -out secrets.tar -d` 형태의 커맨드가 출력되었을 것이다. 해당 커맨드를 Travis CI의 Android 빌드 잡에서 실행해주면 `secrets.tar.enc` 파일을 다시 `secrets.tar`로 복호화할 수 있다. 

## 🤖 Pitfall: `buildToolsVersion`과 Travis android component 버전

Android 에서도 최종 Travis CI 설정으로 넘어가기 전 밟을 수 있는 문제를 먼저 소개한다. 로컬에서 잘 되던 Android 빌드가 Travis CI에서 아래와 같은 로그와 함께 실패하는 경우가 있다.

```
FAILURE: Build failed with an exception.

* Where:
Build file '/home/travis/build/heejongahn/galpi/android/build.gradle' line: 24

* What went wrong:
A problem occurred evaluating root project 'android'.

> A problem occurred configuring project ':app'.
   > Failed to install the following Android SDK packages as some licences have not been accepted.
        platforms;android-28 Android SDK Platform 28
     To build this project, accept the SDK license agreements and install the missing components using the Android Studio SDK Manager.
     Alternatively, to transfer the license agreements from one workstation to another, see http://d.android.com/r/studio-ui/export-licenses.html

     Using Android SDK: /usr/local/android-sdk
```

이 이슈는 Travis CI에 명시된 것과 다른 버전의 Android SDK Build-Tools를 사용하기 때문에 발생한다. [이 커밋](https://github.com/heejongahn/galpi/commit/c16783f9a900baf7ae20bc5b8eade550ab814174)에서처럼 `android/app/build.gradle` 파일의 `android` 블락에 `buildToolsVersion “.travis.yml에 명시된 build-tools 버전”` 라인을 추가해주면 해결된다.

## 🤖 Travis CI에서 Google Play 내부 테스트 트랙 배포

모든 준비가 끝났다. 프로젝트 루트의 `.travis.yml`  Build Matrix에 아래와 같이 Android 빌드 잡을 추가하자.

```yaml
# .travis.yml #4: Android 배포 자동화
language: generic

env:
  - FLUTTER_BUILD_RELEASE_CHANNEL=stable # 사용할 빌드 릴리즈 채널

matrix:
  include:
    - name: iOS Build
      # (이하 iOS 빌드 생략)

    - name: Android Build
      language: android
      jdk: openjdk8
      android:
        components:
          - build-tools-28.0.3
          - android-28
      before_script:
        - openssl aes-256-cbc -K $[키_환경변수_이름] -iv $[초기화_벡터_환경변수_이름] -in secrets.tar.enc -out secrets.tar -d
        - tar xvf secrets.tar # travis encrypt-file을 사용해 암호화한 압축 파일 복호화하고 압축 해제

        - git clone https://github.com/flutter/flutter.git -b $FLUTTER_BUILD_RELEASE_CHANNEL
        - export PATH=`pwd`/flutter/bin:`pwd`/flutter/bin/cache/dart-sdk/bin:$PATH # Flutter를 내려받은 후 PATH 설정

        - gem install bundler && cd android && bundle install && cd .. # bundler와 fastlane 설치

      script:
        - flutter doctor -v # 빌드 디버깅을 위한 Flutter 정보 로깅

        - bash scripts/populate_secret.sh # 환경 변수에 들어있는 써드 파티 라이브러리 시크릿을 파일로 작성

        - flutter build appbundle --build-number=$TRAVIS_BUILD_NUMBER # App Bundle 빌드

        - cd android
        - bundle exec fastlane beta # fastlane을 이용해 빌드 파일 업로드
```

드디어 GitHub 코드 푸시가 일어나면 이 글의 도입부의 이미지처럼 Android와 iOS 빌드가 각각 돌고, Play Store 내부 테스트 트랙과 TestFlight에 빌드가 업로드 되는 아름다운 환경이 구축되었다! 소리 질러!!! (우와) (웅성웅성) (시끌벅적)

- - -

# 맺으며

이상으로 앱 개발 경험이 전무한 웹 개발자의 입장에서 iOS, Android 두 플랫폼 빌드 및 내부용 배포 자동화 설정 과정을 단계별로 살펴보았다. 글에서 다룬 내용을 다시 한 번 정리하면 아래와 같다.

* 공통
  * GitHub 푸시에 Travis CI가 트리거 되도록 설정
  * Travis CI에 써드 파티 API키 설정
* iOS
  * match를 이용한 코드 사이닝
  * app-specific password를 사용한 TestFlight로의 빌드 업로드
* Android
  * Travis CI CLI 클라이언트를 이용한 비밀 파일 암복호화 및 업로드
  * 서비스 계정을 사용한 Google Play로의 빌드 업로드

앱 개발을 하기로 마음 먹었다면 어차피 이르던 늦던 앱 생태계를 이루는 요소들에 대해 배워야 한다. 지난하고 어려운 디버깅의 연속이었지만, 결과적으로 앱 개발 생태계에 대해 어느정도 이해할 수 있는 좋은 경험이었다. 

도입부에서 적었듯, 이 글에서 다룬 모든 설정이 끝난 상태의 코드는 [해당 시점의 갈피 GitHub 저장소](https://github.com/heejongahn/galpi/tree/84e9f3d260667d207c3bf868c669768e10bfeefc)에서 확인할 수 있다. 이 글과 소스 코드가 나와 비슷한, 앱 개발 외의 배경을 갖고 Flutter 세계에 발을 들인 사람들에게 도움이 되길 바란다.

## 남은 작업

이 글에서는 자동으로 빌드가 일어나고 업로드되는, 아주 작은 작업의 자동화만을 다루었다. 기본적인 준비는 끝났으니 이후 다양한 자동화 작업을 추가할 수 있을 것이다. 추가할 수 있는 작업의 예를 들면 다음과 같다.

* [모든 브랜치를 빌드하고 `master` 브랜치의 빌드만 업로드를 수행하도록 설정](https://github.com/heejongahn/galpi/issues/1) 
* [자동화된 스크린샷 생성](https://medium.com/@nocnoc/automated-screenshots-for-flutter-f78be70cd5fd)
* 자동화된 테스팅
* [이 트윗 쓰레드](https://twitter.com/heejongahn/status/1162972852066193409)에서 언급한 문제와 빌드 이름/번호 설정 때문에 iOS 빌드를 두 번 진행하고 있는데 한 번으로 줄이는 것이 가능한지 연구
* CHANGELOG 생성 자동화

빠른 개발에 가장 큰 걸림돌이 될 포인트는 해결했으니, 이런 작업은 개발을 진행하면서 하나씩 천천히 진행해나갈 생각이다.

> NOTE: 만약 이 글을 읽은 후 바로 위 작업을 이어서 진행하시는 독자가 계시다면, 블로그 글 등으로 경험을 공유해주시면 감사하겠습니다.

- - -

# 부록: 버저닝 전략

마지막으로, 빌드/배포 자동화와 직접적 연관은 없지만 결코 빼놓을 수 없는 개념인 버저닝에 대해 배운 바를 부록으로 정리해 보았다.

Android와 iOS 두 플랫폼 모두에서, 각 어플리케이션 빌드는 크게 두 가지 식별자를 갖는다. ( [Android 버저닝 문서](https://developer.android.com/studio/publish/versioning), [iOS 버저닝 문서](https://developer.apple.com/library/archive/technotes/tn2420/_index.html))  각 플랫폼마다 비슷한 개념이 존재하지만 부르는 용어가 다른데, 이 글에서는 Flutter에서 사용하는 build name(이하 ‘빌드 이름’)과 build number(이하 ‘빌드 번호’)라는 용어를 사용한다.

## 사용자에게 노출되는 버전 식별자: 빌드 이름

> Android에서는 version name, iOS에서는 version number 라는 용어를 사용한다.

빌드 이름은 `1.0.3`과 같이 `x.y.z` 형태를 갖는 문자열로, 사용자에게 노출된다. 사용자의 입장에서 이야기하는 “앱 버전”이 이 개념에 해당한다. 보통은 이 값으로는 [유의적 버전](https://semver.org/lang/ko/)을 사용한다.

## 사용자에게 노출되지 않는 버전 식별자: 빌드 번호

> Android에서는 version code, iOS에서는 build number 라는 용어를 사용한다.

빌드 번호는 임의의 숫자로, 어떤 빌드 이름의 **특정 빌드 파일**을 가리키는 식별자다. 즉, 같은 빌드 이름을 갖는 다섯 개의 빌드 파일이 존재한다면, 다섯 개의 서로 다른 빌드 번호가 존재한다. 이 숫자는 사용자에게 노출되지 않으며, 내부 관리용으로만 사용된다. 

플랫폼 별 빌드 번호는 아래와 같은 제약 사항을 갖는다.

* iOS: 같은 빌드 이름을 갖는 빌드는 서로 다른 빌드 번호를 가져야 한다. 다른 빌드 이름을 갖는 빌드 사이에는 빌드 번호가 겹칠 수 있다. 즉, `(빌드 이름, 빌드 번호)` 페어가 특정 빌드의 식별자로 사용된다.
* Android: 모든 빌드는 서로 다른 빌드 번호를 가져야 한다. **추가적으로, 새로 업로드 되는 빌드는 기존에 존재하는 모든 빌드보다 큰 빌드 번호를 가져야 한다.** 또한, 빌드 번호의 최대값은 2100000000이다.

## Flutter 빌드에 빌드 이름과 빌드 번호 넘기기

`flutter build ios —help`  또는 `flutter build appbundle —help`를 실행해보면 알 수 있듯이, `flutter build <target>` 커맨드에 `--build-number`, `—build-name` 인자를 넘겨 빌드 이름과 빌드 번호를 지정할 수 있다.

넘겨진 인자는 Android의 경우 `android/local.properties` 파일, iOS의 경우 `ios/Flutter/Generated.xcconfig`에 쓰인 뒤, 플랫폼별 빌드 툴이 해당 파일의 내용을 참조해 번들의 빌드 이름, 빌드 번호를 설정한다.

만약 `flutter build` 커맨드에 인자를 넘기지 않았다면 `podfile.yaml`의 `version` 속성이 대신 사용된다. 이 때  `version` 속성 값은 `+` 문자로 나뉘어 앞 부분이 빌드 이름, 뒷 부분이 빌드 번호가 된다. (예를 들어 `version` 속성 값이 `1.0.1+42`라면 빌드 이름 `1.0.1`, 빌드 번호 `42`)

## CI에서 빌드 번호 관리하기

보통 빌드 이름은 개발자가 특정한 의도를 갖고 언제 버전을 올릴지, 또 major, minor, patch 중 어떤 버전을 올릴지를 결정한다. 때문에 CI 스크립트에서 빌드 이름을 건드릴 일은 잘 생기지 않는다. (매 빌드마다 Git 커밋 기반으로 빌드 이름을 올릴 수 있지만, 사용자에게 노출되는 앱의 버전이 지나치게 빠르게 올라가는 문제가 생긴다.)

반면 위에서 언급한 플랫폼별 제약사항으로 인해, 빌드 번호는 GitHub 푸시로 인해 새 빌드가 생길 때마다 새로운 값으로 설정되어야 한다. 갈피에서는 처음에 타임스탬프를 사용할 생각으로 `flutter build ios --build-number=$(date "+%y%m%d%H%M")` 같은 스크립트를 사용했고,  `fastlane`을 이용해 `1908191509` 버전 번호를 갖는 빌드를 TestFlight와 Play Console 내부 테스트 트랙에 배포하는 데에 성공했다.

실수를 깨닫기까지는 그리 오래 걸리지 않았다. 이 방식으로는 2021년만 되어도 Android 빌드 번호 최대값을 넘어버리는 것이다. Android의 빌드 번호는 단조증가하므로 위 빌드가 있는 이상 빌드 번호는 저 값보다 커지기만 해야 하는데, Play Console 상으로는 올라간 apk를 삭제할 방법이 보이지 않았다.

패닉한 채로 Google Play 지원팀에 해당 apk를 삭제해줄 수 있는지 문의를 넣었다. 설령 내부 테스트 트랙에만 배포가 되었더라도 일단 배포가 된 apk는 삭제가 불가능하다는 답변을 받았다. 추가적으로, 만약 빌드 번호가 최대값에 도달하면 새로운 앱을 만들지 않는 한 업데이트가 불가능하다는 것까지도. (구글 정도 스케일에서는 이럴 수 밖에 없는 기술적인 이유가 있겠거니 납득했지만 받아들이기까지 시간이 좀 걸렸다)

전혀 예상하지 못한 문제라 어떻게 해야 깔끔하게 이 사태를 해결할 수 있을지 머리를 싸매던 중, 감사하게도 평소 들어가 있던 IRC 채팅방에서 한 분의 도움을 받아 간단한 해결책을 찾았다. 실수로 업로드한 가장 큰 빌드 번호를 베이스로, 새로운 Travis CI 빌드가 생성될 때마다 1씩 증가하는 `TRAVIS_BUILD_NUMBER` 환경 변수 더한 값을 빌드 번호로 사용하는 것이다.

```yaml
# travis.yml #5: Galpi 앱에서 사용중인 버전

env:
  # Fastlane 세팅 중 Play Store Console에 실수로 이 버전 코드를 갖는 apk를 업로드 했는데
  # 업로드한 apk를 삭제할 수단이 없어서 이 값을 버전 코드의 베이스로 사용한다.
  - VERSION_CODE_BASE=1908191509 FLUTTER_BUILD_RELEASE_CHANNEL=beta

matrix:
  include:
    - name: Android Build
      language: android
      jdk: openjdk8
      android:
        components:
          - build-tools-28.0.3
          - android-28
      before_script:
        # (before script에 들어갈 내용)
      script:
        - flutter doctor -v
        - bash scripts/populate_secret.sh
        - flutter build appbundle --build-number=$(( $VERSION_CODE_BASE + $TRAVIS_BUILD_NUMBER ))
        - cd android
        - bundle exec fastlane beta
    - name: iOS Build
		# (이하 iOS 빌드 생략)
```

물론 이런 특이한 처리는 나와 같은 실수를 한 경우에나 필요하다. 보통은 이 글에서 예시로 들었듯 `TRAVIS_BUILD_NUMBER` 등의 값을 사용하면 충분할 것이다. 이 글을 읽는 사람은 부디 나와 같은 실수를 하지 말고, 처음부터 `TRAVIS_BUILD_NUMBER` 등의 환경 변수를 사용하거나, [이 Medium 글](https://medium.com/@esplo/using-an-unusual-timestamp-as-an-auto-generated-version-code-for-android-apps-f231b026edbd)이 제시하는 것처럼 충분히 오래 사용할 수 있는 epoch 기반의 값을 빌드 번호로 사용하길 바란다.

- - -

# 부록: 참고 자료

* [플러터 공식 문서: Continuous delivery with Flutter](https://flutter.dev/docs/deployment/cd)
* [미디엄 글: Continuous Integration and Deployment with Flutter and Fastlane](https://medium.com/@arnemolland/continuous-integration-and-deployment-with-flutter-and-fastlane-a927014723e1) 
* [fastlane 공식 문서: match](https://docs.fastlane.tools/actions/match/)
* [미디엄 글: iOS Code Signing & Provisioning in a Nutshell](https://medium.com/ios-os-x-development/ios-code-signing-provisioning-in-a-nutshell-d5b247760bef)
* [objc.io 포스팅: Inside Code Signing](https://www.objc.io/issues/17-security/inside-code-signing/)
