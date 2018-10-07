import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../components/Layout";
import PostItem, { Post, PostList } from "../components/Post";
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

export default class IndexPage extends React.Component<Props> {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Layout>
        <PageHelmet
          title="ahn.heejong"
          description="서울에 살며 웹사이트를 만드는 안희종입니다."
          url="https://ahnheejong.name/"
        />
        <section className="section">
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
