//

import { NumberUtils } from "@i-xi-dev/fundamental";
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
  [ Scheme.FILE, -1 ],
  [ Scheme.FTP, 21 ],
  [ Scheme.HTTP, 80 ],
  [ Scheme.HTTPS, 443 ],
  [ Scheme.WS, 80 ],
  [ Scheme.WSS, 443 ],
]);

type QueryEntry = [ name: string, value: string ];

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
    this.#normalizedUri = uri;
    Object.freeze(this);
  }

  /**
   * Parses a string representation of an absolute URL.
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
  //   return globalThis.decodeURIComponent(this.rawUsername);
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
  //   return globalThis.decodeURIComponent(this.rawPassword);
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
    throw new Error("not implemented");
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
    return -1;
  }

  /**
   * Gets the path for this instance.
   */
  get rawPath(): string {
    return this.#normalizedUri.pathname;
  }

  /**
   * Gets the path segments for this instance.
   */
  get path() {
    throw new Error("not implemented");
  }

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
    return globalThis.decodeURIComponent(this.rawFragment);
  }

  /**
   * Gets the origin for this instance.
   */
  get origin(): string | null {
    switch (this.scheme) {
      case Scheme.BLOB:
      case Scheme.FTP:
      case Scheme.HTTP:
      case Scheme.HTTPS:
      case Scheme.WS:
      case Scheme.WSS:
        return this.#normalizedUri.origin;
      default:
        return null;
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

  #toURL(): URL {
    return new URL(this.#normalizedUri.toString());
  }

  equals(): boolean {

  }

  relativize() {

  }

  resolve() {

  }



  /**
   * Return a new `AbsoluteUri` instance with the fragment set.
   * 
   * @param fragment - The fragment. No need to prepend a `"#"` to fragment.
   * @returns A new `AbsoluteUri` instance.
   */
   withFragment(fragment: string): AbsoluteUri {
    const work = this.#toURL();
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
    const work = this.#toURL();
    work.hash = "";
    return new AbsoluteUri(work);
  }
}
















class xAbsoluteUri {
  #value: URL;


  get host(): string | null {
    const encodedHost = this.encodedHost;
    if (encodedHost) {
      return toUnicode(encodedHost);
    }
    return null;
  }

  // TODO get path(): Array<string> {


  /**
   * 自身のURIと指定したクエリで新たなインスタンスを生成し返却
   * 
   * ※空の配列をセットした場合の挙動はURL.searchに空文字列をセットした場合の挙動に合わせた
   *   （toStringした結果は末尾"?[素片]"となる。"?"を取り除きたい場合はwithoutQueryすべし）
   * 
   * @param query クエリパラメーターのエントリー配列
   * @returns 生成したインスタンス
   */
  withQuery(query: Array<QueryEntry>): AbsoluteUri {
    const queryParams = new URLSearchParams(query);
    const work = new URL(this.#value.toString());
    work.search = "?" + queryParams.toString();
    // XXX Chromeが"?"のみの場合""にしてしまう
    return new AbsoluteUri(work.toString());
  }

  /**
   * 自身のURIからクエリを除いた新たなインスタンスを生成し返却
   * 
   * @returns 生成したインスタンス
   */
  withoutQuery(): AbsoluteUri {
    const work = new URL(this.#value.toString());
    work.search = "";
    return new AbsoluteUri(work.toString());
  }

}
Object.freeze(AbsoluteUri);

export { AbsoluteUri };
