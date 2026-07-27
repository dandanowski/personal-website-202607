// Draft posts (wrote-about/_drafts) and any page flagged `devOnly` are built
// ONLY while the local dev server is running (npm start → run mode "serve"/
// "watch"), never in a production build. Lets you preview drafts locally
// without any risk of them shipping.
const DEV = process.env.ELEVENTY_RUN_MODE !== "build";

const tagsOf = (data) =>
  Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];

module.exports = {
  eleventyComputed: {
    // Files live under src/content/ but URLs should stay as if they didn't
    // (src/content/work/foo.md -> /work/foo/, src/content/index.html -> /).
    permalink: (data) => {
      const isDraft = tagsOf(data).includes("draft");

      // Local-only pages are omitted from production builds entirely.
      if ((isDraft || data.devOnly) && !DEV) return false;

      // Drafts preview under their own /drafts/<slug>/ namespace so the URL
      // never implies the final published path.
      if (isDraft) return `/drafts/${data.page.fileSlug}/index.html`;

      const stem = data.page.filePathStem.replace(/^\/content/, "");
      return (stem === "/index" ? "" : stem) + "/index.html";
    },

    // Give draft previews the normal post chrome even when the file itself
    // didn't set a layout (several of the older drafts are bare notes).
    layout: (data) => {
      if (tagsOf(data).includes("draft") && !data.layout) {
        return "layouts/post.liquid";
      }
      return data.layout;
    },
  },
};
