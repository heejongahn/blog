import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import Navbar from "../components/Navbar";
import "./all.scss";

const TemplateWrapper: React.SFC = ({ children }) => (
  <Wrapper>
    <Helmet title="Home | Gatsby + Netlify CMS" />
    <Navbar />
    <Content>{children}</Content>
  </Wrapper>
);

export default TemplateWrapper;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 24px;
`;

const Content = styled.div`
  margin-top: 80px;
`;
