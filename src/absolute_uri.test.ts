import assert from "node:assert";
import { AbsoluteUri } from "./absolute_uri";

//TODO fromString,fromURL

describe("AbsoluteUri.prototype.scheme", () => {
  it("scheme", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.scheme, "http");
    assert.strictEqual(u0b.scheme, "http");
    assert.strictEqual(u1.scheme, "http");
    assert.strictEqual(u2.scheme, "https");
    assert.strictEqual(u3.scheme, "file");
    assert.strictEqual(u4.scheme, "blob");
    assert.strictEqual(u5.scheme, "urn");
    assert.strictEqual(u6.scheme, "data");

    assert.strictEqual(AbsoluteUri.fromString("chrome://hoge").scheme, "chrome");
    assert.strictEqual(AbsoluteUri.fromString("tel:aaaa").scheme, "tel");
    assert.strictEqual(AbsoluteUri.fromString("urn:ietf:rfc:2648").scheme, "urn");
    assert.strictEqual(AbsoluteUri.fromString("geo:13.4125,103.8667").scheme, "geo");

  });

});

describe("AbsoluteUri.prototype.rawHost", () => {
  it("rawHost", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.rawHost, "example.com");
    assert.strictEqual(u0b.rawHost, "example.com");
    assert.strictEqual(u1.rawHost, "example.com");
    assert.strictEqual(u2.rawHost, "example.com");
    assert.strictEqual(u3.rawHost, "");
    assert.strictEqual(u4.rawHost, "");
    assert.strictEqual(u5.rawHost, "");
    assert.strictEqual(u6.rawHost, "");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0.1:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0.1.:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://127:8080/").rawHost, "0.0.0.127");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0:8080/").rawHost, "127.0.0.0");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0:8080/").rawHost, "127.0.0.0");
    assert.strictEqual(AbsoluteUri.fromString("http://0x7F.0.0.1:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0x7F000001:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://2130706433:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0177.000.000.001:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0177.0X.000.0x1:8080/").rawHost, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://[::1]:8080/").rawHost, "[::1]");

    assert.strictEqual(AbsoluteUri.fromString("chrome://hoge").rawHost, "hoge");
    assert.strictEqual(AbsoluteUri.fromString("tel:aaaa").rawHost, "");
    assert.strictEqual(AbsoluteUri.fromString("urn:ietf:rfc:2648").rawHost, "");
    assert.strictEqual(AbsoluteUri.fromString("geo:13.4125,103.8667").rawHost, "");
    assert.strictEqual(AbsoluteUri.fromString("http://ドメイン名例.JP:8080/").rawHost, "xn--eckwd4c7cu47r2wf.jp");
    assert.strictEqual(AbsoluteUri.fromString("file://127.0.0.1/aaaa").rawHost, "127.0.0.1");

    assert.strictEqual(AbsoluteUri.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc").rawHost, "xn--example-6q4fyliikhk162btq3b2zd4y2o.jp");
    assert.strictEqual(AbsoluteUri.fromString("http://abＡＢ12.JP/abc").rawHost, "abab12.jp");
    //TODO bidiとか

  });

});

describe("AbsoluteUri.prototype.host", () => {
  it("host", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.host, "example.com");
    assert.strictEqual(u0b.host, "example.com");
    assert.strictEqual(u1.host, "example.com");
    assert.strictEqual(u2.host, "example.com");
    assert.strictEqual(u3.host, "");
    assert.strictEqual(u4.host, "");
    assert.strictEqual(u5.host, "");
    assert.strictEqual(u6.host, "");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0.1:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0.1.:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://127:8080/").host, "0.0.0.127");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0.0:8080/").host, "127.0.0.0");
    assert.strictEqual(AbsoluteUri.fromString("http://127.0:8080/").host, "127.0.0.0");
    assert.strictEqual(AbsoluteUri.fromString("http://0x7F.0.0.1:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0x7F000001:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://2130706433:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0177.000.000.001:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://0177.0X.000.0x1:8080/").host, "127.0.0.1");
    assert.strictEqual(AbsoluteUri.fromString("http://[::1]:8080/").host, "[::1]");

    assert.strictEqual(AbsoluteUri.fromString("chrome://hoge").host, "hoge");
    assert.strictEqual(AbsoluteUri.fromString("tel:aaaa").host, "");
    assert.strictEqual(AbsoluteUri.fromString("urn:ietf:rfc:2648").host, "");
    assert.strictEqual(AbsoluteUri.fromString("geo:13.4125,103.8667").host, "");
    assert.strictEqual(AbsoluteUri.fromString("http://ドメイン名例.JP:8080/").host, "ドメイン名例.jp");
    assert.strictEqual(AbsoluteUri.fromString("file://127.0.0.1/aaaa").host, "127.0.0.1");

    assert.strictEqual(AbsoluteUri.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc").host, "日本語ドメイン名example.jp");
    assert.strictEqual(AbsoluteUri.fromString("http://abＡＢ12.JP/abc").host, "abab12.jp");
    //TODO bidiとか

  });

});

