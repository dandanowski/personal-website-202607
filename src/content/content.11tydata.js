module.exports = {
  eleventyComputed: {
    // Files live under src/content/ but URLs should stay as if they didn't
    // (src/content/work/foo.md -> /work/foo/, src/content/index.html -> /).
    permalink: (data) => {
      // Draft notes (wrote-about/_drafts) are data-only — listed on /writing/
      // via collections.drafts, never written as their own page.
      const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
      if (tags.includes("draft")) return false;

      const stem = data.page.filePathStem.replace(/^\/content/, "");
      return (stem === "/index" ? "" : stem) + "/index.html";
    },
  },
};
