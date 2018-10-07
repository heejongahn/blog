import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PostItem, { PostList } from "../components/Post";
import styled from "styled-components";
import PageHelmet from "../components/PageHelmet";

class TagRoute extends React.Component<any> {
  render() {
    const { allMarkdownRemark } = this.props.data;

    const posts = allMarkdownRemark.edges;
    const tag = this.props.pageContext.tag;
    const totalCount = allMarkdownRemark.totalCount;

    return (
      <Layout>
        <PageHelmet
          title={`“${tag}” 태그 검색 결과`}
          description={`ahnheejong.name에서 “${tag}” 태그로 검색한 결과입니다.`}
          url={`https://ahnheejong.name/tags/${tag}`}
        />
        <section className="section">
          <Header>
            <TagName>{`“${tag}”`}</TagName>
            {`태그가 달린 글 (총 ${totalCount}편)`}
          </Header>
          <PostList>
            {posts.map(({ node: post }: any) => (
              <PostItem key={post.id} post={post} />
            ))}
          </PostList>
        </section>
      </Layout>
    );
  }
}

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`;

const Header = styled.h1`
  font-weight: normal;
  margin-bottom: 2em;
`;

const TagName = styled.strong`
  margin-right: 4px;
`;
