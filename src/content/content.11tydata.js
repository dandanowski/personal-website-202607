module.exports = {
  eleventyComputed: {
    // Files live under src/content/ but URLs should stay as if they didn't
    // (src/content/work/foo.md -> /work/foo/, src/content/index.html -> /).
    permalink: (data) => {
      const stem = data.page.filePathStem.replace(/^\/content/, "");
      return (stem === "/index" ? "" : stem) + "/index.html";
    },
  },
};
