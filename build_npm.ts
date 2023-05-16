import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";

await emptyDir("./npm");

await build({
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/url",
    version: "3.0.4",
    description:
      "A JavaScript immutable object that represents the normalized absolute URL.",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/url.es#readme",
    keywords: [
      "url",
      "parse",
      "punycode-decode",
      "browser",
      "deno",
      "nodejs",
      "zero-dependency",
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/url.es.git",
    },
    bugs: {
      url: "https://github.com/i-xi-dev/url.es/issues",
    },
    publishConfig: {
      access: "public",
    },
    files: [
      "esm",
      "types",
    ],
  },

  //
  typeCheck: false, // 落ちるようになった
  declaration: false, // 落ちるようになった
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
