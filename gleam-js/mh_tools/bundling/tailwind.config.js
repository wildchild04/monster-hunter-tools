module.exports = {
  content: [
    // 1) Scan the compiled JS bundle at the repo root
    "../../../assets/**/*.{js,mjs}",

    // 2) Also scan your bundler entry & Gleam sources
    "../entry.js",
    "../src/**/*.{gleam}",

    // 3) Site files
    "../../../**/*.{html,md}",
    "../../../_layouts/**/*.{html,md}",
    "../../../_includes/**/*.{html,md}",
    "../../../_posts/**/*.{html,md}",
    "../../../tools.md",
    "../../../blog.md",
    "../../../index.markdown",
  ],
  theme: { extend: {} },
  plugins: [],
};

