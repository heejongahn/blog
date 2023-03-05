import styled from "styled-components";

const ShareLinks = ({ slug, title }: { slug: string; title: string }) => {
  const shareTitle = encodeURIComponent(`「${title}」`);

  const url = `https://ahnheejong.name${slug}`;
  const encodedUrl = encodeURIComponent(url);

  return (
    <Wrapper>
      <ShareLink
        href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`}
      >
        Twitter에 공유하기
      </ShareLink>
      <ShareLink
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
      >
        Facebook에 공유하기
      </ShareLink>
    </Wrapper>
  );
};

export default ShareLinks;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 60px 0;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const ShareLink = styled.a.attrs({ target: "_blank" })`
  text-align: center;

  &:not(:last-child) {
    margin-right: 24px;

    @media screen and (max-width: 800px) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
`;
