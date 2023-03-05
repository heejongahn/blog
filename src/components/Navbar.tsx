import { Link } from "gatsby";
import styled from "styled-components";
import {
  faInfo,
  faCommentDots,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import Icon from "./Icon";

const Navbar = () => {
  return (
    <Wrapper>
      <NavItem
        to="/"
        style={{ fontWeight: "bold", opacity: 1 }}
        activeClassName="nav-active"
      >
        ahn.heejong
      </NavItem>
      <Right>
        <NavItem
          to="/articles"
          activeClassName="nav-active"
          partiallyActive
          aria-label="블로그"
        >
          <Icon icon={faNewspaper} />
        </NavItem>
        <NavItem
          to="/reviews"
          activeClassName="nav-active"
          partiallyActive
          aria-label="리뷰"
        >
          <Icon icon={faCommentDots} />
        </NavItem>
        <NavItem to="/about" activeClassName="nav-active" aria-label="소개글">
          <Icon icon={faInfo} />
        </NavItem>
      </Right>
    </Wrapper>
  );
};

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

  @media screen and (max-width: 800px) {
    padding: 0 24px;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  font-size: 1.25rem;
  opacity: 0.6;

  &:active,
  &:focus {
    color: initial;
  }

  &:hover {
    opacity: 1;
  }

  &.nav-active {
    opacity: 1;
  }

  &.nav-active:hover {
    color: initial;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 24px;
  }
`;
