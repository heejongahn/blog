import { ReactNode } from "react";
import styled from "styled-components";

import Navbar from "./Navbar";
import Footer from "./Footer";

import "./all.scss";

const TemplateWrapper = ({ children }: { children: ReactNode }) => (
  <Wrapper>
    <Navbar />
    <Content>{children}</Content>
    <Footer />
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
