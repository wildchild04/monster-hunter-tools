---
layout: post
title:  "Monster Hunter Tools"
date:   2025-08-16 10:48:41 -0600
categories: News
---

This is the first post for my pet project of `Monster Hunter tools`.
As an ARPG fan and mainly playing PoE for almost 7 years, I wanted to 
experiment with making a gear set damage calculator for Monster Hunter Wilds

Also experimenting with Github pages and static sites.
Recently I had to migrate a full react app built in NextJS to
a plain React app using Vite. Then I had the idea to start experimenting
with static sites with JavaScript funtionality. 
After learning the mechanics of static sites, I’m using GitHub Pages plus Jekyll features, with JavaScript for interactivity.

After asking good old ChatGPT bro
> is there another alternative to have a dynamic site, or a site that can receive input do calculations and present results, other than using javascript?

Here is what I got:
1. Run code in the browser without writing JS (use WASM)
2. Keep the site static, do computation on an external API (no JS required in the repo)
3. Use a language that compiles to JS (you don’t write JS directly)

Then answer for me ended up being the third option.

Have you heard of **Gleam**?, its an awesome functional programming language designed to take advantage
of the Erlang/OTP virtual machine, but also... it has the feature to compile into JavaScript

> Pog - I can use Gleam for all the logic and calculations

So this put me in the path of setting a Gleam pipeline to then build Javascript and **lastliy building** it into a JS asset
so then I can use it in Markdown files with Jekyll, (since I'm taking advantage of Github Pages)

## The pipeline

```
LOCAL DEV PIPELINE
==================

  gleam-js/mh_tools/src/*.gleam
            │
            │  gleam build
            ▼
  gleam-js/mh_tools/build/dev/javascript/mh_tools/*.mjs
            │
            │  (imported by)
            ▼
  gleam-js/mh_tools/entry.js
            │
            │  esbuild --bundle --format=esm
            ▼
  assets/mh-tools.js          ←─(output written at repo root)
            │
            │  referenced by
            ▼
  tools.md  ──>  <script type="module" src="{{ '/assets/mh-tools.js' | relative_url }}"></script>
            │
            │  jekyll build / jekyll serve
            ▼
  _site/** (includes /assets/mh-tools.js and /tools/index.html)
            │
            └──> served locally at http://127.0.0.1:4000/<baseurl>/tools/

```

```
CI / GITHUB PAGES PIPELINE
==========================

  push to main
      │
      ▼
  GitHub Actions workflow
      │
      ├─ Setup Gleam + Node + Ruby
      ├─ gleam-js/mh_tools : gleam build
      ├─ gleam-js/mh_tools/bundling : npm ci && npm run build
      │         (esbuild writes → ../../assets/mh-tools.js)
      ├─ jekyll build  (outputs → _site/)
      └─ deploy Pages artifact (_site/) → GitHub Pages

  Result:
    https://<user>.github.io/<repo>/tools/
      loads  <baseurl>/assets/mh-tools.js  (thanks to | relative_url)

```
This if the current [test gleam file](https://github.com/wildchild04/monster-hunter-tools/blob/2658fdb31afe34bf8d863852361b6ef30e3f791e/gleam-js/mh_tools/src/mh_tools.gleam) that I am using as a starting point


Gleam has this package called [Lustre](https://hexdocs.pm/lustre/index.html), a library for writing code that render HTML
and since all Gleam code can be compiled to JavaScript, so all the dynamic content logic can live in Gleam

> The result of Gleam -> JS code 👉 [Tools]({{ '/tools/' | relative_url }})

The good thing is that, if at this point, I'm not able to make Gleam work for all I want to create for the tooling, 
the I can revert to TypeScript or find any alternative language that has the feature to also be transpiles into Javascript

## Tailwind

> I will not learn CSS; I will **learn** Tailwind

Any non-front-end dev will tell you this after working with Tailwind, I love those glorious long class attributes in my HTML.

Now, the fun thing is integrate all this Frankenstain of a project with Tailwind, for this I will use v4

This is the Tailwind integration diagram
```
(1) Gleam sources        (2) esbuild                 (3) PostCSS + Tailwind v4
    src/*.gleam   ──▶   assets/mh-tools.js   ──▶    Read tailwind.css
                                                    - @config -> load tailwind.config.js
                                                    - @source -> scan:
                                                      • assets/mh-tools.js
                                                      • entry.js, *.gleam
                                                      • *.html, *.md
                                                    Generate only the utilities
                                                    you actually used
                                                    + autoprefixer
                                                    ▼
                                                assets/site.css

```

by configuring the [tailwind.css] file, as well as [tailwind.config.js], all the Tailwind classes present in any processed file get bundled into the `site.css` file

Next steps:
- Start working in the logic to calculate weapon damage, with a single motion value
- Create all the data files for calculations, like motion values, weapons, armor pieces and set bonuses (probably a lot of JSON files)

[Link to the reposity](https://github.com/wildchild04/monster-hunter-tools)

[tailwind.config.js]: https://github.com/wildchild05/monster-hunter-tools/blob/2658fdb31afe34bf8d863852361b6ef30e3f791e/gleam-js/mh_tools/bundling/tailwind.config.js
[tailwind.css]: https://github.com/wildchild04/monster-hunter-tools/blob/2658fdb31afe34bf8d863852361b6ef30e3f791e/gleam-js/mh_tools/bundling/tailwind.css
