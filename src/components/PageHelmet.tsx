import * as React from "react";
import Helmet from "react-helmet";

interface Props {
  title: string;
  url: string;
  description?: string;
}

const PageHelmet: React.SFC<Props> = ({
  title,
  url,
  description = "ahnheejong.name"
}) => (
  <Helmet title={title}>
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <meta name="og:locale" content="ko_kR" />
    <meta name="og:site_name" content="ahn.heejong" />

    <meta name="description" content={description} />

    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:creator" content="ahn heejong" />
    <meta name="twitter:site" content="@heejongahn" />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:image"
      content="https://ahnheejong.name/assets/og.png"
    />

    <meta name="og:title" title={title} />
    <meta name="og:description" content={description} />
    <meta name="og:image" content="https://ahnheejong.name/assets/og.png" />
    <meta name="og:image:type" content="image/png" />
    <meta name="og:image:width" content="1200" />
    <meta name="og:image:height" content="630" />
    <meta name="og:url" content={url} />
  </Helmet>
);

export default PageHelmet;
