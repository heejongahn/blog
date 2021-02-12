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
                환영합니다! 저는 안희종입니다.
                {lineBreak}기술을 통해 가치를 만듭니다.
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
                임팩트에 의해 동기부여되는 소프트웨어 엔지니어입니다.
                {lineBreak}
                <a href="https://flex.team" target="_blank">
                  플렉스팀
                </a>
                에서 일합니다.
                {lineBreak}
                {previousCompanies
                  .map(({ href, title }) => (
                    <Anchor key={title.ko} target="_blank" href={href}>
                      {title.ko}
                    </Anchor>
                  ))
                  .reduce((accm, curr) => {
                    return accm.length === 0 ? [curr] : [...accm, ", ", curr];
                  }, [])}
                에서 일했습니다.
                {lineBreak}더 자세한 내용은{" "}
                <Anchor href="/resume" target="_blank">
                  이력서
                </Anchor>
                를 참고하세요.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>질문</SectionTitle>
              <SectionContent>
                무엇이 사람을 진정 자유롭게 만드는 걸까?
              </SectionContent>
            </Section>
          </Main>
        ) : (
          <Main id="main-en">
            <Section>
              <SectionTitle>welcome</SectionTitle>
              <SectionContent>
                good to see you! i'm ahn heejong.{lineBreak}i live in south
                korea and i create value with technology.{lineBreak}i am:
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
                i define myself as an impact-driven software engineer.
                {lineBreak}
                i'm currently working at{" "}
                <a href="https://flex.team" target="_blank">
                  flex team
                </a>
                .{lineBreak}
                previousely, i worked at{" "}
                {previousCompanies
                  .map(({ href, title }) => (
                    <Anchor key={title.en} target="_blank" href={href}>
                      {title.en}
                    </Anchor>
                  ))
                  .reduce((accm, curr) => {
                    return accm.length === 0 ? [curr] : [...accm, ", ", curr];
                  }, [])}
                .{lineBreak}
                see{" "}
                <Anchor href="/resume" target="_blank">
                  resume
                </Anchor>{" "}
                for further details.
              </SectionContent>
            </Section>
            <Section>
              <SectionTitle>question</SectionTitle>
              <SectionContent>what makes a person truly free?</SectionContent>
            </Section>
          </Main>
        )}
      </Layout>
    );
  }
}

export default AboutPage;
