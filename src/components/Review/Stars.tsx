import { HTMLAttributes } from "react";
import styled from "styled-components";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";

import Icon from "../Icon";

interface Props extends HTMLAttributes<HTMLDivElement> {
  stars: number;
}

export function Stars({ stars, ...props }: Props) {
  return (
    <Wrapper aria-label={`10점 만점에 ${stars}점`} {...props}>
      {[1, 2, 3, 4, 5].map((score) => {
        const isFull = score * 2 <= stars;
        const isHalfFull = score * 2 - 1 === stars;

        return (
          <Icon
            size={16}
            icon={isHalfFull ? faStarHalfStroke : isFull ? faStar : faEmptyStar}
          />
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 8px;

  & > *:not(:last-child) {
    margin-right: 4px;
  }
`;