describe("AbsoluteUri.prototype.port", () => {
  it("port", () => {
    const a0 = AbsoluteUri.fromString("http://example.com/");
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(a0.port, 80);
    assert.strictEqual(u0.port, 8080);
    assert.strictEqual(u0b.port, 8080);
    assert.strictEqual(u1.port, 80);
    assert.strictEqual(u2.port, 80);
    assert.strictEqual(Number.isNaN(u3.port), true);
    assert.strictEqual(Number.isNaN(u4.port), true);
    assert.strictEqual(Number.isNaN(u5.port), true);
    assert.strictEqual(Number.isNaN(u6.port), true);

    assert.strictEqual(Number.isNaN(AbsoluteUri.fromString("chrome://hoge").port), true);
    assert.strictEqual(Number.isNaN(AbsoluteUri.fromString("tel:aaaa").port), true);
    assert.strictEqual(Number.isNaN(AbsoluteUri.fromString("urn:ietf:rfc:2648").port), true);
    assert.strictEqual(Number.isNaN(AbsoluteUri.fromString("geo:13.4125,103.8667").port), true);

  });

});

describe("AbsoluteUri.prototype.rawPath", () => {
  it("rawPath", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.rawPath, "/");
    assert.strictEqual(u0b.rawPath, "/");
    assert.strictEqual(u1.rawPath, "/hoge");
    assert.strictEqual(u2.rawPath, "/hoge");
    assert.strictEqual(u3.rawPath, "/D:/hoge/index.txt");
    assert.strictEqual(u4.rawPath, "https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    assert.strictEqual(u5.rawPath, "uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    assert.strictEqual(u6.rawPath, ",Hello%2C%20World!");

    assert.strictEqual(AbsoluteUri.fromString("http://example.com:8080").rawPath, "/");

  });

});

//TODO path

describe("AbsoluteUri.prototype.rawQuery", () => {
  it("rawQuery", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.rawQuery, "");
    assert.strictEqual(u0b.rawQuery, "");
    assert.strictEqual(u1.rawQuery, "");
    assert.strictEqual(u2.rawQuery, "");
    assert.strictEqual(u3.rawQuery, "");
    assert.strictEqual(u4.rawQuery, "");
    assert.strictEqual(u5.rawQuery, "");
    assert.strictEqual(u6.rawQuery, "");

    assert.strictEqual(AbsoluteUri.fromString("chrome://hoge").rawQuery, "");
    assert.strictEqual(AbsoluteUri.fromString("tel:aaaa").rawQuery, "");
    assert.strictEqual(AbsoluteUri.fromString("urn:ietf:rfc:2648").rawQuery, "");
    assert.strictEqual(AbsoluteUri.fromString("geo:13.4125,103.8667").rawQuery, "");

    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?").rawQuery, "");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?=").rawQuery, "=");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?=&=").rawQuery, "=&=");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo").rawQuery, "foo");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").rawQuery, "foo=5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5#bar").rawQuery, "foo=5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6").rawQuery, "foo=5%3D6");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a").rawQuery, "foo=5%3D6&bar=a");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=%E3%81%82").rawQuery, "foo=%E3%81%82");

  });

});

describe("AbsoluteUri.prototype.query", () => {
  it("query", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(JSON.stringify(u0.query), "[]");
    assert.strictEqual(JSON.stringify(u0b.query), "[]");
    assert.strictEqual(JSON.stringify(u1.query), "[]");
    assert.strictEqual(JSON.stringify(u2.query), "[]");
    assert.strictEqual(JSON.stringify(u3.query), "[]");
    assert.strictEqual(JSON.stringify(u4.query), "[]");
    assert.strictEqual(JSON.stringify(u5.query), "[]");
    assert.strictEqual(JSON.stringify(u6.query), "[]");

    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("chrome://hoge").query), "[]");
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("tel:aaaa").query), "[]");
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("urn:ietf:rfc:2648").query), "[]");
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("geo:13.4125,103.8667").query), "[]");

    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?").query), "[]");
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?=").query), '[["",""]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?=&=").query), '[["",""],["",""]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo").query), '[["foo",""]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").query), '[["foo","5"]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5#bar").query), '[["foo","5"]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6").query), '[["foo","5=6"]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a").query), '[["foo","5=6"],["bar","a"]]');
    assert.strictEqual(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=%E3%81%82").query), '[["foo","あ"]]');

  });

});

