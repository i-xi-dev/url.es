import { NonNegativeInteger, Percent } from "../deps.ts";
import { _PunycodeDecoder } from "./punycode.ts";

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

const _utf8Decoder = new TextDecoder();

namespace Uri {
  export const Scheme = {
    BLOB: "blob",
    FILE: "file",
    FTP: "ftp",
    HTTP: "http",
    HTTPS: "https",
    WS: "ws",
    WSS: "wss",
  } as const;
  export type Scheme = string;

  export type PathSegment = string;

  /**
   * A query parameter represented as name-value pair.
   */
  export type QueryParameter = [name: string, value: string];

  /**
   * A `userinfo` consisting of `username` and `password`.
   */
  export type Credentials = {
    userName: string;
    password: string;
  };

  // https://url.spec.whatwg.org/
  /**
   * The normalized absolute URL.
   * The `Absolute` instances are immutable.
   */
  export class Absolute {
    /**
     * The [special schemes](https://url.spec.whatwg.org/#special-scheme).
     */
    static readonly #SpecialSchemes: Array<string> = [
      Scheme.FILE,
      Scheme.FTP,
      Scheme.HTTP,
      Scheme.HTTPS,
      Scheme.WS,
      Scheme.WSS,
    ];

    /**
     * The default port numbers.
     */
    static readonly #DefaultPortMap: Map<string, number> = new Map([
      [Scheme.FTP, 21],
      [Scheme.HTTP, 80],
      [Scheme.HTTPS, 443],
      [Scheme.WS, 80],
      [Scheme.WSS, 443],
    ]);

    #normalizedUri: URL;

    private constructor(uri: URL) {
      // searchが"?"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"?"だけ残るので""にする
      if (uri.search === "") {
        uri.search = "";
      }
      // hashが"#"のみの場合、ブラウザによってはgetterでは""になるのに、実際は"#"だけ残るので""にする
      if (uri.hash === "") {
        uri.hash = "";
      }

      this.#normalizedUri = uri;
      Object.freeze(this);
    }

    /**
     * Creates a new `Absolute` instance from the specified string representation of an absolute URL.
     *
     * @param urlString A string representing an absolute URL.
     * @returns A `Absolute` instance.
     * @throws {TypeError} The `urlString` is not a string that represents an absolute URL.
     */
    static fromString(urlString: string): Absolute {
      if (typeof urlString === "string") {
        const value = new URL(urlString); // URLでなければエラー、加えて最近の実装は相対URLの場合もエラー
        return new Absolute(value);
      }
      throw new TypeError("urlString");
    }

    /**
     * Creates a new `Absolute` instance from the specified `URL`.
     *
     * @param url A `URL`.
     * @returns A `Absolute` instance.
     * @throws {TypeError} The `url` is not a `URL` object.
     */
    static fromURL(url: URL): Absolute {
      if (url instanceof URL) {
        const value = new URL(url.toString());
        return new Absolute(value);
      }
      throw new TypeError("url");
    }

    /**
     * Creates a new `Absolute` instance from the specified absolute URL.
     *
     * @param url A `URL` or string that represents an absolute URL.
     * @returns A `Absolute` instance.
     * @throws {TypeError} The `url` is not a `URL` object or string.
     */
    static from(url: string | URL): Absolute {
      if (url instanceof URL) {
        return Absolute.fromURL(url);
      } else if (typeof url === "string") {
        return Absolute.fromString(url);
      }
      throw new TypeError("url");
    }

    /**
     * Gets the scheme name for this instance.
     *
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo");
     * const scheme = uri.scheme;
     * // scheme
     * //   → "http"
     * ```
     */
    get scheme(): Scheme {
      return this.#normalizedUri.protocol.replace(/:$/, "");
    }

    /**
     * Gets the username for this instance.
     */
    get rawUserName(): string {
      return this.#normalizedUri.username;
    }

    /**
     * Gets the password for this instance.
     */
    get rawPassword(): string {
      return this.#normalizedUri.password;
    }

    // get credentials(): Uri.Credentials {
    //   const userName = ByteSequence.fromPercentEncoded(this.rawUserName).utf8DecodeTo();
    //   const password = ByteSequence.fromPercentEncoded(this.rawPassword).utf8DecodeTo();
    //   // xxx = globalThis.decodeURIComponent(***); だと、URIErrorになる場合がある
    //   return {
    //     userName,
    //     password,
    //   }
    // }

    /**
     * Gets the host for this instance.
     *
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://xn--eckwd4c7cu47r2wf.jp/foo");
     * const host = uri.rawHost;
     * // host
     * //   → "xn--eckwd4c7cu47r2wf.jp"
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
     * const uri = Absolute.fromString("http://xn--eckwd4c7cu47r2wf.jp/foo");
     * const punycodeDecodedHost = uri.host;
     * // punycodeDecodedHost
     * //   → "ドメイン名例.jp"
     * ```
     */
    get host(): string {
      if (this.rawHost) {
        const parts = this.rawHost.split(".");
        const decodedParts = parts.map((part) => {
          if (part.startsWith("xn--")) { // 小文字の"xn--"で判定しているのは、rawHostはURL#hostnameの前提だから。
            return _PunycodeDecoder.decode(part.substring(4));
          } else {
            return part;
          }
        });
        const decoded = decodedParts.join(".");

        // デコード結果をエンコードしたらthis.rawHostと等しくなるかチェック
        const test = new URL(this.#normalizedUri.toString());
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
     * const uri = Absolute.fromString("http://example.com/foo");
     * const port = uri.port;
     * // port
     * //   → 80
     * ```
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com:8080/foo");
     * const port = uri.port;
     * // port
     * //   → 8080
     * ```
     */
    get port(): number {
      const specifiedString = this.#normalizedUri.port;
      if (specifiedString.length > 0) {
        return Number.parseInt(specifiedString, 10);
      }

      const defaultPort = Absolute.#DefaultPortMap.get(this.scheme);
      if (NonNegativeInteger.isNonNegativeInteger(defaultPort)) {
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

    // とりあえず、、、特別スキームの場合のみリストとみなす
    /**
     * Gets the path segments for this instance.
     */
    get path(): Array<Uri.PathSegment> {
      let segments: Array<Uri.PathSegment> = [];
      if (this.#isSpecial() === true) {
        const rawPath = this.rawPath;
        if (rawPath.startsWith("/") === true) {
          if (rawPath === "/") {
            //segments = [];
          } else {
            segments = rawPath.substring(1).split("/");
          }
        } else {
          segments = rawPath.split("/");
        }
      } else {
        segments = [this.rawPath];
      }

      const bytesArray: Array<Uint8Array> = segments.map((s) =>
        Percent.decode(s)
      );
      return bytesArray.map((b) => _utf8Decoder.decode(b));
    }

    /**
     * Gets the query for this instance.
     *
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const query = uri.rawQuery;
     * // query
     * //   → "p1=%E5%80%A41&p2=123"
     * ```
     */
    get rawQuery(): string {
      return this.#normalizedUri.search.replace(/^\?/, "");
    }

    /**
     * Gets the result of parsing the query for this instance in the `application/x-www-form-urlencoded` format.
     *
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const queryEntries = uri.query;
     * // queryEntries
     * //   → [ [ "p1", "値1" ], [ "p2", "123" ] ]
     * ```
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?textformat");
     * const queryEntries = uri.query;
     * // queryEntries
     * //   → [ [ "textformat", "" ] ]
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
     * const uri = Absolute.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
     * const fragment = uri.rawFragment;
     * // fragment
     * //   → "%E7%B4%A0%E7%89%87"
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
     * const uri = Absolute.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
     * const percentDecodedFragment = uri.fragment;
     * // percentDecodedFragment
     * //   → "素片"
     * ```
     */
    get fragment(): string {
      // return globalThis.decodeURIComponent(this.rawFragment); だと、URIErrorになる場合がある
      const bytes = Percent.decode(this.rawFragment);
      return _utf8Decoder.decode(bytes);
    }

    /**
     * Gets the origin for this instance.
     *
     * If this scheme is `"blob"`, `"ftp"`, `"http"`, `"https"`, `"ws"`, `"wss"`, the value of `new URL(this.toString()).origin`
     * ; otherwise, `"null"`.
     */
    get origin(): string {
      const originSchemes: Array<string> = [
        Scheme.BLOB,
        Scheme.FTP,
        Scheme.HTTP,
        Scheme.HTTPS,
        Scheme.WS,
        Scheme.WSS,
      ];
      if (originSchemes.includes(this.scheme) === true) {
        return this.#normalizedUri.origin;
      }

      return _NULL_ORIGIN;
      // fileスキームの場合に不透明なoriginとするかはブラウザによっても違う（たとえばChromeは"file://", Firefoxは"null"）。一括不透明とする
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
     * @returns A new `URL` object.
     */
    toURL(): URL {
      return new URL(this.#normalizedUri.toString());
    }

    /**
     * Determines whether this origin is equal to the origin of the absolute URL represented by another object.
     *
     * @param other An absolute URL.
     * @returns If this origin is equal to the origin of the specified absolute URL, `true`; otherwise, `false`.
     * @throws {TypeError} The `other` is not type of `Absolute`, `URL`, or `string`.
     */
    originEquals(other: Absolute | URL | string): boolean {
      let otherUri: Absolute;
      if (other instanceof Absolute) {
        otherUri = other;
      } else if (other instanceof URL) {
        otherUri = Absolute.fromURL(other);
      } else if (typeof other === "string") {
        otherUri = Absolute.fromString(other);
      } else {
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

    #isSpecial(): boolean {
      return Absolute.#SpecialSchemes.includes(this.scheme); // this.schemeは、URLオブジェクトが小文字に正規化する
    }

    // equals(): boolean {
    // }

    // matches(URLPattern): boolean {
    // }

    // relativize(relativePath: string): string {
    // }

    // resolve(relativeUri: string): Uri {
    // }

    #hasUserName(): boolean {
      const rawUserName = this.rawUserName;
      return ((typeof rawUserName === "string") && (rawUserName.length > 0));
    }

    #hasPassword(): boolean {
      const rawPassword = this.rawPassword;
      return ((typeof rawPassword === "string") && (rawPassword.length > 0));
    }

    /**
     * Returns whether this instance has a username or password.
     *
     * @returns Whether this instance has a username or password.
     */
    hasCredentials(): boolean {
      return ((this.#hasUserName() === true) || (this.#hasPassword() === true));
    }

    /**
     * Returns a new `Absolute` instance with the user and password removed.
     *
     * @returns A new `Absolute` instance.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://usr:pwd@example.com/foo");
     * const uriWithoutCredentials = uri.withoutCredentials();
     * // uriWithoutCredentials.toString()
     * //   → "http://example.com/foo"
     * ```
     */
    withoutCredentials(): Absolute {
      const work = this.toURL();
      work.username = "";
      work.password = "";
      return new Absolute(work);
    }

    // withPath(): Absolute {
    //   throw new Error("not implemented");
    // }

    /**
     * Returns whether this instance has query parameters.
     *
     * @returns Whether this instance has query parameters.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const uriHasQuery = uri.hasQuery();
     * // uriHasQuery
     * //   → true
     * ```
     */
    hasQuery(): boolean {
      const rawQuery = this.rawQuery;
      return ((typeof rawQuery === "string") && (rawQuery.length > 0));
    }

    /**
     * Return a new `Absolute` instance with the query set.
     *
     * @param query The query parameters.
     * @returns A new `Absolute` instance.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const uriWithQuery = uri.withQuery([ [ "p1", "値1" ], [ "p2", "123" ] ]);
     * // uriWithQuery
     * //   → "http://example.com/foo?p1=%E5%80%A41&p2=123"
     * ```
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const uriWithQuery = uri.withQuery([ [ "p1", "v1" ] ]);
     * // uriWithQuery
     * //   → "http://example.com/foo?p1=v1"
     * ```
     */
    withQuery(query: Array<Uri.QueryParameter>): Absolute {
      const work = this.toURL();
      if (
        Array.isArray(query) &&
        query.every((entry) => _isUriQueryParameter(entry)) &&
        (query.length > 0)
      ) {
        const queryParams = new URLSearchParams(query);
        work.search = "?" + queryParams.toString();
      } else {
        work.search = "";
      }
      return new Absolute(work);
    }

    /**
     * Returns a new `Absolute` instance with the query removed.
     *
     * @returns A new `Absolute` instance.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo?p1=%E5%80%A41&p2=123");
     * const uriWithoutQuery = uri.withoutQuery();
     * // uriWithoutQuery.toString()
     * //   → "http://example.com/foo"
     * ```
     */
    withoutQuery(): Absolute {
      const work = this.toURL();
      work.search = "";
      return new Absolute(work);
    }

    /**
     * Returns whether this instance has a fragment.
     *
     * @returns Whether this instance has a fragment.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
     * const uriHasFragment = uri.hasFragment();
     * // uriHasFragment
     * //   → true
     * ```
     */
    hasFragment(): boolean {
      const rawFragment = this.rawFragment;
      return ((typeof rawFragment === "string") && (rawFragment.length > 0));
    }

    /**
     * Return a new `Absolute` instance with the fragment set.
     *
     * @param fragment The fragment. No need to prepend a `"#"` to fragment.
     * @returns A new `Absolute` instance.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo");
     * const uriWithFragment = uri.withFragment("素片");
     * // uriWithFragment.toString()
     * //   → "http://example.com/foo#%E7%B4%A0%E7%89%87"
     * ```
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
     * const uriWithFragment = uri.withFragment("svgView(viewBox(0,0,100,100))");
     * // uriWithFragment.toString()
     * //   → "http://example.com/foo#svgView(viewBox(0,0,100,100))"
     * ```
     */
    withFragment(fragment: string): Absolute {
      const work = this.toURL();
      if ((typeof fragment === "string") && (fragment.length > 0)) {
        work.hash = "#" + fragment; // 0x20,0x22,0x3C,0x3E,0x60 の%エンコードは自動でやってくれる
      } else {
        work.hash = "";
      }
      return new Absolute(work);
    }

    /**
     * Returns a new `Absolute` instance with the fragment removed.
     *
     * @returns A new `Absolute` instance.
     * @example
     * ```javascript
     * const uri = Absolute.fromString("http://example.com/foo#%E7%B4%A0%E7%89%87");
     * const uriWithoutFragment = uri.withoutFragment();
     * // uriWithoutFragment.toString()
     * //   → "http://example.com/foo"
     * ```
     */
    withoutFragment(): Absolute {
      const work = this.toURL();
      work.hash = "";
      return new Absolute(work);
    }
  }
}

Object.freeze(Uri);

export { Uri };
