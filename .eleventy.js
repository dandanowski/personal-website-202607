module.exports = function (eleventyConfig) {
  // Static assets copied as-is
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // Case studies, newest design-system work first by explicit order
  eleventyConfig.addCollection("caseStudies", (c) =>
    c.getFilteredByTag("case").sort((a, b) => a.data.order - b.data.order)
  );

  // Blog posts, newest first
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByTag("post").sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    templateFormats: ["html", "liquid", "md"]
  };
};
