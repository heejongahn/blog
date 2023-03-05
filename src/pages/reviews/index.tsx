import { graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../../components/Layout";
import ReviewItem, { ReviewList } from "../../components/Review";
import PageHelmet from "../../components/PageHelmet";
import { Review } from "../../types";

interface Props {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: Review;
      }>;
    };
  };
}

const IndexPage = ({ data }: Props) => {
  const { edges: reviews } = data.allMarkdownRemark;

  return (
    <Layout>
      <PageHelmet
        title="ahn.heejong"
        description="한국에 살며 웹사이트를 만드는 안희종입니다."
        url="https://ahnheejong.name/reviews"
      />
      <section className="section">
        <Summary>
          <Intro>
            <IntroTitle>리뷰</IntroTitle>
            회사에서, 또는 애인, 가족, 친구, 고양이들과 함께 보내는 시간 말고는
            주로 다양한 컨텐츠를 소비하며 보냅니다. 게임, 음악, 영화, 책 등
            매체를 가리지 않고 섭취하려 노력합니다.
          </Intro>
        </Summary>
        <ReviewList>
          {reviews.map(({ node: review }) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ReviewList>
      </section>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "review" } } }
    ) {
      edges {
        node {
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
    }
  }
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
