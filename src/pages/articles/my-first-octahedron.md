---
templateKey: blog-post
title: "나의 버건디 팔면체 : Three.js를 사용한 3D 그래픽스 입문기"
date: 2017-07-10T09:00:00+09:00
description: "자바스크립트를 이용한 손쉬운 3D 그래픽스 프로그래밍 입문을 도와주는 라이브러리 three.js 사용기."
tags:
  - three.js
  - 그래픽스
  - 자바스크립트
---
# 들어가며
프론트엔드 프로그래머로서 요즘 나의 가장 큰 관심사는 기술적으로도 훌륭한 동시에 보는 사람이 감탄할만한 아름다운 사이트를 만드는 것이다. 그런터라 지난 주에 미국의 [Stripe](https://stripe.com/)라는 회사의 여러 랜딩 페이지를 보면서 약간의 질투를 동반하는 경이로움을 느꼈다. 특히 다른 무엇보다 [Radar](https://stripe.com/radar) 라는 제품의 랜딩 페이지에서 천천히 돌아가고 있는 이십면체가 인상 깊었다.

![Stripe Radar](https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles/my-first-octahedron/radar.gif)

솔직히 이 이십면체가 (Radar라는 제품의 핵심인) Stripe가 사기를 방지하기 위해 고려하는 다양한 면모를 한 눈에 보여주기 위한 최고의 수단인지는 잘 모르겠다. 하지만, 이 다면체에는 분명 들어온 사이트의 사람의 눈을 확 잡아끄는, 나가는 대신 스크롤을 내려보고싶게 만드는 그런 힘이 있었다. 비록 3D 그래픽스에 대해서는 전혀 모르지만, 나도 이런 걸 할 줄 안다면 분명 재미있고 유용할 것 같다는 생각이 들었다.

그래서 지난 주말동안 한 번 도전 해 보기로 했다. 주제는 **주말 동안 ahnheejong.name 대문에 3D로 구현한 다면체 띄우기** 였다. 이 글을 보고 있다면 이미 보았겠지만, 아래가 나의 최종 결과물이다. 😎

![최종 결과물](https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles/my-first-octahedron/result.gif)

(자신감에 가득 찬 이모지를 쓴 것 치고는) 확실히 딱 봐도 별로 화려하지 않고, 위의 이십면체에 비하면 투박하기 그지없는, 지극히 단순한 다면체다. 하지만 3D 그래픽스 프로그래밍을 해 본 경험은 커녕 기반 지식조차 하나 없는 상태에서 짧은 시간 내에 내놓은 결과물이라 나 나름대로는 뿌듯하다. 너무 뿌듯한 나머지, 남들도 이런 즐거움을 느낄 수 있도록 나의 버건디 팔면체를 그리기까지의 공부 과정을 글로 남겨보기로 했다.

---

# Three.js?
> The aim of the project is to create an easy to use, lightweight, 3D library.

[three.js](https://threejs.org/)는 mr.doob 이라는 닉네임으로 활동하는 유저가 만든 3D 자바스크립트 라이브러리이다. 웹상에서 3D 그래픽을 갖고 놀기 위해서는 HTML5 Canvas, WebGL, SVG, 플래시 😅 등의 다양한 수단을 사용할 수 있는데, three.js는 이런 여러 프리미티브를 사용한 3D 그래픽을 좀 더 쉽게 구현하기 위해 한 단계를 감싸 놓은 자바스크립트 Wrapper 역할을 하는 라이브러리이다.

회사에서 같이 일 하는 동료분 중 그래픽스에 관심과 조예가 깊으신 분이 계셔서 3D 그래픽을 해보려고 한다니 이런 저런 툴을 추천해 주셨다. 하지만 다수가 내가 써 본 적 없는 [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language)에 기반하고 있거나, 매우 낮은 추상화 단계에서 HTML5 Canvas를 직접 조작하는 식으로 작동했다. 컴퓨터 그래픽스에 있어 문외한이라 최초 학습 커브가 높은 기술로는 의미 있는 결과를 내기 전에 지칠 것이라 생각했다. 그래서 쉽게 사용할 수 있는 API 인터페이스를 갖고 있고, 익숙한 자바스크립트를 이용해 (Canvas 와는 다르게) 너무 절차적이지 않게 프로그래밍 할 수 있을 것이라 기대되는 three.js를 선택했다.

# 3D 그래픽의 구성요소
움직이지 않는, 정적인 3D 그래픽을 구현하기 위해서는 어떤 것이 필요할까? 조금만 생각을 해보면, 화면에 3D 그래픽을 그리는 일의 요소들은 현실에서 사진을 찍는 행위의 그것들과 거의 정확하게 대응된다는 것을 알 수 있다. 예를 들어보자. 카메라로 아래의 사진을 찍기 위해선 어떤 것들이 필요할까?

![🐈](https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles/my-first-octahedron/cat.jpg)
(출처:[File:Felis catus-cat on snow.jpg - Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Felis_catus-cat_on_snow.jpg))

- 삼차원에 살고 있는 우리는 간과하기 쉽지만, 무엇보다 먼저 카메라에 담을 삼차원의 **공간** 이 필요하다. 이 때 공간이라 함은 사진의 배경에 해당하는 부분을 이야기하는 것이 **아니다**. 설령 고양이와 눈을 비롯한 다른 모든 요소가 있어도 실제 크기보다 훨씬 작은 미니어처를 제작하지 않는 이상 1세제곱센티미터의 상자 안에서는 절대로 위와 같은 사진을 찍을 수 없다는 점을 생각해보라.
- 그리고, 짐작했겠지만, **피사체**가 필요하다. 여기서 피사체란 우리가 흔히 이야기하는 주가 되는 피사체(위의 사진에서는 🐈)만을 지칭하는 것이 아니다. 고양이와 배경에 쌓여 있는 눈 입자들, 먼지, 지나가는 파리 등 **부피**와 **질감**을 갖는 모든 물체가 피사체에 해당한다.
- 그리고 마지막으로, 사진을 찍기 위해서는 📷🐈📸🎆 **카메라**가 필요하다. 그런데 카메라만 있다고 되는 건 아니고 하나의 요소가 더 있다. 아무리 좋은 카메라로 사진을 찍어봤자 이 요소가 없이는 새까만 화면 밖엔 볼 수 없다. 바로 **빛**이다.

그리고 위에서 언급했듯이, 사진을 찍기 위해 필요한 이런 요소들은 각각 three.js의 특정 요소와 대응한다. 다음과 같이 적어 볼 수 있다.

- 공간 - Scene
- 피사체 : 부피, 질감 - Mesh : Geometry, Material
- 카메라 - Camera
- 빛 - Light

그럼 이제 본격적으로 팔면체를 그려에 들어가기에 앞서 다음을 명확히 하겠다.

- 나는 컴퓨터 그래픽스의 전문가가 아니다. 앞에서 언급 했듯 이제 막 첫 발자국을 뗀 학생에 불과하다. 내가 이해한 바를 틀리지 않게 옮기고자 노력하겠지만, 틀린 부분이 있을 수 있다. 만약 글에서 틀린 점을 발견한다면 [메일을 통해](mailto:heejongahn@gmail.com?subject=나의 버건디 팔면체 : Three.js를 통한 3D 그래픽스 입문기 오류 제보) 제보해 주시면 감사하겠다.
- 아래의 내용은 2017년 6월 27일 기준 최신 버전인 three.js r86 기준으로 쓰여졌다.
- 모든 자바스크립트 코드는 ES2016 기준으로 작성했다.

그럼 이제 three.js로 3D 그래픽을 구현하기 위해 필요한 요소를 하나씩 살펴보자.

---

# 공간
가장 먼저, 우리의 오브젝트들을 놓을 공간이 필요하다. three.js 에서는 이러한 공간을 Scene 이라고 부른다.

> Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.

```js
const scene = new THREE.Scene();
```

 Scene은 단어의 뜻 그대로 우리가 화면에 그리고자 하는 어떤 장면에 해당한다. 보다 정확하게는, 그 장면에 대한 정보 - 카메라는 어디서 어떤 방향으로 바라보고 있고, 광원은 어디에 존재하고, 어떤 물체들이 있고 등 - 를 모두 담고 있는 무언가라고 이야기 할 수 있겠다.  [Scene 공식 문서](https://threejs.org/docs/#api/scenes/Scene)

필요한 모든 정보를 갖고 있더라도, 이러한 정보를 실제로 사람이 보는 화면에 그리기 위해서는 이 정보가 그려야 할 그림을 화면에 한 픽셀 한 픽셀 실제로 그려내는 작업이 필요하다. 이런 작업을 하는 녀석을 렌더러라고 부른다.

그림을 그릴 때 같은 풍경을 그리더라도 유화로 그릴 수도, 수채화로 그릴 수도 있을 것이다. 또한 종이에 그릴 수도 있고, 점토에, 철판에, 아크릴 판 에 그릴 수 있다. 이처럼 같은 그림을 그리더라도 다양한 재료와 캔버스에 그릴 수 있듯, (거칠게 비유하자면) 같은 공간*Scene*도 다양한 기술을 이용해 그려낼 수 있다. 나는 웹상의 3D 그래픽스에서 가장 보편적으로 사용되는 표준 기술인 [WebGL](https://en.wikipedia.org/wiki/WebGL)이라는 기술에 기반한 렌더러를 사용했다.

> The WebGL renderer displays your beautifully crafted scenes using WebGL.

```js
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})
```

`WebGLRenderer` 컨스트럭터는 옵션의 Object를 인자로 받는데, 나는 투명한 배경을 가질 수 있고(`alpha: true`) 안티얼라이어싱이 적용된(`antialias: true`) 화면을 그리고 싶었으므로 해당하는 옵션을 주었다. [WebGLRenderer 공식 문서](https://threejs.org/docs/#api/renderers/WebGLRenderer)

여기까지는 별로 어려울 것도, 인상적일 것도 없다. 이제 내 집 마련의 꿈을 이루었으니, 가구들을 장만해보자.

# 피사체
우리는 팔면체를 그리고자 한다. 하지만 조금 더 자세히 들어가보면, 우리가 그리고 싶은 팔면체를 두 층위로 나누어서 생각해 볼 수 있다.

1. 여덟개의 면, 여섯 개의 꼭지점, 여덟 개의 간선을 갖는 기하학적 형태
2. 일종의 뼈대로서 기능하는, 그 기하학적 형태 위에 덧씌워져 실제로 우리 눈에 보여지는 질감을 가진 표면

좀 더 쉬운 이해를 위해 구슬을 예로 들어보자. 부피와 반지름 등이 완벽하게 같은 쇠 구슬과 유리 구슬을 생각해보자. 우리가 만들어낸 Scene에 이 두 구슬을 하나씩 그리고자 할 때, 쇠 구슬과 유리 구슬을 각각 아무것도 없는 상태로부터 표면의 점을 하나씩 찍어가며 그려낼 수 있을 것이다.

하지만, 구슬의 구형 기하학적 형태를 별도로 뺄 수 있다면 어떨까? 같은 기하학적 형태를 갖고 표면만 다른 - 쇠 구슬과 유리 구슬처럼 - 여러 물체를 그릴 때 매번 기하학적 형태를 정의할 필요가 없어질 것이다. 또한, 이렇게 뼈대와 표면이 분리되면 기존에 정의한 물체의 표면을 업데이트하기도 쉬워진다.

이런 이유로,  그래픽스에서는 어떤 물체를 보통 두 부분으로 나누어 표현한다.

- 기하학적 형태, 뼈대를 담당하는 부분을 **Geometry** 라 부른다. 구슬로 치자면 “반지름이 얼마짜리 구형 물체” 라는 정보가 여기에 해당한다.
- 특정한 질감, 색, 반사율 등을 갖는 물체의 표면을 **Material**이라 부른다. 구슬로 치면 “은색이고 매끈하며 반사율이 높은 쇠 표면” 혹은 “투명하며 빛을 대부분 투과시기는 유리 표면” 등의 정보가 여기에 해당한다.

그리고 이 Geometry에 Material이 입혀진 오브젝트를 three.js 에서는 Mesh라 부른다. Mesh 라는 용어의 정확한 학문적인 의미가 궁금해서 찾아도 보고 주변에 물어도 보았는데, 정확한 의미를 갖고 있다기보다는 어느정도 관용적으로 사용되는 용어인 듯 한다. 이하 글에서는 three.js 에서 사용되는 대로 Geometry 와 Material의 합을 Mesh라 부르겠다.

> 물체(Mesh) = 뼈대(Geometry) + 표면(Material)

그럼 우리의 팔면체 메쉬를 만들어보자! 먼저 Geometry가 필요하다.  3D 모델링의 기본 단위는 삼각형이다. 즉, 모든 면은 삼각형의 합으로 표현된다. 구체와 같은 매끄러운 면 역시 충분히 작은 크기의 삼각형을 충분히 많이 모아서 표현해 낼 수 있다. 수학시간에 보았겠지만, 정삼각형을 정사각형, 정육각형, 정이십각형 등으로 점점 꼭지점의 크기를 늘려가다보면 결국 원에 가까워지는 원리와 같다.

그렇다면, 3D 모델의 뼈대를 만들어내는 가장 기본적인 방법은 다음과 같을 것이다.

- 꼭지점(Vertex)를 정의한다.
- 어떤 세 꼭지점이 이어져서 삼각형 면(Face)을 이루는지를 정의한다.

이 작업을 코드로 옮기면 아래와 같다.

```js
const geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( -10,  10, 0 ),
	new THREE.Vector3( -10, -10, 0 ),
	new THREE.Vector3(  10, -10, 0 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
```

위 코드는 x-y 평면에 세 점 (`x= -10, y=10`, `x=-10, y=-10`, `x=10, y=-10`)을 찍은 후 Geometry의 첫 번째, 두 번째, 세 번째 점을 잇는 면을 추가하는 코드이다.

이해하기 어려운 개념은 아니지만, 이런 식으로 모든 모델링을 해야 한다면 조금만 복잡한 물체를 그리려 할 때 코드의 양이 급격이 늘어나고, 의도를 파악하기 힘들어질 것이다. 그런 사태를 피하기 위해, three.js 에서는 미리 정의된 다양한 형태의 Geometry를 제공하고 있다. 사면체, 육면체 팔면체, 이십면체 등 다면체와 구, 평면 등의 Geometry 를 제공하고, 전체 목록은 공식 가이드에 들어가서 확인할 수 있다. 우리가 필요로 하는 Geometry 인 Octahedron Geometry를 다음과 같이 생성할 수 있다.

```js
const RADIUS = 40
const geometry = new THREE.OctahedronGeometry(RADIUS, 0);
```

길게 설명한 것이 무색하도록 한 줄로 끝나버렸다 😅 여담이지만 지난 주말에 작업을 하며 three.js가 제공하는 이런 간편한 API 덕분에 의미있는 결과물을 빨리 찍어낼 수 있는 점이 좋다고 느꼈다. `THREE.OctahedronGeometry`가 받을 수 있는 인자의 종류와 의미는 [공식 문서](https://threejs.org/docs/#api/geometries/OctahedronGeometry)에서 확인 할 수 있다.

Geometry가 준비되었으니, Material을 준비할 시간이다. 도입부의 다면체를 보면 간단한 수준이나마 회전에 따라 각 표면이 빛을 더 받거나 덜 받으면서 명도가 달라지는 것을 확인할 수 있다. 이 부분은 잠시 후 글의 후반부에서 구현하기로 하고, 일단 이 파트에선 빛과 상호작용 하지 않는, 가장 기본적인 표면인 `MeshBasicMaterial`을 사용하도록 한다.

```js
const material = new THREE.MeshBasicMaterial({ color: '#ff3030' })
```

마지막으로, 만들어 낸 Geometry와 Material 을 이용해 Mesh 를 만들어보자. Mesh의 생성자는 (예상했겠듯이) Geometry와 Material의 두 인자를 받는다.

```js
const mesh  = new THREE.Mesh(geometry, material)
```

이제 그리고자 하는 물체의 준비가 끝났다. 마지막으로, 앞서 준비한 공간에 이 물체를 놓아보자. 기본적으로 `scene.add` 함수를 통해 공간에 추가한 물체는 (0, 0, 0) 위치에 놓인다. 나중에 관찰을 위해 팔면체를 공간에 놓은 후에는 z축에서 뒤쪽 (화면을 뚫고 들어가는 방향) 으로 약간 밀어 두자.

```js
scene.add(mesh)
mesh.position.z = -RADIUS * 10
```

공간이 있고, 물체가 있다. 이제 카메라가 남았다.

# 카메라
지금까지의 요소들이 그랬듯, three.js의 카메라 역시 현실 세계의 카메라와 같은 역할을 한다. 같은 공간에 같은 물체들이 배치되어 있어도, 어디에 서서 어떤 시선으로 바라보느냐에 따라 보이는 풍경이 다를텐데, 이 시선에 해당하는 것이 카메라다.

여기서는 실제 사람의 눈 또는 카메라 렌즈와 비슷하게 [투시 투영](https://en.wikipedia.org/wiki/Perspective_(graphical))을 사용하는 `PerspectiveCamera`를 사용하도록 하겠다. (`PerspectiveCamera` 이외에도 다양한 형태로 Scene을 바라볼 수 있는 Camera가 있는 것으로 알고 있지만, 나는 아직까지 사용 해 보지 않았다.)  `PerspectiveCamera`는 아래와 같이 정의할 수 있다.

```js
const FIELD_OF_VIEW = 20
const ASPECT = WIDTH / HEIGHT
const NEAR = 0.1
const FAR = 10000

const camera = new PerspectiveCamera(
  FIELD_OF_VIEW,
  ASPECT,
  NEAR,
  FAR
)
```

생성자가 받는 네 개의 인자는 각각 다음과 같은 의미를 갖는다.

- FIELD_OF_VIEW: 카메라의 시야각을 의미한다. 커질 수록 카메라가 바라보는 시야각이 넓어짐을 의미한다. 단위는 degree.
- ASPECT: 시야의 가로세로비를 의미한다. 컨테이너의 가로세로비와 동일한 값을 넣어주는게 좋다. 단위 없음.
- NEAR: 렌더링 할 물체 거리의 하한값으로, 너무 가까이 있는 물체를 그리는 것을 막기 위해 사용한다. 카메라로부터의 거리가 이 값보다 작은 물체는 화면에 그리지 않는다. 0보다 크고 FAR 보다 작은 값을 가질 수 있다.
- FAR: 렌더링 할 물체 거리의 상한값으로, 너무 멀리 있는 물체를 그리는 것을 막기 위해 사용한다. 카메라로부터의 거리가 이 값보다 큰 물체는 화면에 그리지 않는다.

이제 정말 모든 준비가 끝났다.

# 그려내기
앞서 잠깐 언급했듯이, 이 모든 정보를 실제로 화면에 그려내는 일은 `renderer`의 일이다. 여기서는  `#three` 라는 id를 갖는 `<div>`를 컨테이너로 사용하기로 하고, 가로 세로가 200px인 그려보도록 하겠다. 먼저 렌더러의 가로 세로 값을 정해주자.

```js
const WIDTH = 200
const HEIGHT = 200

renderer.setSize(WIDTH, HEIGHT)
```

그 후, 렌더러가 그려낸 장면을 담을 `<canvas>` 엘리먼트를 DOM 트리에서 컨테이너의 자식으로 추가한다. 해당 엘리먼튼느 `renderer.domElement` 프로퍼티를 통해 접근할 수 있다.

```js
const container = document.querySelector('#three')
container.appendChild(renderer.domElement)
```

마지막으로, 우리가 지금까지 만들어놓은 장면과 카메라를 이용해 화면을 실제로 그리라는 명령을 내린다. 이 명령은 `renderer.render` 메소드를 이용한다.

```js
renderer.render(scene, camera)
```

여기까지 모든 과정을 따라왔다면, 아래와 같은 화면을 볼 수 있을 것이다.

![너무나도 새빨간 그대](https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles/my-first-octahedron/so-red.png)

지금 하고 있는 생각을 맞춰보겠다:

> 이건 팔면체가 아니라 마름모잖아 😳

일단 결론부터 말하자면, 이건 팔면체가 맞다. 정확히 말하면, 다음과 같은 두 가지 특수한 상황에 놓여 있는 팔면체다.

- 팔면체의 중심은 `(0, 0, -400)`에 놓여 있고, 카메라는 `(0, 0, 0)` 에 놓여 있다.  우리가 정의한 카메라의 시점은 z축을 따라 팔면체의 정중앙을 뚫고 지나가고 있다.
- `MeshBasicMaterial`은 빛과 상호작용을 하지 않는 Material 이라고 했다.  실제로 우리는 공간에 빛을 정의조차 하지 않았다.

빛의 부재는 곧 공간에서의 심도의 부재를 의미한다. 심도가 없는, 즉 한 축이 무의미해진 3D는 2D로 나타난다. 우리가 원했던 것은 2D 같은 3D가 아니라 3D다운 3D이므로, 이제 이 팔면체를 실제로 3D 공간의 물체와 같아 보이도록 만들어 보자.

---

# 빛과 질감
먼저, 이 공간에 심도를 심어보자. 위에서 잠깐 힌트를 줬듯이 이 작업은 두 단계로 나눌 수 있다.

- 공간에 빛을 추가한다.
- 팔면체가 빛과 상호작용하도록 한다.

먼저 빛을 추가해보자. 모든 광원의 생성자는 기본적으로 색깔(`color`)와 세기(`intensity`)의 두 인자를 받는다. three.js는 공간 전체를 밝히는 `AmbientLight`, 특정 방향으로 뻗어나가는 `DirectionalRight` 등 다양한 종류의 광원을 제공한다. 이 글에서는 가장 기본적인 광원 중 하나인 `PointLight`를 사용하겠다.

> A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.

[공식 문서](https://threejs.org/docs/index.html#api/lights/Light)의 설명에서 알 수 있듯, `PointLight`는 마치 전구처럼 한 점에서 시작해 모든 방향으로 뻗어나가는 광원을 표현하기 위해 사용된다.

```js
const pointLight = new PointLight(0xFFFFFF, 0.5)

pointLight.position.x = 100
pointLight.position.y = 100
pointLight.position.z = 30

scene.add(pointLight)
```

백색 광을 정의하고, 위치를 잡아준 뒤 공간에 빛을 더한다.  이 시점에서는 화면에 아무런 변화가 없는데, 이는 아직까지도 팔면체의 표면이 빛과 상호작용을 전혀 하지 않기 때문이다.

이제 Material을 변경 해보자. 짐작했겠지만, three.js 에서는 빛과 상호작용하는 표면 중 자주 쓰이는 표면 모델 몇 가지를 기본적으로 제공한다. 그 중 여기에서는 [람베르트 반사율](https://en.wikipedia.org/wiki/Lambertian_reflectance)을 갖는 물체의 표면을 나타내는 `MeshLambertMaterial`를 이용해보겠다. 기존에 작성된 코드에서 `material`의 정의를 아래와 같이 변경해보자.

```js
const material = new THREE.MeshLambertMaterial({ color: 0xFF3030 })
```

이제 아래와 같은 화면을 볼 수 있을 것이다.

![거의 완성된 모습](https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles/my-first-octahedron/almost-done.png)


앞서 생성한 빛을 `(100, 100, 30)`에 두었는데, 이는 우측 상단, 모니터를 약간 뚫고 나온 곳에 위치하는 점이다. 실제로 더 많은 빛을 받을 우측 상단은 더 밝은 색을 갖는 반면 좌측 하단은 빛을 거의 받지 못해 까맣게 보이는 것을 확인할 수 있다.

> 아직 나한테는 평면으로 보이는데?

그럼 마지막으로 이 팔면체가 삼차원 상에서 그려졌다는 것을 보다 명확히 하기 위해, 한 번 회전시켜보자.

# 움직임
브라우저에서는 [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 함수를 사용해 매끄러운 애니메이션을 그려낼 수 있다. 이 함수는 콜백 함수를 인자로 받고, 한 프레임을 할당받아서 인자로 받은 콜백 함수를 실행한다. 앞서 적었던 `renderer.render(scene, camera)` 라인을 다음으로 교체한다.

```js
function update () {
  const speed = Math.random() / 20
  octahedron.rotation.x += speed
  octahedron.rotation.y += speed
  octahedron.rotation.z += speed
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

requestAnimationFrame(update)
```

매 프레임마다 0 ~ 0.05 사이의 값을 임의로 정한 뒤, x, y, z 축마다 해당 값만큼의 회전을 준다. 그 뒤에 `scene`을 다시 그리고, 자기 자신을 `requestAnimationFrame` 함수의 인자로 다시 넘겨 호출하는 내용이다.

전혀 배경 지식이 없는 사람도 이 글만 읽고도 대부분의 과정을 이해할 수 있도록 적기 위해 노력하느라 무척 길어졌지만,  실제 코드는 백 줄이 채 되지 않을 정도로 간단하다. 이 과정까지 전부 마쳤다면 글 맨 처음에 나왔던, 그리고 지금 이 사이트에서 돌아가고 있는 것과 같은, 회전하고 있는 버건디 색의 팔면체를 얻어낼 수 있다.

전체 코드와 동작하는 모습은 [코드펜](https://codepen.io/heejongahn/full/awYGzq/)에서 확인해 볼 수 있다.

---

# 맺으며
이 글을 통해 3D 그래픽스에 대해 전혀 문외한이던 내가 홈페이지에 팔면체를 그려내기까지의 여정을 전부 담아 보았다.  나와 같은 위치에 있는 사람을 위해 내가 궁금했던 점을 따로 찾아보지 않아도 알 수 있도록 최대한 자세히 적으려 노력했는데, 그 때문에 너무 쉽고 장황한 글이 되지는 않았는지 걱정도 된다. 개인적으로는 글을 적으면서 애매하게 알고 있다고 생각했던 개념을 보다 가다듬을 수 있어 좋았다.

앞으로 어떤 커리어를 갖고 싶은지 누가 물었을 때, 뭐가 될지는 모르겠지만 아마 웹에서 무언가를 할 것 같고, 그래픽스는 안 건드릴 것 같다는 식으로 대답했던 적이 있다. 그만큼 그래픽스는 나에게 있어 멀고 또 어렵게 느껴지던 주제였다. 그런 내가, 비록 지극히 간단한 형태이긴 해도 어떤 목표를 세운 뒤 스스로 정한 시간 내에 구현 해 냈다는게 즐거웠다. 자신감이 조금 생기는 듯도 했다.

무엇보다도 스스로 내가 할 수 있는 일, 또 내가 재미있다고 느끼는 일에 섣불리 한계를 정할 때 결국 손해 보는 건 나뿐이라는 간단한 이치를 다시 한 번 체감할 수 있었다.

# 다음 단계
주말 동안 다면체를 올려 보겠다는 목표 자체는 달성했지만, 지금 상태는 시작에 불과하다고 생각한다. 앞으로 시도해보고 싶은 이런 저런 목표들이 있다. 예를 들자면 다음과 같다.

- 마우스 / 터치 이벤트에 적절히 반응하는 인터랙션 추가
- 팔면체가 사면체, 큐브 등으로 모양을 바꾸어가는 애니메이션 추가
- 텍스쳐를 입히고 보다 정교한 Material을 이용해 나무, 쇠 같은 느낌 구현
- 그 외에 여러 방법으로 더 이쁘게 만들기

더 좋은 생각이 있으면 내게 제보 해 준다면 감사하겠다. 한 번에 엄청난 격변을 이루어내기보다 천천히 조그만 부분씩 실험 해 볼 생각이다.

# 감사의 말
마지막으로, three.js를 처음 접하고 큰 도움을 받았던 [블로그 포스트](https://aerotwist.com/tutorials/getting-started-with-three-js/)의 저자 [Paul Lewis](https://twitter.com/aerotwist), 그리고 홈페이지에 팔면체를 그리고 그 과정을 이렇게 글로 옮기며 많은 가르침과 도움을 준 [김지현](https://hyeon.me)과 [최종찬](https://0xabcdef.com/)에게 감사를 전한다.

---

글을 공유하고자 하실 때에는 본문을 복사/붙여넣기 하는 대신 링크를 남겨주십시오. 이 글에 대해 남기고 싶은 코멘트나 오류 지적, 글쓴이에게 하고 싶은 말 등은 [메일을 통해](mailto:heejongahn@gmail.com?subject=나의 버건디 팔면체 : Three.js를 통한 3D 그래픽스 입문기 오류 제보) 제보해 주시면 감사하겠습니다.

긴 글을 읽어주셔서 감사합니다.
