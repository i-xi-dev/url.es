import { expect } from '@esm-bundle/chai';
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

    expect(u0.scheme).to.equal("http");
    expect(u0b.scheme).to.equal("http");
    expect(u1.scheme).to.equal("http");
    expect(u2.scheme).to.equal("https");
    expect(u3.scheme).to.equal("file");
    expect(u4.scheme).to.equal("blob");
    expect(u5.scheme).to.equal("urn");
    expect(u6.scheme).to.equal("data");

    expect(AbsoluteUri.fromString("chrome://hoge").scheme).to.equal("chrome");
    expect(AbsoluteUri.fromString("tel:aaaa").scheme).to.equal("tel");
    expect(AbsoluteUri.fromString("urn:ietf:rfc:2648").scheme).to.equal("urn");
    expect(AbsoluteUri.fromString("geo:13.4125,103.8667").scheme).to.equal("geo");

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

    expect(u0.rawHost).to.equal("example.com");
    expect(u0b.rawHost).to.equal("example.com");
    expect(u1.rawHost).to.equal("example.com");
    expect(u2.rawHost).to.equal("example.com");
    expect(u3.rawHost).to.equal("");
    expect(u4.rawHost).to.equal("");
    expect(u5.rawHost).to.equal("");
    expect(u6.rawHost).to.equal("");
    expect(AbsoluteUri.fromString("http://127.0.0.1:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://127.0.0.1.:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://127:8080/").rawHost).to.equal("0.0.0.127");
    expect(AbsoluteUri.fromString("http://127.0.0:8080/").rawHost).to.equal("127.0.0.0");
    expect(AbsoluteUri.fromString("http://127.0:8080/").rawHost).to.equal("127.0.0.0");
    expect(AbsoluteUri.fromString("http://0x7F.0.0.1:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0x7F000001:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://2130706433:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0177.000.000.001:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0177.0X.000.0x1:8080/").rawHost).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://[::1]:8080/").rawHost).to.equal("[::1]");

    expect(AbsoluteUri.fromString("chrome://hoge").rawHost).to.equal("hoge");
    expect(AbsoluteUri.fromString("tel:aaaa").rawHost).to.equal("");
    expect(AbsoluteUri.fromString("urn:ietf:rfc:2648").rawHost).to.equal("");
    expect(AbsoluteUri.fromString("geo:13.4125,103.8667").rawHost).to.equal("");
    expect(AbsoluteUri.fromString("http://ドメイン名例.JP:8080/").rawHost).to.equal("xn--eckwd4c7cu47r2wf.jp");
    expect(AbsoluteUri.fromString("file://127.0.0.1/aaaa").rawHost).to.equal("127.0.0.1");

    expect(AbsoluteUri.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc").rawHost).to.equal("xn--example-6q4fyliikhk162btq3b2zd4y2o.jp");
    expect(AbsoluteUri.fromString("http://abＡＢ12.JP/abc").rawHost).to.equal("abab12.jp");
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

    expect(u0.host).to.equal("example.com");
    expect(u0b.host).to.equal("example.com");
    expect(u1.host).to.equal("example.com");
    expect(u2.host).to.equal("example.com");
    expect(u3.host).to.equal("");
    expect(u4.host).to.equal("");
    expect(u5.host).to.equal("");
    expect(u6.host).to.equal("");
    expect(AbsoluteUri.fromString("http://127.0.0.1:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://127.0.0.1.:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://127:8080/").host).to.equal("0.0.0.127");
    expect(AbsoluteUri.fromString("http://127.0.0:8080/").host).to.equal("127.0.0.0");
    expect(AbsoluteUri.fromString("http://127.0:8080/").host).to.equal("127.0.0.0");
    expect(AbsoluteUri.fromString("http://0x7F.0.0.1:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0x7F000001:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://2130706433:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0177.000.000.001:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://0177.0X.000.0x1:8080/").host).to.equal("127.0.0.1");
    expect(AbsoluteUri.fromString("http://[::1]:8080/").host).to.equal("[::1]");

    expect(AbsoluteUri.fromString("chrome://hoge").host).to.equal("hoge");
    expect(AbsoluteUri.fromString("tel:aaaa").host).to.equal("");
    expect(AbsoluteUri.fromString("urn:ietf:rfc:2648").host).to.equal("");
    expect(AbsoluteUri.fromString("geo:13.4125,103.8667").host).to.equal("");
    expect(AbsoluteUri.fromString("http://ドメイン名例.JP:8080/").host).to.equal("ドメイン名例.jp");
    expect(AbsoluteUri.fromString("file://127.0.0.1/aaaa").host).to.equal("127.0.0.1");

    expect(AbsoluteUri.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc").host).to.equal("日本語ドメイン名example.jp");
    expect(AbsoluteUri.fromString("http://abＡＢ12.JP/abc").host).to.equal("abab12.jp");
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

    expect(a0.port).to.equal(80);
    expect(u0.port).to.equal(8080);
    expect(u0b.port).to.equal(8080);
    expect(u1.port).to.equal(80);
    expect(u2.port).to.equal(80);
    expect(Number.isNaN(u3.port)).to.equal(true);
    expect(Number.isNaN(u4.port)).to.equal(true);
    expect(Number.isNaN(u5.port)).to.equal(true);
    expect(Number.isNaN(u6.port)).to.equal(true);

    expect(Number.isNaN(AbsoluteUri.fromString("chrome://hoge").port)).to.equal(true);
    expect(Number.isNaN(AbsoluteUri.fromString("tel:aaaa").port)).to.equal(true);
    expect(Number.isNaN(AbsoluteUri.fromString("urn:ietf:rfc:2648").port)).to.equal(true);
    expect(Number.isNaN(AbsoluteUri.fromString("geo:13.4125,103.8667").port)).to.equal(true);

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

    expect(u0.rawPath).to.equal("/");
    expect(u0b.rawPath).to.equal("/");
    expect(u1.rawPath).to.equal("/hoge");
    expect(u2.rawPath).to.equal("/hoge");
    expect(u3.rawPath).to.equal("/D:/hoge/index.txt");
    expect(u4.rawPath).to.equal("https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    expect(u5.rawPath).to.equal("uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    expect(u6.rawPath).to.equal(",Hello%2C%20World!");

    expect(AbsoluteUri.fromString("http://example.com:8080").rawPath).to.equal("/");

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

    expect(u0.rawQuery).to.equal("");
    expect(u0b.rawQuery).to.equal("");
    expect(u1.rawQuery).to.equal("");
    expect(u2.rawQuery).to.equal("");
    expect(u3.rawQuery).to.equal("");
    expect(u4.rawQuery).to.equal("");
    expect(u5.rawQuery).to.equal("");
    expect(u6.rawQuery).to.equal("");

    expect(AbsoluteUri.fromString("chrome://hoge").rawQuery).to.equal("");
    expect(AbsoluteUri.fromString("tel:aaaa").rawQuery).to.equal("");
    expect(AbsoluteUri.fromString("urn:ietf:rfc:2648").rawQuery).to.equal("");
    expect(AbsoluteUri.fromString("geo:13.4125,103.8667").rawQuery).to.equal("");

    expect(AbsoluteUri.fromString("http://example.com:80/hoge?").rawQuery).to.equal("");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?=").rawQuery).to.equal("=");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?=&=").rawQuery).to.equal("=&=");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo").rawQuery).to.equal("foo");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").rawQuery).to.equal("foo=5");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5#bar").rawQuery).to.equal("foo=5");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6").rawQuery).to.equal("foo=5%3D6");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a").rawQuery).to.equal("foo=5%3D6&bar=a");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=%E3%81%82").rawQuery).to.equal("foo=%E3%81%82");

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

    expect(JSON.stringify(u0.query)).to.equal("[]");
    expect(JSON.stringify(u0b.query)).to.equal("[]");
    expect(JSON.stringify(u1.query)).to.equal("[]");
    expect(JSON.stringify(u2.query)).to.equal("[]");
    expect(JSON.stringify(u3.query)).to.equal("[]");
    expect(JSON.stringify(u4.query)).to.equal("[]");
    expect(JSON.stringify(u5.query)).to.equal("[]");
    expect(JSON.stringify(u6.query)).to.equal("[]");

    expect(JSON.stringify(AbsoluteUri.fromString("chrome://hoge").query)).to.equal("[]");
    expect(JSON.stringify(AbsoluteUri.fromString("tel:aaaa").query)).to.equal("[]");
    expect(JSON.stringify(AbsoluteUri.fromString("urn:ietf:rfc:2648").query)).to.equal("[]");
    expect(JSON.stringify(AbsoluteUri.fromString("geo:13.4125,103.8667").query)).to.equal("[]");

    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?").query)).to.equal("[]");
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?=").query)).to.equal('[["",""]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?=&=").query)).to.equal('[["",""],["",""]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo").query)).to.equal('[["foo",""]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").query)).to.equal('[["foo","5"]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5#bar").query)).to.equal('[["foo","5"]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6").query)).to.equal('[["foo","5=6"]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a").query)).to.equal('[["foo","5=6"],["bar","a"]]');
    expect(JSON.stringify(AbsoluteUri.fromString("http://example.com:80/hoge?foo=%E3%81%82").query)).to.equal('[["foo","あ"]]');

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

    expect(u0.rawFragment).to.equal("");
    expect(u0b.rawFragment).to.equal("");
    expect(u1.rawFragment).to.equal("");
    expect(u2.rawFragment).to.equal("");
    expect(u3.rawFragment).to.equal("");
    expect(u4.rawFragment).to.equal("");
    expect(u5.rawFragment).to.equal("");
    expect(u6.rawFragment).to.equal("");


    expect(AbsoluteUri.fromString("http://example.com:80/hoge#").rawFragment).to.equal("");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").rawFragment).to.equal("f%3Co%3Eo");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").rawFragment).to.equal("foo#5");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5=%3CA").rawFragment).to.equal("foo#5=%3CA");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5%3DA").rawFragment).to.equal("foo#5%3DA");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#%E3%81%82").rawFragment).to.equal("%E3%81%82");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3").rawFragment).to.equal("%20!%22%3C%3E%60%3");

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

    expect(u0.fragment).to.equal("");
    expect(u0b.fragment).to.equal("");
    expect(u1.fragment).to.equal("");
    expect(u2.fragment).to.equal("");
    expect(u3.fragment).to.equal("");
    expect(u4.fragment).to.equal("");
    expect(u5.fragment).to.equal("");
    expect(u6.fragment).to.equal("");


    expect(AbsoluteUri.fromString("http://example.com:80/hoge#").fragment).to.equal("");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").fragment).to.equal("f<o>o");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").fragment).to.equal("foo#5");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5=%3CA").fragment).to.equal("foo#5=<A");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5%3DA").fragment).to.equal("foo#5=A");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#%E3%81%82").fragment).to.equal("あ");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3").fragment).to.equal(" !\"<>`%3");

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

    expect(u0.origin).to.equal("http://example.com:8080");
    expect(u0b.origin).to.equal("http://example.com:8080");
    expect(u1.origin).to.equal("http://example.com");
    expect(u2.origin).to.equal("https://example.com:80");
    expect(u3.origin).to.equal("null");
    expect(u4.origin).to.equal("https://whatwg.org");
    expect(u5.origin).to.equal("null");
    expect(u6.origin).to.equal("null");

    expect(AbsoluteUri.fromString("chrome://hoge").origin).to.equal("null");
    expect(AbsoluteUri.fromString("tel:aaaa").origin).to.equal("null");
    expect(AbsoluteUri.fromString("urn:ietf:rfc:2648").origin).to.equal("null");
    expect(AbsoluteUri.fromString("geo:13.4125,103.8667").origin).to.equal("null");
    expect(AbsoluteUri.fromString("about:blank").origin).to.equal("null");

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

    expect(u0.toString()).to.equal("http://example.com:8080/");
    expect(u0b.toString()).to.equal("http://example.com:8080/");
    expect(u1.toString()).to.equal("http://example.com/hoge");
    expect(u2.toString()).to.equal("https://example.com:80/hoge");
    expect(u3.toString()).to.equal("file:///D:/hoge/index.txt");
    expect(u4.toString()).to.equal("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    expect(u5.toString()).to.equal("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    expect(u6.toString()).to.equal("data:,Hello%2C%20World!");

    expect(AbsoluteUri.fromString("http://example.com:80/hoge?").toString()).to.equal("http://example.com/hoge");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo").toString()).to.equal("http://example.com/hoge?foo");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge?foo=5").toString()).to.equal("http://example.com/hoge?foo=5");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#").toString()).to.equal("http://example.com/hoge");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").toString()).to.equal("http://example.com/hoge#f%3Co%3Eo");
    expect(AbsoluteUri.fromString("http://example.com:80/hoge#foo#5").toString()).to.equal("http://example.com/hoge#foo#5");
    expect(AbsoluteUri.fromString("http://example.com/hoge").toString()).to.equal("http://example.com/hoge");
    expect(AbsoluteUri.fromString("http://example.com/hoge/huga").toString()).to.equal("http://example.com/hoge/huga");
    expect(AbsoluteUri.fromString("http://example.com/hoge/huga/").toString()).to.equal("http://example.com/hoge/huga/");
    expect(AbsoluteUri.fromString("http://example.com/hoge/huga/../").toString()).to.equal("http://example.com/hoge/");
    expect(AbsoluteUri.fromString("http://example.com/hoge/huga/./").toString()).to.equal("http://example.com/hoge/huga/");

    expect(AbsoluteUri.fromString("http://example.com:80/hoge?fo o").toString()).to.equal("http://example.com/hoge?fo%20o");

  });

});

