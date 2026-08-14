module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addFilter("dateToISO", (d) =>
    (d instanceof Date ? d : new Date(d)).toISOString().split("T")[0]
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
