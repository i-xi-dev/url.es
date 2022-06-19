# @i-xi-dev/url

A JavaScript immutable object that represents the normalized absolute [URL](https://url.spec.whatwg.org/).


## Requirement
`Uri` delegates the URL parsing to the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL).

- Chrome
- Edge
- Firefox
- Safari
- Deno
- Node.js


## Installation

### npm

```console
$ npm i @i-xi-dev/url
```

```javascript
import { Uri } from "@i-xi-dev/url";
```

### CDN

Example for Skypack
```javascript
import { Uri } from "https://cdn.skypack.dev/@i-xi-dev/url";
```


## Usage

### [`Uri`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/url.es/2.1.1/mod.ts/~/Uri) class

For URL rendering

```javascript
const url = Uri.fromString("http://xn--eckwd4c7cu47r2wf.jp/foo?p1=%E5%80%A41&p2=%E5%80%A42#%E7%B4%A0%E7%89%87");

url.scheme;
// → "http"

url.rawHost;
// → "xn--eckwd4c7cu47r2wf.jp"

url.host;
// → "ドメイン名例.jp"

url.port;
// → 80

url.rawQuery;
// → "p1=%E5%80%A41&p2=%E5%80%A42"

url.query;
// → [ [ "p1", "値1" ], [ "p2", "値2" ] ]

url.rawFragment;
// → "%E7%B4%A0%E7%89%87"

url.fragment;
// → "素片"

```
