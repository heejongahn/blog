import React from "react";
import { DiscussionEmbed } from "disqus-react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import styled from "styled-components";
import PageHelmet from "../components/PageHelmet";
import GatsbyLink from "gatsby-link";

interface Props {
  content: any;
  contentComponent: any;
  description: string;
  title: string;
  tags: string[];
}

export const BlogPostTemplate: React.SFC<Props> = ({
  content,
  contentComponent,
  description,
  tags,
  title
}) => {
  const PostContent = contentComponent || Content;

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <TagList>
        {tags.map(tag => (
          <Tag key={tag + `tag`}>
            <Link to={`/tags/${tag}/`}>{`#${tag}`}</Link>
          </Tag>
        ))}
      </TagList>
      <PostContent content={content} />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Description = styled.div`
  word-break: keep-all;
  overflow-wrap: break-word;
  margin-top: 1em;
`;

const TagList = styled.ul`
  margin-top: 0.5em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Tag = styled.li`
  list-style-type: none;
  font-size: 0.75em;
  margin-bottom: 4px;

  &:not(:last-child) {
    margin-right: 8px;
  }
`;

interface Post {
  id: string;
  html: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    [key: string]: any;
  };
}

const BlogPost: React.SFC<{
  data: { markdownRemark: Post; previous: Post | null; next: Post | null };
}> = ({ data }) => {
  const { markdownRemark: post, previous, next } = data;
  const url = `https://ahnheejong.name${post.fields.slug}`;
  const disqusConfig = {
    url,
    identifier: post.id,
    title: post.frontmatter.title
  };

  return (
    <Layout>
      <PageHelmet
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        url={url}
      />
      <BlogPostTemplate
        content={post.html}
        contentComponent={StyledHTMLContent}
        description={post.frontmatter.description}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
      <AdjacentArticles>
        {[previous, next].map(
          (adjacentArticle, i) =>
            adjacentArticle != null ? (
              <AdjacentArticle
                key={adjacentArticle.fields.slug}
                to={adjacentArticle.fields.slug}
              >
                <AdjacentArticleLabel>
                  {i === 0 ? "이전 글" : "다음 글"}
                </AdjacentArticleLabel>
                <AdjacentArticleTitle>
                  {adjacentArticle.frontmatter.title}
                </AdjacentArticleTitle>
              </AdjacentArticle>
            ) : null
        )}
      </AdjacentArticles>
      <DiscussionEmbed shortname="ahnheejong" disqusConfig={disqusConfig} />
    </Layout>
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID(
    $id: String!
    $previousId: String
    $hasPrevious: Boolean!
    $nextId: String
    $hasNext: Boolean!
  ) {
    markdownRemark(id: { eq: $id }) {
      id
      html
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

    previous: markdownRemark(id: { eq: $previousId })
      @include(if: $hasPrevious) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }

    next: markdownRemark(id: { eq: $nextId }) @include(if: $hasNext) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;

const AdjacentArticles = styled.div`
  display: flex;
  margin-bottom: 40px;

  @media screen and (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

const AdjacentArticle = styled(GatsbyLink)`
  flex: 1 1 50%;

  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eaebec;

  text-decoration: none;

  &:first-child {
    margin-right: 8px;
  }

  &:last-child {
    margin-left: 8px;
    text-align: right;
  }

  &:first-child:last-child {
    margin: 0;
  }

  @media screen and (max-width: 800px) {
    flex-basis: 100%;
    margin: 6px 0;
  }
`;

const AdjacentArticleLabel = styled.div`
  font-size: 0.825em;
  margin-bottom: 8px;
`;

const AdjacentArticleTitle = styled.strong``;

const StyledHTMLContent = styled(HTMLContent)`
  margin-top: 3em;

  p,
  li {
    word-break: keep-all;
    overflow-wrap: break-word;
    line-height: 1.8;
  }

  img {
    border-style: none;
  }

  svg:not(:root) {
    overflow: hidden;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }
  td,
  th {
    padding: 0;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
  }
  blockquote {
    margin: 0;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
    font-size: 12px;
  }
  pre {
    margin-top: 0;
    margin-bottom: 0;
    font: 12px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
  }

  > *:first-child {
    margin-top: 0 !important;
  }
  > *:last-child {
    margin-bottom: 0 !important;
  }

  iframe {
    width: 100%;
    margin-bottom: 24px;
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  table,
  pre {
    margin-top: 0;
    margin-bottom: 16px;
  }
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
  blockquote > :first-child {
    margin-top: 0;
  }
  blockquote > :last-child {
    margin-bottom: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    line-height: 1.25;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  h1 {
    padding-bottom: 0.3em;
    font-size: 2em;
  }
  h2 {
    padding-bottom: 0.3em;
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.25em;
  }
  h4 {
    font-size: 1em;
  }
  h5 {
    font-size: 0.875em;
  }
  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }

  ul,
  ol {
    padding-left: 2em;
  }

  li + li {
    margin-top: 0.25em;
  }
  dl {
    padding: 0;
  }
  dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
  }
  dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }
  table {
    display: block;
    width: 100%;
    overflow: auto;
  }
  table th {
    font-weight: 600;
  }
  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
  table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }
  table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
  img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
  }
  code {
    padding: 0;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    white-space: normal;
    overflow-wrap: break-word;
  }
  code::before,
  code::after {
    letter-spacing: -0.2em;
    content: "\00a0";
  }
  pre {
    word-wrap: normal;
  }
  pre > code {
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }
  .highlight {
    margin-bottom: 16px;
  }
  .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }
  .highlight pre,
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }
  pre code {
    display: inline;
    max-width: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }
  pre code::before,
  pre code::after {
    content: normal;
  }
  > :first-child {
    margin-top: 0;
  }
  > :last-child {
    margin-bottom: 0;
  }

  article,
  aside,
  nav,
  section {
    h1 {
      font-size: 2em;
    }
  }

  h2 {
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 18px;

    li {
      list-style-type: none;
      position: relative;

      &:before {
        position: absolute;

        content: "\\BB";
        left: -18px;
        top: 0;
      }
    }
  }
`;
