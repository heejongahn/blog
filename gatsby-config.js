module.exports = {
  siteMetadata: {
    title: "ahn.heejong",
    description: "한국에 살며 웹사이트를 만드는 안희종입니다.",
    siteUrl: "https://ahnheejong.name",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    "gatsby-plugin-typescript",
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            setup: (locals) => {
              return {
                ...locals,
                ...locals.query.site.siteMetadata,
                site_url: "https://ahnheejong.name/",
                feed_url: "https://ahnheejong.name/feed.xml",
              };
            },
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                const articleUrl = `${site.siteMetadata.siteUrl}${edge.node.fields.slug}`;

                return {
                  ...edge.node.frontmatter,
                  url: articleUrl,
                  guid: articleUrl,
                };
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      fields { slug }
                      frontmatter {
                        title
                        description
                        date
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: "/feed.xml",
            title: "ahnheejong.name RSS 피드",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-styled-components",
      options: {},
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: "gatsby-remark-prismjs",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-102906433-1",
        respectDNT: true,
        exclude: ["/public/**", "/admin/**"],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-netlify", // make sure to keep it last in the array
  ],
};
