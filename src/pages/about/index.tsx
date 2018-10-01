import React from "react";
import Layout from "../../components/Layout";
import Content, { HTMLContent } from "../../components/Content";

interface Props {
  title: string;
  content: string;
  contentComponent: React.SFC<any> | React.Component<any>;
}

export const AboutPageTemplate = ({
  title,
  content,
  contentComponent
}: Props) => {
  const PageContent: any = contentComponent || Content;

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                {title}
              </h2>
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface Post {
  html: string;
  frontmatter: {
    [key: string]: any;
  };
}

const AboutPage = () => {
  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={"about"}
        content={"안녕"}
      />
    </Layout>
  );
};

export default AboutPage;
