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

/**
 * The normalized absolute URL
 * 
 * Instances of this class are immutable.
 * 
 * @see [URL Standard](https://url.spec.whatwg.org/)
 */
class AbsoluteUri {
  #value: URL;

  private constructor(value: URL) {
    this.#value = value;
    Object.freeze(this);
  }

  static fromString(str: string): AbsoluteUri {
    
  }

  static fromURL(url: URL): AbsoluteUri {
    return new AbsoluteUri(new URL(url.toString()));
  }

  static from(src: string | URL): AbsoluteUri {
    if (src instanceof URL) {
      return AbsoluteUri.fromURL(src);
    }
    else if (typeof src === "string") {
      return AbsoluteUri.fromString(src);
    }
    throw new TypeError("src");
  }

  /**
   * Gets the scheme name for this instance.
   */
  get scheme(): string {
    return this.#value.protocol.replace(/:$/, "");
  }

  get rawUsername(): string {

  }

  get username(): string {

  }

  get rawPassword() {

  }

  get password() {

  }

  /**
   * Gets the host for this instance.
   */
  get rawHost(): string {
    return this.#value.hostname;
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
    const specifiedString = this.#value.port;
    if (specifiedString.length > 0) {
      return Number.parseInt(specifiedString, 10);
    }

    const defaultPort = DefaultPortMap.get(this.scheme);
    if ((typeof defaultPort === "number") && NumberUtils.isNonNegativeInteger(defaultPort)) {
      return defaultPort;
    }
    return -1;
  }

  get rawPath(): string {

  }

  get path() {

  }

  get query(): string {
    
  }

  get query() {
    
  }

  /**
   * Gets the fragment for this instance.
   */
  get rawFragment(): string {
    return this.#value.hash.replace(/^#/, "");
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
        return this.#value.origin;
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
    return this.#value.toString();
  }

  /**
   * @returns The normalized string representation for this instance.
   */
  toJSON(): string {
    return this.toString();
  }

  equals(): boolean {

  }

  relativize() {

  }

  resolve() {

  }
}















// /**
//  * URI文字列が絶対URIを表しているか否かを返却
//  * 
//  * @param uriString URI文字列
//  * @param scheme スキーム
//  * @returns URI文字列が絶対URIを表しているか否か
//  */
// function isAbsoluteUrl(uriString: string, scheme: string): boolean {
//   let separator = ":";
//   if ((Object.values(SpecialScheme) as Array<string>).includes(scheme)) {
//     separator = "://";
//   }
//   return uriString.toLowerCase().startsWith(scheme + separator);
// }

type QueryEntry = [ name: string, value: string ];

class xAbsoluteUri {
  #value: URL;

  /**
   * @param absoluteUri - An absolute URL.
   * @throws {TypeError} 
   */
  constructor (absoluteUri: URL | string) {
    let uriString: string;
    if (absoluteUri instanceof URL) {
      uriString = absoluteUri.toString();
    }
    else {
      uriString = absoluteUri;
    }

    try {
      this.#value = new URL(uriString);
    }
    catch (exception) {
      // 失敗したら不正URLまたは相対URL
      throw new TypeError("value");
    }

    // URLの古い実装だと相対URLからでもエラーなく生成できてしまうのでチェック
    if (isAbsoluteUrl(uriString, this.scheme) !== true) {
      throw new TypeError("value (2)");
    }

    Object.freeze(this);
  }

  get host(): string | null {
    const encodedHost = this.encodedHost;
    if (encodedHost) {
      return toUnicode(encodedHost);
    }
    return null;
  }

  // TODO get path(): Array<string> {

  /**
   * クエリ
   */
  get query(): Array<QueryEntry> | null {
    if (this.#value.search.length <= 0) {
      const work = new URL(this.#value.toString());
      work.hash = "";
      if (work.toString().endsWith("?")) {
        return [];
      }
      return null;
    }

    const entries: Array<QueryEntry> = [];
    for (const entry of this.#value.searchParams.entries()) {
      entries.push([
        entry[0],
        entry[1],
      ]);
    }
    return entries;
  }

  // XXX resolveRelativeUri(relativeUriString: string): Uri {

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

  /**
   * 自身のURIと指定した素片で新たなインスタンスを生成し返却
   * 
   * ※空文字列をセットした場合の挙動はURL.hashに合わせた
   *   （toStringした結果は末尾"#"となる。末尾"#"を取り除きたい場合はwithoutFragmentすべし）
   * 
   * @param fragment 素片 ※先頭に"#"は不要
   * @returns 生成したインスタンス
   */
  withFragment(fragment: string): AbsoluteUri {
    const work = new URL(this.#value.toString());
    work.hash = "#" + fragment; // 0x20,0x22,0x3C,0x3E,0x60 の%エンコードは自動でやってくれる
    return new AbsoluteUri(work.toString());
  }

  /**
   * 自身のURIから素片を除いた新たなインスタンスを生成し返却
   * 
   * @returns 生成したインスタンス
   */
  withoutFragment(): AbsoluteUri {
    const work = new URL(this.#value.toString());
    work.hash = "";
    return new AbsoluteUri(work.toString());
  }
}
Object.freeze(AbsoluteUri);

export { AbsoluteUri };
