import React from "react";

interface Props {
  content: string;
  className: string;
}

export const HTMLContent: React.SFC<Props> = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content: React.SFC<Props> = ({ content, className }) => (
  <div className={className}>{content}</div>
);

export default Content;
