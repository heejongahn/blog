const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

function buildPostPage(post, createPage) {
  const { node, previous, next } = post;
  const id = node.id;

  createPage({
    path: node.fields.slug,
    tags: node.frontmatter.tags,
    component: path.resolve(
      `src/templates/${String(node.frontmatter.templateKey)}.tsx`
    ),
    // additional data can be passed via context
    context: {
      id,
      previousId: previous != null ? previous.id : null,
      hasPrevious: previous != null,
      nextId: next != null ? next.id : null,
      hasNext: next != null,
    },
  });
}

function buildTagPage(tag, createPage) {
  const tagPath = `/tags/${tag}/`;

  createPage({
    path: tagPath,
    component: path.resolve(`src/templates/tags.tsx`),
    context: {
      tag,
    },
  });
}

function buildReviewPage(review, createPage) {
  const { node } = review;
  const id = node.id;

  createPage({
    path: node.fields.slug,
    component: path.resolve(
      `src/templates/${String(node.frontmatter.templateKey)}.tsx`
    ),
    context: {
      id,
    },
  });
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const postResult = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___date] }
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      ) {
        edges {
          previous {
            id
          }
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
          next {
            id
          }
        }
      }
    }
  `);

  const reviewResults = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___date] }
        filter: { frontmatter: { templateKey: { eq: "review" } } }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              type
              name
              title
              date
              stars
              link
              image
              templateKey
              date
            }
          }
        }
      }
    }
  `);

  if (postResult.errors) {
    postResult.errors.forEach((e) => console.error(e.toString()));
    return Promise.reject(postResult.errors);
  }

  if (reviewResults.errors) {
    reviewResults.errors.forEach((e) => console.error(e.toString()));
    return Promise.reject(reviewResults.errors);
  }

  const posts = postResult.data.allMarkdownRemark.edges;
  posts.forEach((post) => buildPostPage(post, createPage));

  const tags = new Set(
    posts.reduce((accm, curr) => {
      const { tags } = curr.node.frontmatter;
      return tags ? accm.concat(tags) : acmm;
    }, [])
  );

  tags.forEach((tag) => buildTagPage(tag, createPage));

  const reviews = reviewResults.data.allMarkdownRemark.edges;
  reviews.forEach((review) => buildReviewPage(review, createPage));
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: "babel-preset-gatsby",
    options: {
      reactRuntime: "automatic",
    },
  });
};
