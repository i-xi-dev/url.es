//

import { Integer } from "@i-xi-dev/fundamental";
import { ByteSequence } from "@i-xi-dev/bytes";
import { _decodePunycode } from "./punycode_decoder";

const _Scheme = {
  BLOB: "blob",
  FILE: "file",
  FTP: "ftp",
  HTTP: "http",
  HTTPS: "https",
  WS: "ws",
  WSS: "wss",
} as const;

/**
 * デフォルトポート
 */
const _DefaultPortMap: Map<string, number> = new Map([
  [ _Scheme.FTP, 21 ],
  [ _Scheme.HTTP, 80 ],
  [ _Scheme.HTTPS, 443 ],
  [ _Scheme.WS, 80 ],
  [ _Scheme.WSS, 443 ],
]);

function _isUriQueryParameter(value: unknown): value is Uri.QueryParameter {
  if (Array.isArray(value)) {
    const unknownArray = value as Array<unknown>;
    if (unknownArray.length !== 2) {
      return false;
    }
    if (unknownArray.every((i) => typeof i === "string") !== true) {
      return false;
    }
    return true; // nameが""でも妥当
  }
  return false;
}

const _NULL_ORIGIN = "null";

/**
 * The normalized absolute URL
 * 
 * Instances of this class are immutable.
 * 
 * @see [URL Standard](https://url.spec.whatwg.org/)
 */
class Uri {
  #normalizedUri: URL;

  private constructor(uri: URL) {
    // searchが"?"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"?"だけ残るので統一する
    if (uri.search === "") {
      uri.search = "";
    }
    // hashが"#"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"#"だけ残るので統一する
    if (uri.hash === "") {
      uri.hash = "";
    }

    this.#normalizedUri = uri;
    Object.freeze(this);
  }

  /**
   * Creates a new `Uri` instance from the specified string representation of an absolute URL.
   * 
   * @param str A string representing an absolute URL.
   * @returns A `Uri` instance.
   * @throws {TypeError} The `value` is not an absolute URL.
   */
  static fromString(str: string): Uri {
    const value = new URL(str); // URLでなければエラー、加えて最近の実装は相対URLの場合もエラー
    return new Uri(value);
  }

  /**
   * Creates a new `Uri` instance from the specified `URL`.
   * 
   * @param url A URL.
   * @returns A `Uri` instance.
   */
  static fromURL(url: URL): Uri {
    const value = new URL(url.toString());
    return new Uri(value);
  }

  /**
   * Gets the scheme name for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo");
   * 
   * uri.scheme;
   * // → "http"
   * ```
   */
  get scheme(): string {
    return this.#normalizedUri.protocol.replace(/:$/, "");
  }

  // /**
  //  * Gets the username for this instance.
  //  */
  // get rawUsername(): string {
  //   return this.#normalizedUri.username;
  // }

  // /**
  //  * Gets the decoded username for this instance.
  //  */
  // get username(): string {
  //   return globalThis.decodeURIComponent(this.rawUsername); おそらくURIErrorになる場合がある
  // }

  // /**
  //  * Gets the password for this instance.
  //  */
  // get rawPassword() {
  //   return this.#normalizedUri.password;
  // }

  // /**
  //  * Gets the decoded password for this instance.
  //  */
  // get password() {
  //   return globalThis.decodeURIComponent(this.rawPassword); おそらくURIErrorになる場合がある
  // }

  /**
   * Gets the host for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://xn--eckwd4c7cu47r2wf.jp/foo");
   * 
   * uri.rawHost;
   * // → "xn--eckwd4c7cu47r2wf.jp"
   * ```
   */
  get rawHost(): string {
    return this.#normalizedUri.hostname;
  }

