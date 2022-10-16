import { useEffect } from "react";
import styled from "styled-components";
import PageHelmet from "../../components/PageHelmet";

const Spinner = styled.svg`
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;

  & .path {
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Circle = styled.circle`
  stroke: rgba(0, 0, 0, 0.8);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const docsUrl =
  "https://docs.google.com/document/d/1PhHZT5IF8kY3UeQzEIjawfairGsr2vtirkai8E8Hfak/edit";

export default function ResumePage() {
  useEffect(() => {
    window.location.href = docsUrl;
  }, []);

  return (
    <>
      <PageHelmet
        title="Heejong Ahn Resume"
        description="Impact Driven Software Engineer"
        url="https://ahnheejong.name/resume/"
      />
      <Spinner viewBox="0 0 50 50">
        <Circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </Spinner>
    </>
  );
}
