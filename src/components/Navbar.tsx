import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const Navbar = () => (
  <Wrapper>
    <NavItem to="/" activeStyle={{ fontWeight: "bold" }}>
      ahn.heejong
    </NavItem>
    <NavItem to="/about" activeStyle={{ fontWeight: "bold" }}>
      about
    </NavItem>
  </Wrapper>
);

export default Navbar;

const Wrapper = styled.nav`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 42px;
  height: 60px;
  background-color: hsla(0, 0%, 100%, 0.8);

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  font-size: 1.25rem;
`;
