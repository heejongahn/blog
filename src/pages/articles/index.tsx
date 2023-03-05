import { graphql, Link } from "gatsby";
import styled from "styled-components";
import { Post } from "../../types";
import Layout from "../../components/Layout";
import PostItem, { PostList } from "../../components/Post";
import PageHelmet from "../../components/PageHelmet";

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
  const { edges: posts } = data.allMarkdownRemark;

  const now = new Date();

  return (
    <Layout>
      <PageHelmet
        title="ahn.heejong"
        description="한국에 살며 웹사이트를 만드는 안희종입니다."
        url="https://ahnheejong.name/articles"
      />
      <section className="section">
        <Summary>
          <Intro>
            <IntroTitle>길고 짧은 글</IntroTitle>
            처음엔 프로그래밍에 대해 자주 썼습니다. 직업으로서의 프로그래머를
            관둔 이후부터는, 아니 그 전부터도, 프로그래밍보다도 사람, 팀, 일상에
            대해 더 많이 적고 있습니다. 누구보다 미래의 자신을 가장 중요한
            독자로 생각합니다.
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
};

export default IndexPage;

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
            date
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