describe("AbsoluteUri.prototype.toJSON", () => {
  it("toJSON()", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");

    expect(u0.toJSON()).to.equal("http://example.com:8080/");

  });

});

describe("AbsoluteUri.prototype.toURL", () => {
  it("toURL()", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");

    expect(u0.toURL().href).to.equal("http://example.com:8080/");

  });

});

describe("AbsoluteUri.prototype.originEquals", () => {
  it("originEquals(AbsoluteUri)", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    expect(u0.originEquals(u0)).to.equal(true);
    expect(u0.originEquals(u0b)).to.equal(true);
    expect(u0b.originEquals(u1)).to.equal(false);
    expect(u1.originEquals(u2)).to.equal(false);
    expect(u2.originEquals(u3)).to.equal(false);
    expect(u3.originEquals(u3)).to.equal(false);
    expect(AbsoluteUri.fromString("https://whatwg.org/hoge").originEquals(u4)).to.equal(true);
    expect(u5.originEquals(u6)).to.equal(false);
    expect(u6.originEquals(u6)).to.equal(false);

  });

  it("originEquals(URL)", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    expect(u0.originEquals(u0.toURL())).to.equal(true);
    expect(u0.originEquals(u0b.toURL())).to.equal(true);
    expect(u0b.originEquals(u1.toURL())).to.equal(false);
    expect(u1.originEquals(u2.toURL())).to.equal(false);
    expect(u2.originEquals(u3.toURL())).to.equal(false);
    expect(u3.originEquals(u3.toURL())).to.equal(false);
    expect(AbsoluteUri.fromString("https://whatwg.org/hoge").originEquals(u4.toURL())).to.equal(true);
    expect(u5.originEquals(u6.toURL())).to.equal(false);
    expect(u6.originEquals(u6.toURL())).to.equal(false);

  });

  it("originEquals(string)", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:8080/");
    const u0b = AbsoluteUri.fromString("Http://example.COM:8080/");
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge");
    const u2 = AbsoluteUri.fromString("https://example.com:80/hoge");
    const u3 = AbsoluteUri.fromString("file:///D:/hoge/index.txt");
    const u4 = AbsoluteUri.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = AbsoluteUri.fromString("data:,Hello%2C%20World!");

    expect(u0.originEquals(u0.toString())).to.equal(true);
    expect(u0.originEquals(u0b.toString())).to.equal(true);
    expect(u0b.originEquals(u1.toString())).to.equal(false);
    expect(u1.originEquals(u2.toString())).to.equal(false);
    expect(u2.originEquals(u3.toString())).to.equal(false);
    expect(u3.originEquals(u3.toString())).to.equal(false);
    expect(AbsoluteUri.fromString("https://whatwg.org/hoge").originEquals(u4.toString())).to.equal(true);
    expect(u5.originEquals(u6.toString())).to.equal(false);
    expect(u6.originEquals(u6.toString())).to.equal(false);

    expect(u1.originEquals("HTTP://EXAMPLE.COM/")).to.equal(true);
    expect(u1.originEquals("HTTP://EXAMPLE.COM:80/")).to.equal(true);

  });

  it("originEquals(*)", () => {
    expect(() => {
      AbsoluteUri.fromString("http://example.com:8080/").originEquals(1 as unknown as string);
    }).to.throw(TypeError, "other").with.property("name", "TypeError");

  });

});

