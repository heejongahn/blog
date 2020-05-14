import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../components/Layout";
import PostItem, { Post, PostList } from "../components/Post";
import PageHelmet from "../components/PageHelmet";
import GatsbyLink from "gatsby-link";

interface Props {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: Post;
      }>;
    };
  };
}

export default class IndexPage extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    const now = new Date();
    const today = `${now.getFullYear()}년 ${now.getMonth() +
      1}월 ${now.getDate()}일 현재`;

    return (
      <Layout>
        <PageHelmet
          title="ahn.heejong"
          description="한국에 살며 웹사이트를 만드는 안희종입니다."
          url="https://ahnheejong.name/"
        />
        <section className="section">
          <GalpiAd href="https://web.galpi.world" target="_blank">
            광고 : 독후감 관리 앱 “갈피” 를 만들었습니다. 제가 쓰려고 만들기
            시작했는데, 이제서야 제가 쓰고 싶은 수준까지 왔습니다. 많이 써
            보시고 의견 주시면 감사하겠습니다.
          </GalpiAd>
          <Summary>
            <Intro>
              <IntroTitle>환영합니다!</IntroTitle>
              안희종
              <small>
                <i>ahn heejong</i>
              </small>
              의 블로그에 잘 오셨습니다. 프로그래밍과 삶에 대한 생각을 이 곳에
              기록으로 남기고 있습니다. {today} 총 {posts.length}
              편의 글이 올라와 있습니다.
              <LineBreak />
              <LineBreak />
              새로 올라오는 글을 받아보고 싶으시다면{" "}
              <a href="/feed.xml" target="_blank">
                RSS 피드
              </a>
              를 구독하세요. 저에 대해 궁금하시다면{" "}
              <GatsbyLink to="/about">소개 페이지</GatsbyLink>에 들러보세요.
            </Intro>
          </Summary>
          {/* TODO: 카테고리 */}
          <PostList>
            {posts.map(({ node: post }) => (
              <PostItem key={post.id} post={post} />
            ))}
          </PostList>
        </section>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            description
            tags
          }
        }
      }
    }
  }
`;

const GalpiAd = styled.a`
  display: block;

  padding: 12px;
  border-radius: 4px;
  border: 2px dashed #888888;
  line-height: 1.6;

  font-weight: bold;
  margin-bottom: 24px;
`;

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

const LineBreak = styled.br`
  margin: 12px 0;
`;
