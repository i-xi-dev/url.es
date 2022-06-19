import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/url",
    version: "2.1.1",
    description: "A JavaScript immutable object that represents the normalized absolute URL.",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/url.es#readme",
    keywords: [
      "url",
      "parse",
      "punycode-decode",
      "browser",
      "deno",
      "nodejs"
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/url.es.git"
    },
    bugs: {
      url: "https://github.com/i-xi-dev/url.es/issues"
    },
    publishConfig: {
      access: "public"
    },
    files: [
      "esm",
      "types"
    ],
  },
  importMap: "./import_map.json"
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
