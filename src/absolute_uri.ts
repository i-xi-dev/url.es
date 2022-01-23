//

import { NumberUtils } from "@i-xi-dev/fundamental";
import { toUnicode } from "punycode";

/**
 * 特別スキーム
 */
const SpecialScheme = {
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
  [ SpecialScheme.FILE, Number.NaN ],
  [ SpecialScheme.FTP, 21 ],
  [ SpecialScheme.HTTP, 80 ],
  [ SpecialScheme.HTTPS, 443 ],
  [ SpecialScheme.WS, 80 ],
  [ SpecialScheme.WSS, 443 ],
]);

/**
 * URI文字列が絶対URIを表しているか否かを返却
 * 
 * @param uriString URI文字列
 * @param scheme スキーム
 * @returns URI文字列が絶対URIを表しているか否か
 */
function isAbsoluteUrl(uriString: string, scheme: string): boolean {
  let separator = ":";
  if ((Object.values(SpecialScheme) as Array<string>).includes(scheme)) {
    separator = "://";
  }
  return uriString.toLowerCase().startsWith(scheme + separator);
}

/**
 * Absolute URL
 * 
 * Instances of this class are immutable.
 * 
 * @see [URL Standard](https://url.spec.whatwg.org/)
 */
class AbsoluteUri {
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

  /**
   * Gets the scheme name for this instance.
   */
  get scheme(): string {
    return this.#value.protocol.replace(/:$/, "");
  }

  /**
   * Gets the host for this instance.
   */
  get encodedHost(): string | null {
    return (this.#value.hostname.length <= 0) ? null : this.#value.hostname;
  }

  get host(): string | null {
    const encodedHost = this.encodedHost;
    if (encodedHost) {
      return toUnicode(encodedHost);
    }
    return null;
  }

  /**
   * Gets the port number for this instance.
   */
  get port(): number | null {
    const specifiedString = this.#value.port;
    if (specifiedString.length > 0) {
      return Number.parseInt(specifiedString, 10);
    }

    const defaultPort = DefaultPortMap.get(this.scheme);
    if ((typeof defaultPort === "number") && NumberUtils.isNonNegativeInteger(defaultPort)) {
      return defaultPort;
    }
    return null;
  }

  /**
   * Gets the origin for this instance.
   */
  get origin(): string | null {
    return (this.#value.origin === "null") ? null : this.#value.origin;
  }
  // XXX Chromeがfileスキームの場合nullを返さない

  // TODO get path(): Array<string> {

  /**
   * クエリ
   */
  get query(): Array<[ string, string ]> | null {
    if (this.#value.search.length <= 0) {
      const work = new URL(this.#value.toString());
      work.hash = "";
      if (work.toString().endsWith("?")) {
        return [];
      }
      return null;
    }

    const entries: Array<[ string, string ]> = [];
    for (const entry of this.#value.searchParams.entries()) {
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
  get fragment(): string | null {
    if (this.#value.hash.length <= 0) {
      const work = new URL(this.#value.toString());
      if (work.toString().endsWith("#")) {
        return "";
      }
      return null;
    }

    const fragment = this.#value.hash.replace(/^#/, "");
    return globalThis.decodeURIComponent(fragment);
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
  withQuery(query: Array<[ string, string ]>): AbsoluteUri {
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
