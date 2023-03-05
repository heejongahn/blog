import { Link } from "gatsby";
import styled from "styled-components";
import { Post } from "../types";
import Layout from "../components/Layout";
import PageHelmet from "../components/PageHelmet";

interface Props {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: Post;
      }>;
    };
  };
}

const IndexPage = ({ data }: Props) => {
  return (
    <Layout>
      <PageHelmet
        title="ahn.heejong"
        description="한국에 살며 웹사이트를 만드는 안희종입니다."
        url="https://ahnheejong.name/"
      />
      <section className="section">
        <Summary>
          <Intro>
            <IntroTitle>환영합니다!</IntroTitle>
            안희종
            <small>
              <i>ahn heejong</i>
            </small>
            의 블로그에 잘 오셨습니다. 대문을 어떻게 새로 단장할지 고민하고
            있습니다. 아이디어가 있으시다면{" "}
            <a href="mailto:heejongahn@gmail.com" target="_blank">
              메일
            </a>{" "}
            보내주시면 감사하겠습니다.
            <br />
            <br />
            새로 올라오는 글을 받아보고 싶으시다면{" "}
            <a href="/feed.xml" target="_blank">
              RSS 피드
            </a>
            를 구독하세요.
          </Intro>
        </Summary>
        <MenuList>
          <MenuListItem>
            <Link to="/articles">길고 짧은 글 읽기</Link>
          </MenuListItem>
          <MenuListItem>
            <Link to="/reviews">리뷰 읽기</Link>
          </MenuListItem>
          <MenuListItem>
            <Link to="/about">소개 읽기</Link>
          </MenuListItem>
        </MenuList>
      </section>
    </Layout>
  );
};

export default IndexPage;

const Summary = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;

  padding: 12px;
  border-radius: 4px;
  border: 1px solid #eaebec;
  line-height: 1.6;
`;

const Intro = styled.h1`
  font-size: 1em;
  font-weight: normal;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const IntroTitle = styled.div`
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 1.2em;
`;

const MenuList = styled.ul`
  margin: 12px 0;
  list-style-position: inside;
`;

const MenuListItem = styled.li`
  margin: 12px 0;
`;