describe("AbsoluteUri.prototype.rawFragment", () => {
  it("rawFragment", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.rawFragment, "");
    assert.strictEqual(u0b.rawFragment, "");
    assert.strictEqual(u1.rawFragment, "");
    assert.strictEqual(u2.rawFragment, "");
    assert.strictEqual(u3.rawFragment, "");
    assert.strictEqual(u4.rawFragment, "");
    assert.strictEqual(u5.rawFragment, "");
    assert.strictEqual(u6.rawFragment, "");


    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#").rawFragment, "");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").rawFragment, "f%3Co%3Eo");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").rawFragment, "foo#5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5=%3CA").rawFragment, "foo#5=%3CA");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5%3DA").rawFragment, "foo#5%3DA");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#%E3%81%82").rawFragment, "%E3%81%82");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3").rawFragment, "%20!%22%3C%3E%60%3");

  });

});

describe("AbsoluteUri.prototype.fragment", () => {
  it("fragment", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.fragment, "");
    assert.strictEqual(u0b.fragment, "");
    assert.strictEqual(u1.fragment, "");
    assert.strictEqual(u2.fragment, "");
    assert.strictEqual(u3.fragment, "");
    assert.strictEqual(u4.fragment, "");
    assert.strictEqual(u5.fragment, "");
    assert.strictEqual(u6.fragment, "");


    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#").fragment, "");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").fragment, "f<o>o");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").fragment, "foo#5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5=%3CA").fragment, "foo#5=<A");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5%3DA").fragment, "foo#5=A");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#%E3%81%82").fragment, "あ");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3").fragment, " !\"<>`%3");

  });

});

describe("AbsoluteUri.prototype.origin", () => {
  it("origin", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.origin, "http://example.com:8080");
    assert.strictEqual(u0b.origin, "http://example.com:8080");
    assert.strictEqual(u1.origin, "http://example.com");
    assert.strictEqual(u2.origin, "https://example.com:80");
    assert.strictEqual(u3.origin, "null");
    assert.strictEqual(u4.origin, "https://whatwg.org");
    assert.strictEqual(u5.origin, "null");
    assert.strictEqual(u6.origin, "null");

    assert.strictEqual(AbsoluteUri.fromString("chrome://hoge").origin, "null");
    assert.strictEqual(AbsoluteUri.fromString("tel:aaaa").origin, "null");
    assert.strictEqual(AbsoluteUri.fromString("urn:ietf:rfc:2648").origin, "null");
    assert.strictEqual(AbsoluteUri.fromString("geo:13.4125,103.8667").origin, "null");

  });

});

describe("AbsoluteUri.prototype.toString", () => {
  it("toString()", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    assert.strictEqual(u0.toString(), "http://example.com:8080/");
    assert.strictEqual(u0b.toString(), "http://example.com:8080/");
    assert.strictEqual(u1.toString(), "http://example.com/hoge");
    assert.strictEqual(u2.toString(), "https://example.com:80/hoge");
    assert.strictEqual(u3.toString(), "file:///D:/hoge/index.txt");
    assert.strictEqual(u4.toString(), "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    assert.strictEqual(u5.toString(), "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    assert.strictEqual(u6.toString(), "data:,Hello%2C%20World!");

    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?").toString(), "http://example.com/hoge?");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo").toString(), "http://example.com/hoge?foo");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").toString(), "http://example.com/hoge?foo=5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#").toString(), "http://example.com/hoge#");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").toString(), "http://example.com/hoge#f%3Co%3Eo");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").toString(), "http://example.com/hoge#foo#5");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com/hoge").toString(), "http://example.com/hoge");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com/hoge/huga").toString(), "http://example.com/hoge/huga");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com/hoge/huga/").toString(), "http://example.com/hoge/huga/");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com/hoge/huga/../").toString(), "http://example.com/hoge/");
    assert.strictEqual(AbsoluteUri.fromString("http://example.com/hoge/huga/./").toString(), "http://example.com/hoge/huga/");

    assert.strictEqual(AbsoluteUri.fromString("http://example.com:80/hoge?fo o").toString(), "http://example.com/hoge?fo%20o");

  });

});

describe("AbsoluteUri.prototype.toJSON", () => {
  it("toJSON()", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");

    assert.strictEqual(u0.toJSON(), "http://example.com:8080/");

  });

});

describe("AbsoluteUri.prototype.toURL", () => {
  it("toURL()", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");

    assert.strictEqual(u0.toURL().href, "http://example.com:8080/");

  });

});

describe("AbsoluteUri.prototype.originEquals", () => {
  it("originEquals(AbsoluteUri)", () => {

  });

  it("originEquals(URL)", () => {

  });

  it("originEquals(string)", () => {

  });

  it("originEquals(*)", () => {

  });

});

describe("AbsoluteUri.prototype.xxxxx", () => {
  it("xxxxx", () => {

  });

});

describe("AbsoluteUri.prototype.xxxxx", () => {
  it("xxxxx", () => {

  });

});

describe("AbsoluteUri.prototype.xxxxx", () => {
  it("xxxxx", () => {

  });

});


