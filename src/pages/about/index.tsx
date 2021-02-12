import React from "react";
import { parse } from "query-string";
import Layout from "../../components/Layout";
import styled from "styled-components";
import PageHelmet from "../../components/PageHelmet";

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

  white-space: pre-wrap;

  ul {
    margin-top: 1em;
    list-style-position: inside;
  }

  @media screen and (max-width: 800px) {
    white-space: normal;
    br {
      display: none;
    }
  }
`;

interface Props {
  location: Location;
}

type Language = "ko" | "en";
const languages: Language[] = ["ko", "en"];

interface State {
  language: Language;
}

const lineBreak = `\n`;

const previousCompanies = [
  {
    href: "https://toss.im/",
    title: {
      ko: "비바리퍼블리카",
      en: "Viva Republica",
    },
  },
  {
    href: "https://hyperconnect.com/",
    title: {
      ko: "하이퍼커넥트",
      en: "HyperConnect",
    },
  },
  {
    href: "https://www.spoqa.com",
    title: {
      ko: "스포카",
      en: "Spoqa",
    },
  },
];

export class AboutPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      language: "ko",
    };
  }

  componentDidMount() {
    const lang = (parse(this.props.location.search).lang || "").toLowerCase();
    this.setState({
      language: languages.indexOf(lang) !== -1 ? lang : "ko",
    });
  }

  render() {
    const { language } = this.state;

    return (
      <Layout>
        <PageHelmet
          title="ahn.heejong"
          description="한국에 살며 웹사이트를 만드는 안희종입니다."
          url="https://ahnheejong.name/about/"
        />
        <LanguageSelectors>
          {languages.map((lang) => (
            <LanguageSelector
              key={lang}
              onClick={() => this.setState({ language: lang })}
              selected={language === lang}
            >
              {lang}
            </LanguageSelector>
          ))}
        </LanguageSelectors>
        {language === "ko" ? (
          <Main id="main-ko">
            <Section>
              <SectionTitle>반갑습니다</SectionTitle>
              <SectionContent>
                한국에 살며 웹사이트를 만드는 안희종입니다.
                {lineBreak}
                아름다운 것에 반하는 이들에게 반합니다.
                {lineBreak}
                맥주, 책과 웹을 사랑합니다.
                {lineBreak}
                페미니스트입니다.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>가치</SectionTitle>
              <SectionContent>
                사랑하는 사람들과 보내는 시간을 가장 우선으로 둡니다.
                {lineBreak}
                세상은 경쟁보다 연대를 통해 발전한다고 믿습니다.
                {lineBreak}
                소수자와 사회적 약자를 비롯한 모든 구성원이 동등하게 대우받는
                사회를 바랍니다.
                {lineBreak}
                쓸모없어 보이는 일에 쏟는 시간의 중요성을 잊지 않으려 늘
                노력합니다.
                {lineBreak}
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>일</SectionTitle>
              <SectionContent>
                {previousCompanies
                  .map(({ href, title }) => (
                    <Anchor key={title.ko} target="_blank" href={href}>
                      {title.ko}
                    </Anchor>
                  ))
                  .reduce((accm, curr) => {
                    const pre = accm.length === 0 ? [] : [...accm, ", "];
                    return [...pre, curr];
                  }, [])}
                에서 일했습니다.
                {lineBreak}
                지금은{" "}
                <a href="https://flex.team" target="_blank">
                  플렉스팀
                </a>
                에서 일합니다.
                {lineBreak}
                강력한 타입 시스템을 가진 언어로 작업하는 것을 선호합니다.
                {lineBreak}
                요즘은 개발과 디자인, 두 세계를 잇는 데에 관심이 많습니다.
                {lineBreak}더 자세한 내용은{" "}
                <Anchor href="/resume" target="_blank">
                  이력서
                </Anchor>
                를 참고하세요.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>관심사</SectionTitle>
              <SectionContent>
                일을 안 할 때는 술을 마시거나, 책을 읽거나, 글을 씁니다.
                {lineBreak}술 중에서도 맥주, 맥주 중에서도 스타우트를 가장
                좋아합니다.
                {lineBreak}
                책은 가리지 않고 읽으려 노력하지만 읽는 책 열 권 중 아홉 권은
                문학입니다.
                {lineBreak}
              </SectionContent>
            </Section>
          </Main>
        ) : (
          <Main id="main-en">
            <Section>
              <SectionTitle>welcome</SectionTitle>
              <SectionContent>
                good to see you! i'm ahn heejong. {lineBreak}i live in south
                korea and i make websites. i am:
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
                {lineBreak} i believe solidarity, not competition, moves the
                world forward.
                {lineBreak} i hope for the society where everyone is treated
                equally.
                {lineBreak} i try to remember the virtue of spending time on
                seemingly useless things.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>work</SectionTitle>
              <SectionContent>
                i worked at{" "}
                {previousCompanies
                  .map(({ href, title }) => (
                    <Anchor key={title.en} target="_blank" href={href}>
                      {title.en}
                    </Anchor>
                  ))
                  .reduce((accm, curr) => {
                    const pre =
                      accm.length === 0
                        ? []
                        : [
                            ...accm,
                            accm.length + 1 === previousCompanies.length
                              ? ", and "
                              : ", ",
                          ];
                    return [...pre, curr];
                  }, [])}
                .{lineBreak}
                i'm currently working at{" "}
                <a href="https://flex.team" target="_blank">
                  flex team
                </a>
                .{lineBreak}i prefer languages which are powered by a smart type
                system.
                {lineBreak}
                nowadays, i'm deeply into bridging two worlds: programming and
                design.
                {lineBreak}
                See{" "}
                <Anchor href="/resume" target="_blank">
                  resume
                </Anchor>{" "}
                for further details.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>interests</SectionTitle>
              <SectionContent>
                i drink, read, listen to music or write during my free time.
                {lineBreak}i prefer beer among all alcoholic drinks, and stout
                among all beers.
                {lineBreak}i try not to be picky on genres, but mostly end up
                with novels somehow.
              </SectionContent>
            </Section>
          </Main>
        )}
      </Layout>
    );
  }
}

export default AboutPage;