  /**
   * Gets the decoded host for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://xn--eckwd4c7cu47r2wf.jp/foo");
   * 
   * uri.host;
   * // → "ドメイン名例.jp"
   * ```
   */
  get host(): string {
    if (this.rawHost) {
      const parts = this.rawHost.split(".");
      const decodedParts = parts.map((part) => {
        if (part.startsWith("xn--")) { // 小文字の"xn--"で判定しているのは、rawHostはURL#hostnameの前提だから。
          return _decodePunycode(part.substring(4));
        }
        else {
          return part;
        }
      });
      const decoded = decodedParts.join(".");

      // デコード結果をエンコードしたらthis.rawHostと等しくなるかチェック
      const test = new URL(this.#normalizedUri);
      test.hostname = decoded;
      if (test.hostname === this.rawHost) {
        // 等しければok。デコード結果を返す
        return decoded;
      }
      // 等しくない
      throw new Error("failed: punicode decode");
    }
    return "";
  }

  /**
   * Gets the port number for this instance.
   * 
   * If the port number is omitted, returns the number in below table.
   * | `scheme` | number |
   * | :--- | ---: |
   * | `"ftp"` | `21` |
   * | `"http"` | `80` |
   * | `"https"` | `443` |
   * | `"ws"` | `80` |
   * | `"wss"` | `443` |
   * | others | `NaN` |
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo");
   * 
   * uri.port;
   * // → 80
   * ```
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com:8080/foo");
   * 
   * uri.port;
   * // → 8080
   * ```
   */
  get port(): number {
    const specifiedString = this.#normalizedUri.port;
    if (specifiedString.length > 0) {
      return Number.parseInt(specifiedString, 10);
    }

    const defaultPort = _DefaultPortMap.get(this.scheme);
    if ((typeof defaultPort === "number") && Integer.isNonNegativeInteger(defaultPort)) {
      return defaultPort;
    }
    return Number.NaN;
  }

  /**
   * Gets the path for this instance.
   */
  get rawPath(): string {
    return this.#normalizedUri.pathname;
  }

  //TODO URLオブジェクト内部でパスがリストなのか非リストなのかは知ることができないので、"/"で始まっていれば"/"で分割した結果を返す？
  //     特別スキームの場合はリストと推定して良いだろうが、
  //     では、"hogehogehoge:/test1/test2"は？ パスが"/"始まりなのでリスト？
  //     その場合、"hogehogehoge:test1/test2"は？ 同じスキームなのに非リスト？
  //     ↓
  //     案1: 特別スキームの場合のみリストとみなす
  //     案2: "/"で始まっていればリストとみなす
  // /**
  //  * Gets the path segments for this instance.
  //  */
  // get path() {
  //   throw new Error("not implemented");
  // }

  /**
   * Gets the query for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
   * 
   * uri.rawQuery;
   * // → "p1=%E5%80%A41&p2=123"
   * ```
   */
  get rawQuery(): string {
    return this.#normalizedUri.search.replace(/^\?/, "");
  }

  /**
   * Gets the result of parsing the query for this instance in the application/x-www-form-urlencoded format.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
   * 
   * uri.query;
   * // → [ [ "p1", "値1" ], [ "p2", "123" ] ]
   * ```
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo?textformat");
   * 
   * uri.query;
   * // → [ [ "textformat", "" ] ]
   * ```
   */
  get query(): Array<Uri.QueryParameter> {
    const entries: Array<Uri.QueryParameter> = [];
    for (const entry of this.#normalizedUri.searchParams.entries()) {
      entries.push([
        entry[0],
        entry[1],
      ]);
    }
    return entries;
  }

  /**
   * Gets the fragment for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
   * 
   * uri.rawFragment;
   * // → "%E7%B4%A0%E7%89%87"
   * ```
   */
  get rawFragment(): string {
    return this.#normalizedUri.hash.replace(/^#/, "");
  }

  /**
   * Gets the decoded fragment for this instance.
   * 
   * @example
   * ```javascript
   * const uri = Uri.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
   * 
   * uri.fragment;
   * // → "素片"
   * ```
   */
  get fragment(): string {
    // return globalThis.decodeURIComponent(this.rawFragment); だと、URIErrorになる場合がある
    return ByteSequence.fromPercentEncoded(this.rawFragment).utf8DecodeTo();
  }

  /**
   * Gets the origin for this instance.
   * 
   * If this scheme is `"blob"`, `"ftp"`, `"http"`, `"https"`, `"ws"`, `"wss"`, the value of `new URL(this.toString()).origin`
   * ; otherwise, `"null"`.
   */
  get origin(): string {
    switch (this.scheme) {
    case _Scheme.BLOB:
    case _Scheme.FTP:
    case _Scheme.HTTP:
    case _Scheme.HTTPS:
    case _Scheme.WS:
    case _Scheme.WSS:
      return this.#normalizedUri.origin;
    default:
      return _NULL_ORIGIN;
        // fileスキームの場合に不透明なoriginとするかはブラウザによっても違う（たとえばChromeは"file://", Firefoxは"null"）。一括不透明とする
    }
  }

  /**
   * @override
   * @returns The normalized string representation for this instance.
   */
  toString(): string {
    return this.#normalizedUri.toString();
  }

  /**
   * @returns The normalized string representation for this instance.
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * @returns The `URL` object.
   */
  toURL(): URL {
    return new URL(this.#normalizedUri.toString());
  }

  /**
   * Determines whether this origin is equal to the origin of the absolute URL represented by another object.
   * 
   * @param other An absolute URL.
   * @returns If this origin is equal to the origin of the specified absolute URL, `true`; otherwise, `false`.
   * @throws {TypeError} The `other` is not type of `Uri`, `URL`, or `string`.
   */
  originEquals(other: Uri | URL | string): boolean {
    let otherUri: Uri;
    if (other instanceof Uri) {
      otherUri = other;
    }
    else if (other instanceof URL) {
      otherUri = Uri.fromURL(other);
    }
    else if (typeof other === "string") {
      otherUri = Uri.fromString(other);
    }
    else {
      throw new TypeError("other");
    }

    if (this.origin === _NULL_ORIGIN) {
      return false;
    }
    if (otherUri.origin === _NULL_ORIGIN) {
      return false;
    }
    return this.origin === otherUri.origin;
  }

  // equals(): boolean {
  // }

  // relativize(relativePath: string): string {
  // }

  // resolve(relativeUri: string): Uri {
  // }

  // withPath(): Uri {
  //   throw new Error("not implemented");
  // }

  /**
   * Return a new `Uri` instance with the query set.
   * 
   * @param query The query parameters.
   * @returns A new `Uri` instance.
   */
  withQuery(query: Array<Uri.QueryParameter>): Uri {
    const work = this.toURL();
    if (Array.isArray(query) && query.every((entry) => _isUriQueryParameter(entry)) && (query.length > 0)) {
      const queryParams = new URLSearchParams(query);
      work.search = "?" + queryParams.toString();
    }
    else {
      work.search = "";
    }
    return new Uri(work);
  }

  /**
   * Returns a new `Uri` instance with the query removed.
   * 
   * @returns A new `Uri` instance.
   */
  withoutQuery(): Uri {
    const work = this.toURL();
    work.search = "";
    return new Uri(work);
  }

  /**
   * Return a new `Uri` instance with the fragment set.
   * 
   * @param fragment The fragment. No need to prepend a `"#"` to fragment.
   * @returns A new `Uri` instance.
   */
  withFragment(fragment: string): Uri {
    const work = this.toURL();
    if ((typeof fragment === "string") && (fragment.length > 0)) {
      work.hash = "#" + fragment; // 0x20,0x22,0x3C,0x3E,0x60 の%エンコードは自動でやってくれる
    }
    else {
      work.hash = "";
    }
    return new Uri(work);
  }

  /**
   * Returns a new `Uri` instance with the fragment removed.
   * 
   * @returns A new `Uri` instance.
   */
  withoutFragment(): Uri {
    const work = this.toURL();
    work.hash = "";
    return new Uri(work);
  }
}

namespace Uri {
  export type QueryParameter = [ name: string, value: string ];
}

Object.freeze(Uri);

export {
  Uri,
};