describe("AbsoluteUri.prototype.withQuery", () => {
  it("withQuery(Array<string>)", () => {
    const u0 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1").withQuery([]);
    expect(JSON.stringify(u0.query)).to.equal('[]');
    expect(u0.toString()).to.equal("http://example.com/hoge");

    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1").withQuery([["b","2"]]);
    expect(JSON.stringify(u1.query)).to.equal('[["b","2"]]');
    expect(u1.toString()).to.equal("http://example.com/hoge?b=2");

    const u2 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withQuery([["b","3"],["c","1"]]);
    expect(JSON.stringify(u2.query)).to.equal('[["b","3"],["c","1"]]');
    expect(u2.toString()).to.equal("http://example.com/hoge?b=3&c=1#foo");

    const u3 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withQuery([["b","3"],["b","1"]]);
    expect(JSON.stringify(u3.query)).to.equal('[["b","3"],["b","1"]]');
    expect(u3.toString()).to.equal("http://example.com/hoge?b=3&b=1#foo");

    const u4 = AbsoluteUri.fromString("http://example.com:80/hoge").withQuery([["b","2=4"]]);
    expect(JSON.stringify(u4.query)).to.equal('[["b","2=4"]]');
    expect(u4.toString()).to.equal("http://example.com/hoge?b=2%3D4");

    const u5 = AbsoluteUri.fromString("http://example.com:80/hoge").withQuery([["b",""]]);
    expect(JSON.stringify(u5.query)).to.equal('[["b",""]]');
    expect(u5.toString()).to.equal("http://example.com/hoge?b=");

    const u6 = AbsoluteUri.fromString("http://example.com:80/hoge").withQuery([["b","あ"]]);
    expect(JSON.stringify(u6.query)).to.equal('[["b","あ"]]');
    expect(u6.toString()).to.equal("http://example.com/hoge?b=%E3%81%82");

    const u7 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1").withQuery([["",""]]);
    expect(JSON.stringify(u7.query)).to.equal('[["",""]]');
    expect(u7.toString()).to.equal("http://example.com/hoge?=");

  });

  it("withQuery(Array<*>)", () => {
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1").withQuery([["b",1] as unknown as [string,string]]);
    expect(JSON.stringify(u1.query)).to.equal('[]');
    expect(u1.toString()).to.equal("http://example.com/hoge");

    const u1b = AbsoluteUri.fromString("http://example.com:80/hoge?a=1").withQuery([["b","1","2"] as unknown as [string,string]]);
    expect(JSON.stringify(u1b.query)).to.equal('[]');
    expect(u1b.toString()).to.equal("http://example.com/hoge");

  });

});

