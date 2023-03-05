import {
  faGamepad,
  faBook,
  faFilm,
  faNewspaper,
  faTv,
  faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";
import { HTMLAttributes } from "react";
import styled from "styled-components";

import { ReviewType } from "../../types";
import Icon from "../Icon";

interface Props extends HTMLAttributes<HTMLDivElement> {
  type: ReviewType;
}

function getIconForType({ type }: { type: ReviewType }) {
  switch (type) {
    case "Article": {
      return faNewspaper;
    }
    case "Book": {
      return faBook;
    }
    case "Game": {
      return faGamepad;
    }
    case "Movie": {
      return faFilm;
    }
    case "TV Series": {
      return faTv;
    }
    case "Music": {
      return faRecordVinyl;
    }
  }
}

function getLabelForType({ type }: { type: ReviewType }) {
  switch (type) {
    case "Article": {
      return "문서";
    }
    case "Book": {
      return "도서";
    }
    case "Game": {
      return "게임";
    }
    case "Movie": {
      return "영화";
    }
    case "TV Series": {
      return "TV 시리즈";
    }
    case "Music": {
      return "음악";
    }
  }
}

export function TypeBadge({ type, ...props }: Props) {
  console.log(type);
  return (
    <Wrapper {...props}>
      <Icon icon={getIconForType({ type })} size={14} />
      <Label>{getLabelForType({ type })}</Label>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;

  padding: 4px;
  border-radius: 4px;

  border: 1px solid #bababa;

  font-size: 12px;
`;

const Label = styled.div`
  font-weight: 700;
  margin-left: 6px;
`;
