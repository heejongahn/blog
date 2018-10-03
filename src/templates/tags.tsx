import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PostItem from "../components/Post";
import styled from "styled-components";

class TagRoute extends React.Component<any> {
  render() {
    const { site, allMarkdownRemark } = this.props.data;

    const posts = allMarkdownRemark.edges;
    const tag = this.props.pageContext.tag;
    const title = site.siteMetadata.title;
    const totalCount = allMarkdownRemark.totalCount;

    return (
      <Layout>
        <section className="section">
          <Helmet title={`${tag} | ${title}`} />
          <Header>
            <TagName>{`“${tag}”`}</TagName>
            {`태그가 달린 글 (총 ${totalCount}편)`}
          </Header>
          <PostList>
            {posts.map(({ node: post }: any) => (
              <PostItem key={post.frontmatter.id} post={post} />
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
    site {
      siteMetadata {
        title
      }
    }
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
`;

const TagName = styled.strong`
  margin-right: 4px;
`;

const PostList = styled.ul`
  margin-top: 3em;
`;
