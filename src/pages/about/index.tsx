import React from "react";
import Layout from "../../components/Layout";
import styled from "styled-components";

const LanguageSelectors = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageSelector = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 0.5rem;

  ${(props: { selected: boolean }) => (props.selected ? "color: red;" : "")};
`;

const Anchor = styled.a``;

const Main = styled.main``;

const Section = styled.section``;

const SectionTitle = styled.h2`
  margin: 1em 0;
`;

const SectionContent = styled.div`
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.8;

  ul {
    margin-top: 1em;
    list-style-position: inside;
  }

  @media screen and (max-width: 800px) {
    br {
      display: none;
    }
  }
`;

interface Props {}

type Language = "KO" | "EN";

interface State {
  language: Language;
}

export class AboutPageTemplate extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { language: "KO" };
  }

  render() {
    return (
      <>
        <LanguageSelectors>
          {(["KO", "EN"] as Language[]).map(lang => (
            <LanguageSelector
              key={lang}
              onClick={() => this.setState({ language: lang })}
              selected={this.state.language === lang}
            >
              {lang}
            </LanguageSelector>
          ))}
        </LanguageSelectors>
        {this.state.language === "KO" ? (
          <Main id="main-ko">
            <Section>
              <SectionTitle>반갑습니다</SectionTitle>
              <SectionContent>
                서울에 살며 웹사이트를 만드는 안희종입니다.
                <br />
                아름다운 것에 반하는 이들에게 반합니다.
                <br />
                맥주, 책과 웹을 사랑합니다.
                <br />
                페미니스트입니다.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>가치</SectionTitle>
              <SectionContent>
                사랑하는 사람들과 보내는 시간을 가장 우선으로 둡니다.
                <br />
                세상은 경쟁보다 연대를 통해 발전한다고 믿습니다.
                <br />
                소수자와 사회적 약자를 비롯한 모든 구성원이 동등하게 대우받는
                사회를 바랍니다.
                <br />
                쓸모없어 보이는 일에 쏟는 시간의 중요성을 잊지 않으려 늘
                노력합니다.
                <br />
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>일</SectionTitle>
              <SectionContent>
                <Anchor target="_blank" href="https://toss.im/">
                  Toss
                </Anchor>
                를 만드는 비바리퍼블리카에서 UI 프로그래머로 일하고 있습니다.
                <br />
                강력한 타입 시스템을 가진 언어로 작업하는 것을 선호합니다.
                <br />
                요즘은 개발과 디자인, 두 세계를 잇는 데에 관심이 많습니다.
                <br />
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>관심사</SectionTitle>
              <SectionContent>
                일을 안 할 때는 술을 마시거나, 책을 읽거나, 글을 씁니다.
                <br />술 중에서도 맥주, 맥주 중에서도 스타우트를 가장
                좋아합니다. <br />
                책은 가리지 않고 읽으려 노력하지만 읽는 책 열 권 중 아홉 권은
                문학입니다.
                <br />
              </SectionContent>
            </Section>
          </Main>
        ) : (
          <Main id="main-en">
            <Section>
              <SectionTitle>welcome</SectionTitle>
              <SectionContent>
                good to see you! i'm ahn heejong. <br />i live in seoul and i
                make websites. i am:
                <ul>
                  <li>admirer of those who admire beautiful things.</li>
                  <li>beer, book and triple double u enthusiast.</li>
                  <li>feminist.</li>
                </ul>
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>value</SectionTitle>
              <SectionContent>
                i put the time spent with my beloved ones in my top priority.
                <br /> i believe solidarity, not competition, moves the world
                forward.
                <br /> i hope for the society where everyone is treated equally.
                <br /> i try to remember the virtue of spending time on
                seemingly useless things.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>work</SectionTitle>
              <SectionContent>
                i'm working at Viva Republica as a UI developer, making{" "}
                <Anchor target="_blank" href="https://toss.im/">
                  Toss
                </Anchor>
                .<br />i prefer languages which are powered by a smart type
                system.
                <br />
                nowadays, i'm deeply into bridging two worlds: programming and
                design.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>interests</SectionTitle>
              <SectionContent>
                i drink, read, listen to music or write during my free time.
                <br />i prefer beer among all alcoholic drinks, and stout among
                all beers.
                <br />i try not to be picky on genres, but mostly end up with
                novels somehow.
              </SectionContent>
            </Section>
          </Main>
        )}
      </>
    );
  }
}

const AboutPage = () => {
  return (
    <Layout>
      <AboutPageTemplate />
    </Layout>
  );
};

export default AboutPage;
