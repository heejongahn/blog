import CMS from "netlify-cms";

import BlogPostPreview from "./preview-templates/BlogPostPreview";

CMS.registerPreviewTemplate("blog", BlogPostPreview);