describe("AbsoluteUri.prototype.withoutQuery", () => {
  it("withoutQuery()", () => {
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1#a").withoutQuery();
    expect(u1.toString()).to.equal("http://example.com/hoge#a");

    const u2 = AbsoluteUri.fromString("http://example.com:80/hoge?a").withoutQuery();
    expect(u2.toString()).to.equal("http://example.com/hoge");

    const u6 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6").withoutQuery();
    expect(u6.toString()).to.equal("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = AbsoluteUri.fromString("data:,Hello%2C%20World!").withoutQuery();
    expect(u7.toString()).to.equal("data:,Hello%2C%20World!");

  });

});

describe("AbsoluteUri.prototype.withFragment", () => {
  it("withFragment(string)", () => {
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("a");
    expect(u1.fragment).to.equal("a");
    expect(u1.toString()).to.equal("http://example.com/hoge#a");

    const u2 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("#a");
    expect(u2.fragment).to.equal("#a");
    expect(u2.toString()).to.equal("http://example.com/hoge##a");

    const u3 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("a<2");
    expect(u3.fragment).to.equal("a<2");
    expect(u3.toString()).to.equal("http://example.com/hoge#a%3C2");

    const u4 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("");
    expect(u4.fragment).to.equal("");
    expect(u4.toString()).to.equal("http://example.com/hoge");

    const u5 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("#h#o#g#e");
    expect(u5.fragment).to.equal("#h#o#g#e");
    expect(u5.toString()).to.equal("http://example.com/hoge##h#o#g#e");

    const u6 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("# h\"#<o>#g#`e");
    expect(u6.fragment).to.equal("# h\"#<o>#g#`e");
    expect(u6.toString()).to.equal("http://example.com/hoge##%20h%22#%3Co%3E#g#%60e");

    const u7 = AbsoluteUri.fromString("http://example.com:80/hoge#foo").withFragment("あ");
    expect(u7.fragment).to.equal("あ");
    expect(u7.toString()).to.equal("http://example.com/hoge#%E3%81%82");

  });

});

describe("AbsoluteUri.prototype.withoutFragment", () => {
  it("withoutFragment()", () => {
    const u1 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1#").withoutFragment();
    expect(u1.fragment).to.equal("");
    expect(u1.toString()).to.equal("http://example.com/hoge?a=1");

    const u2 = AbsoluteUri.fromString("http://example.com:80/hoge#f<o>o").withoutFragment();
    expect(u2.fragment).to.equal("");
    expect(u2.toString()).to.equal("http://example.com/hoge");

    const u3 = AbsoluteUri.fromString("http://example.com:80/hoge?a=1#foo#5").withoutFragment();
    expect(u3.fragment).to.equal("");
    expect(u3.toString()).to.equal("http://example.com/hoge?a=1");

    const u4 = AbsoluteUri.fromString("http://example.com:80/hoge#foo#5=%3CA").withoutFragment();
    expect(u4.fragment).to.equal("");
    expect(u4.toString()).to.equal("http://example.com/hoge");

    const u5 = AbsoluteUri.fromString("http://example.com:80/hoge#foo#5%3DA").withoutFragment();
    expect(u5.fragment).to.equal("");
    expect(u5.toString()).to.equal("http://example.com/hoge");

    const u6 = AbsoluteUri.fromString("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6").withoutFragment();
    expect(u6.fragment).to.equal("");
    expect(u6.toString()).to.equal("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = AbsoluteUri.fromString("data:,Hello%2C%20World!").withoutFragment();
    expect(u7.fragment).to.equal("");
    expect(u7.toString()).to.equal("data:,Hello%2C%20World!");

  });

});
