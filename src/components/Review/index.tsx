import styled from "styled-components";
import { Link } from "gatsby";
import { Stars } from "./Stars";

import { formatDate } from "../../utils";
import { Review } from "../../types";
import { TypeBadge } from "./TypeBadge";
import ImageLink from "./ImageLink";

interface Props {
  review: Review;
}

const ReviewItem = ({ review }: Props) => {
  const { fields, frontmatter } = review;
  const { slug } = fields;
  const { type, name, title = "", date, stars, link, image } = frontmatter;

  const nameString = `『${name}』`;
  const titleString =
    title.length > 0 ? `${title} – ${nameString}` : nameString;

  return (
    <Wrapper key={slug}>
      <StyledImageLink link={link} image={image} alt={nameString} />
      <ReviewWrapper to={slug}>
        <Top>
          <TypeBadge type={type} />
          <Stars stars={stars} />
        </Top>
        <Title>{titleString}</Title>
        <PublishedDate>{formatDate(date)}</PublishedDate>
      </ReviewWrapper>
    </Wrapper>
  );
};

export default ReviewItem;

const Wrapper = styled.li`
  position: relative;
  padding: 12px 24px;

  display: flex;
  align-items: stretch;

  list-style-type: none;

  @media screen and (max-width: 800px) {
    padding: 12px;
  }
`;

const StyledImageLink = styled(ImageLink)`
  position: sticky;
  top: 120px;
  left: 0;

  width: 120px;
  flex-basis: 120px;
  margin-right: 24px;

  @media screen and (max-width: 800px) {
    width: 80px;
    flex-basis: 80px;
    margin-right: 12px;
  }
`;

const ReviewWrapper = styled(Link)`
  margin-top: 12px;

  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > *:not(:first-child) {
    margin-top: 12px;
  }

  @media screen and (max-width: 800px) {
    margin-top: 8px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;

const Title = styled.div`
  color: inherit;

  margin-top: 8px;
  margin-right: 8px;

  word-break: keep-all;
  overflow-wrap: break-word;

  font-size: 24px;
  font-weight: 700;

  @media screen and (max-width: 800px) {
    font-size: 16px;
  }
`;

const PublishedDate = styled.time`
  font-size: 16px;

  @media screen and (max-width: 800px) {
    font-size: 13px;
  }
`;

export const ReviewList = styled.ol`
  margin: 0 -24px;

  @media screen and (max-width: 800px) {
    margin: 0 -12px;
  }

  & > *:not(:first-child) {
    margin-top: 36px;
  }
`;
