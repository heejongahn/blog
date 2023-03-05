import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { HTMLContent } from "../components/Content";
import styled from "styled-components";
import PageHelmet from "../components/PageHelmet";
import { formatDate } from "../utils";
import { Review, ReviewType } from "../types";
import ShareLinks from "../components/ShareLinks";
import { Stars } from "../components/Review/Stars";
import { TypeBadge } from "../components/Review/TypeBadge";
import ImageLink from "../components/Review/ImageLink";

interface Props {
  content: any;
  title: string;
  type: ReviewType;
  date: string;
  stars: number;
  link: string;
  image: string;
}

export const BlogReviewTemplate = ({
  content,
  title,
  type,
  date,
  stars,
  link,
  image,
}: Props) => {
  return (
    <Wrapper>
      <TopWrapper>
        <StyledImageLink alt={title} link={link} image={image} />
        <TextWrapper>
          <Title>{title}</Title>
          <Extra>
            <TypeBadge type={type} />
            <Stars stars={stars} />
          </Extra>
          <PublishedDate>{date}</PublishedDate>
        </TextWrapper>
      </TopWrapper>
      <StyledHTMLContent content={content} />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  margin-bottom: 20px;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StyledImageLink = styled(ImageLink)`
  width: 120px;
  margin-right: 24px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Extra = styled.div`
  margin: 16px 0;

  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;

const PublishedDate = styled.time`
  font-size: 12px;
`;

const BlogReview = ({ data }: { data: { markdownRemark: Review } }) => {
  const { markdownRemark: review } = data;
  const { frontmatter, fields } = review;
  const { name, title, type, link, stars, image } = frontmatter;

  const nameString = `『${name}』`;
  const titleString =
    title.length > 0 ? `${title} – ${nameString}` : nameString;

  const url = `https://ahnheejong.name${fields.slug}`;

  return (
    <Layout>
      <PageHelmet title={titleString} url={url} />
      <BlogReviewTemplate
        content={review.html}
        date={formatDate(review.frontmatter.date)}
        title={titleString}
        stars={stars}
        type={type}
        link={link}
        image={image}
      />
      <ShareLinks title={titleString} slug={review.fields.slug} />
    </Layout>
  );
};

export default BlogReview;

export const pageQuery = graphql`
  query ReviewByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(truncate: true, format: HTML, pruneLength: 1000)
      fields {
        slug
      }
      frontmatter {
        type
        name
        title
        date
        stars
        link
        image
        templateKey
        date
      }
    }
  }
`;

const StyledHTMLContent = styled(HTMLContent)`
  margin-top: 3em;
`;
