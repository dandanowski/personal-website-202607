module.exports = function (eleventyConfig) {
  // Static assets copied as-is
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // Lab experiments occasionally ship their own JS/data files, colocated
  // with the page so relative fetches ("data/x.json") resolve correctly.
  eleventyConfig.addPassthroughCopy("src/lab/**/*.js");
  eleventyConfig.addPassthroughCopy("src/lab/**/*.json");

  // Case studies, newest design-system work first by explicit order
  eleventyConfig.addCollection("caseStudies", (c) =>
    c.getFilteredByTag("case").sort((a, b) => a.data.order - b.data.order)
  );

  // Design-system case studies only — used for the homepage's capped preview
  eleventyConfig.addCollection("dsCaseStudies", (c) =>
    c
      .getFilteredByTag("case")
      .filter((item) => item.data.group === "ds")
      .sort((a, b) => a.data.order - b.data.order)
  );

  // Blog posts, newest first
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByTag("post").sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  // Lab experiments — small self-contained modules, alphabetical by title
  eleventyConfig.addCollection("labItems", (c) =>
    c.getFilteredByTag("lab").sort((a, b) => a.data.title.localeCompare(b.data.title))
  );

  // Topic tags: any content item can declare `topics: [...]` in front matter.
  // One sorted, de-duplicated slug list drives the /tags/<slug>/ pagination.
  eleventyConfig.addCollection("tagList", (c) => {
    const tags = new Set();
    c.getAll().forEach((item) => {
      (item.data.topics || []).forEach((t) => tags.add(t));
    });
    return [...tags].sort();
  });

  // Same data as tagList, but with a count per tag for the /tags/ hub page.
  eleventyConfig.addCollection("tagCounts", (c) => {
    const counts = {};
    c.getAll().forEach((item) => {
      (item.data.topics || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.keys(counts)
      .sort()
      .map((tag) => ({ tag, count: counts[tag] }));
  });

  // Filter any collection down to items carrying a given topic tag.
  eleventyConfig.addFilter("withTopic", (items, tag) =>
    (items || []).filter((item) => (item.data.topics || []).includes(tag))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    templateFormats: ["html", "liquid", "md"]
  };
};
