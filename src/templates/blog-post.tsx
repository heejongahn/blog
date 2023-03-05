import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import styled from "styled-components";
import PageHelmet from "../components/PageHelmet";
import { formatDate } from "../utils";
import ShareLinks from "../components/ShareLinks";

interface Props {
  content: any;
  contentComponent: any;
  description: string;
  title: string;
  date: string;
  tags: string[];
}

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  date,
}: Props) => {
  const PostContent = contentComponent || Content;

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Extra>
        <PublishedDate>{date}</PublishedDate>
        <ExtraDivider aria-hidden>·</ExtraDivider>
        <TagList>
          {tags.map((tag) => (
            <Tag key={tag + `tag`}>
              <Link to={`/tags/${tag}/`}>{`#${tag}`}</Link>
            </Tag>
          ))}
        </TagList>
      </Extra>
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
  margin-top: 12px;
`;

const Extra = styled.div`
  margin: 16px 0;

  display: flex;
  align-items: center;
  font-size: 0.75em;
`;

const PublishedDate = styled.time`
  display: block;
`;

const ExtraDivider = styled.div`
  margin: 0 6px;
`;

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Tag = styled.li`
  list-style-type: none;

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

const BlogPost = ({
  data,
}: {
  data: { markdownRemark: Post; previous: Post | null; next: Post | null };
}) => {
  const { markdownRemark: post, previous, next } = data;

  const url = `https://ahnheejong.name${post.fields.slug}`;

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
        date={formatDate(post.frontmatter.date)}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
      <ShareLinks title={post.frontmatter.title} slug={post.fields.slug} />
      <AdjacentArticles>
        {[previous, next].map((adjacentArticle, i) =>
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
        date
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

const AdjacentArticle = styled(Link)`
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

    &:first-child,
    &:last-child {
      margin: 6px 0;
    }
  }
`;

const AdjacentArticleLabel = styled.div`
  font-size: 0.825em;
  margin-bottom: 8px;
`;

const AdjacentArticleTitle = styled.strong``;

const StyledHTMLContent = styled(HTMLContent)`
  margin-top: 3em;
`;
