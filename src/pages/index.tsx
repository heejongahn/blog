import React from "react";
import { Link, graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../components/Layout";

interface Post {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: Date;
    description: string;
    body: string;
    tags: string[];
  };
}

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
        <section className="section">
          {/* TODO: 카테고리 */}
          <PostList>
            {posts.map(({ node: post }) => (
              <Post key={post.id}>
                <PostWrapper to={post.fields.slug}>
                  <PostTop>
                    <PostTitle>{post.frontmatter.title}</PostTitle>
                    <PublishedDate>{post.frontmatter.date}</PublishedDate>
                  </PostTop>
                  <Description>{post.frontmatter.description}</Description>
                  <TagList>
                    {post.frontmatter.tags.map(tag => (
                      <Tag key={tag}>{`#${tag}`}</Tag>
                    ))}
                  </TagList>
                </PostWrapper>
              </Post>
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

const Title = styled.h1``;

const PostList = styled.ol``;

const Post = styled.li`
  padding: 24px;

  transition: background-color 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  border-radius: 8px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &:nth-child(n + 2) {
    margin-top: 12px;
  }
`;

const PostWrapper = styled(Link)`
  text-decoration: none;
`;

const PostTop = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 24px;
`;

const PostTitle = styled.h2``;

const PublishedDate = styled.small`
  margin-left: 8px;
`;

const Description = styled.div``;

const TagList = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const Tag = styled.li`
  font-size: 0.75em;
  display: block;

  &:nth-child(n + 2) {
    margin-left: 0.5em;
  }
`;
