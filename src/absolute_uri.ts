//

import { NumberUtils } from "@i-xi-dev/fundamental";
import { ByteSequence } from "@i-xi-dev/bytes";
import { toUnicode } from "punycode";

const Scheme = {
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
const DefaultPortMap: Map<string, number> = new Map([
  [ Scheme.FTP, 21 ],
  [ Scheme.HTTP, 80 ],
  [ Scheme.HTTPS, 443 ],
  [ Scheme.WS, 80 ],
  [ Scheme.WSS, 443 ],
]);

type QueryEntry = [ name: string, value: string ];

function isQueryEntry(value: unknown): value is QueryEntry {
  if (Array.isArray(value)) {
    const unknownArray = value as Array<unknown>;
    if (unknownArray.length !== 2) {
      return false;
    }
    if (unknownArray.every((i) => typeof i === "string") !== true) {
      return false;
    }
    const stringArray = unknownArray as [ string, string ];
    return (stringArray[0].length > 0);
  }
  return false;
}

/**
 * The normalized absolute URL
 * 
 * Instances of this class are immutable.
 * 
 * @see [URL Standard](https://url.spec.whatwg.org/)
 */
class AbsoluteUri {
  #normalizedUri: URL;

  private constructor(uri: URL) {
    // searchが"?"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"?"だけ残るので統一する
    if (uri.search === "?") {
      uri.search = "";
    }
    // hashが"#"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"#"だけ残るので統一する
    if (uri.hash === "#") {
      uri.hash = "";
    }

    this.#normalizedUri = uri;
    Object.freeze(this);
  }

  /**
   * Creates a new `AbsoluteUri` instance from the specified string representation of an absolute URL.
   * 
   * @param value - A string representing an absolute URL.
   * @returns A `AbsoluteUri` instance.
   * @throws {TypeError} The `value` is not an absolute URL.
   */
  static fromString(str: string): AbsoluteUri {
    const value = new URL(str); // URLでなければエラー、加えて最近の実装は相対URLの場合もエラー
    return new AbsoluteUri(value);
  }

  /**
   * Creates a new `AbsoluteUri` instance from the specified `URL`.
   * 
   * @param value - A URL.
   * @returns A `AbsoluteUri` instance.
   */
  static fromURL(url: URL): AbsoluteUri {
    const value = new URL(url.toString());
    return new AbsoluteUri(value);
  }

  /**
   * Gets the scheme name for this instance.
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
   */
  get rawHost(): string {
    return this.#normalizedUri.hostname;
  }

  /**
   * Gets the decoded host for this instance.
   */
  get host(): string {
    const rawHost = this.rawHost;
    if (rawHost) {
      return toUnicode(rawHost);
    }
    return "";
  }

  /**
   * Gets the port number for this instance.
   */
  get port(): number {
    const specifiedString = this.#normalizedUri.port;
    if (specifiedString.length > 0) {
      return Number.parseInt(specifiedString, 10);
    }

    const defaultPort = DefaultPortMap.get(this.scheme);
    if ((typeof defaultPort === "number") && NumberUtils.isNonNegativeInteger(defaultPort)) {
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

  // /**
  //  * Gets the path segments for this instance.
  //  */
  // get path() {
  //   throw new Error("not implemented");
  // }

  /**
   * Gets the query for this instance.
   */
  get rawQuery(): string {
    return this.#normalizedUri.search.replace(/^\?/, "");
  }

  /**
   * Gets the result of parsing the query for this instance in the application/x-www-form-urlencoded format.
   */
  get query(): Array<QueryEntry> {
    const entries: Array<QueryEntry> = [];
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
   */
  get rawFragment(): string {
    return this.#normalizedUri.hash.replace(/^#/, "");
  }

  /**
   * Gets the decoded fragment for this instance.
   */
  get fragment(): string {
    // return globalThis.decodeURIComponent(this.rawFragment); URIErrorになる場合がある
    return ByteSequence.fromPercentEncoded(this.rawFragment).utf8DecodeTo();
  }

  /**
   * Gets the origin for this instance.
   */
  get origin(): string {
    switch (this.scheme) {
    case Scheme.BLOB:
    case Scheme.FTP:
    case Scheme.HTTP:
    case Scheme.HTTPS:
    case Scheme.WS:
    case Scheme.WSS:
      return this.#normalizedUri.origin;
    default:
      return "null";
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

  equals(): boolean {
    throw new Error("not implemented");
  }

  // relativize(relativePath: string): string {
  // }

  // resolve(relativeUri: string): AbsoluteUri {
  // }

  withPath(): AbsoluteUri {
    throw new Error("not implemented");
  }

  /**
   * Return a new `AbsoluteUri` instance with the query set.
   * 
   * @param query クエリパラメーターのエントリー配列
   * @returns 生成したインスタンス
   */
  withQuery(query: Array<QueryEntry>): AbsoluteUri {
    const work = this.toURL();
    if (Array.isArray(query) && query.every((entry) => isQueryEntry(entry)) && (query.length > 0)) {
      const queryParams = new URLSearchParams(query);
      work.search = "?" + queryParams.toString();
    }
    else {
      work.search = "";
    }
    return new AbsoluteUri(work);
  }

  /**
   * Returns a new `AbsoluteUri` instance with the query removed.
   * 
   * @returns A new `AbsoluteUri` instance.
   */
  withoutQuery(): AbsoluteUri {
    const work = this.toURL();
    work.search = "";
    return new AbsoluteUri(work);
  }

  /**
   * Return a new `AbsoluteUri` instance with the fragment set.
   * 
   * @param fragment - The fragment. No need to prepend a `"#"` to fragment.
   * @returns A new `AbsoluteUri` instance.
   */
  withFragment(fragment: string): AbsoluteUri {
    const work = this.toURL();
    if ((typeof fragment === "string") && (fragment.length > 0)) {
      work.hash = "#" + fragment; // 0x20,0x22,0x3C,0x3E,0x60 の%エンコードは自動でやってくれる
    }
    else {
      work.hash = "";
    }
    return new AbsoluteUri(work);
  }

  /**
   * Returns a new `AbsoluteUri` instance with the fragment removed.
   * 
   * @returns A new `AbsoluteUri` instance.
   */
  withoutFragment(): AbsoluteUri {
    const work = this.toURL();
    work.hash = "";
    return new AbsoluteUri(work);
  }
}
Object.freeze(AbsoluteUri);

export { AbsoluteUri };
