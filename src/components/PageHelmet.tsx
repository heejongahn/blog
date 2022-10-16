import Helmet from "react-helmet";

interface Props {
  title: string;
  url: string;
  description?: string;
}

const PageHelmet = ({ title, url, description = "ahnheejong.name" }: Props) => (
  <Helmet title={title}>
    <meta name="viewport" content="width=device-width,initial-scale=1" />

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

    <meta property="og:locale" content="ko_kR" />
    <meta property="og:site_name" content="ahn.heejong" />
    <meta property="og:title" title={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://ahnheejong.name/assets/og.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content={url} />
  </Helmet>
);

export default PageHelmet;
