import fs from "node:fs/promises";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const inputPath = new URL("./tailwind.css", import.meta.url);
const outputPath = new URL("../../../assets/site.css", import.meta.url);

const css = await fs.readFile(inputPath, "utf8");

// Run PostCSS with Tailwind v4 plugin + autoprefixer
const result = await postcss([tailwind(), autoprefixer]).process(css, {
  from: inputPath.pathname,
  to: outputPath.pathname,
});

await fs.mkdir(new URL("../../../assets/", import.meta.url), { recursive: true });
await fs.writeFile(outputPath, result.css);
console.log("Wrote", outputPath.pathname);

