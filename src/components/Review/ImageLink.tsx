import styled from "styled-components";
import { HTMLAttributes } from "react";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icon";

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  alt: string;
  link: string;
  image: string;
}

const ImageLink = ({ alt, link, image, ...props }: Props) => {
  return (
    <Wrapper href={link} target="_blank" {...props}>
      <Img src={image} alt={alt} />
      <Overlay>
        <Icon
          style={{ position: "absolute", right: 12, bottom: 12 }}
          icon={faArrowUpRightFromSquare}
        />
      </Overlay>
    </Wrapper>
  );
};

export default ImageLink;

const Overlay = styled.div`
  transition: opacity 0.15s ease-in-out;
  opacity: 0;

  background: rgba(255, 255, 255, 0.6);
  position: absolute;
  inset: 0;
`;

const Wrapper = styled.a`
  position: relative;

  margin-right: 24px;

  display: flex;

  border-radius: 6px;
  border: 1px solid black;
  overflow: hidden;

  flex-shrink: 0;
  flex-grow: 0;

  &:hover {
    ${Overlay} {
      opacity: 1;
    }
  }
`;

const Img = styled.img`
  width: 100%;
`;
