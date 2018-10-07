import React from "react";
import styled from "styled-components";

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 820px;
  margin: 40px auto 0;
`;

const Contact = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ContactItem = styled.div`
  &:nth-child(n + 2) {
    margin-left: 8px;
  }

  @media screen and (max-width: 800px) {
    &:nth-child(n + 2) {
      margin-left: 0;
    }
  }
`;

const ContactLink = styled.a`
  font-size: 0.8em;
  line-height: 1.5;
`;

const MadeWith = styled.small`
  margin-top: 12px;
`;

const MadeWithComponent = styled.a`
  margin: 0 4px;
`;

const Footer: React.SFC = () => (
  <Wrapper>
    <Contact>
      <ContactItem>
        <ContactLink href="mailto:heejongahn@gmail.com">
          heejongahn@gmail.com
        </ContactLink>
      </ContactItem>
      <ContactItem>
        <ContactLink href="https://twitter.com/heejongahn">twitter</ContactLink>
      </ContactItem>
      <ContactItem>
        <ContactLink href="https://www.linkedin.com/in/heejongahn/">
          linkedin
        </ContactLink>
      </ContactItem>
    </Contact>
    <MadeWith>
      made with
      <MadeWithComponent target="_blank" href="https://www.gatsbyjs.org/">
        Gatsby
      </MadeWithComponent>
      +
      <MadeWithComponent target="_blank" href="https://www.netlify.com/">
        Netlify
      </MadeWithComponent>
      + 🍷 (
      <a target="_blank" href="https://github.com/heejongahn/blog">
        source code
      </a>
      )
    </MadeWith>
  </Wrapper>
);

export default Footer;
