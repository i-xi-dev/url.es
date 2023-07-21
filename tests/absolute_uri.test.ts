import { assertEquals, assertStrictEquals, assertThrows } from "./deps.ts";
import { Uri } from "../mod.ts";

Deno.test("Uri.Absolute.fromString(string)", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/a/b/../c");
  assertStrictEquals(u0.toString(), "http://example.com:8080/a/c");
});

Deno.test("Uri.Absolute.fromString(*)", () => {
  assertThrows(
    () => {
      Uri.Absolute.fromString(1 as unknown as string);
    },
    TypeError,
    "urlString",
  );
});

Deno.test("Uri.Absolute.fromURL(URL)", () => {
  const u0 = Uri.Absolute.fromURL(new URL("http://example.com:8080/a/b/../c"));
  assertStrictEquals(u0.toString(), "http://example.com:8080/a/c");
});

Deno.test("Uri.Absolute.fromURL(*)", () => {
  assertThrows(
    () => {
      Uri.Absolute.fromURL(1 as unknown as URL);
    },
    TypeError,
    "url",
  );
});

Deno.test("Uri.Absolute.from(string)", () => {
  const u0 = Uri.Absolute.from("http://example.com:8080/a/b/../c");
  assertStrictEquals(u0.toString(), "http://example.com:8080/a/c");
});

Deno.test("Uri.Absolute.from(URL)", () => {
  const u0B = Uri.Absolute.from(new URL("http://example.com:8080/a/b/../c"));
  assertStrictEquals(u0B.toString(), "http://example.com:8080/a/c");
});

Deno.test("Uri.Absolute.from(*)", () => {
  assertThrows(
    () => {
      Uri.Absolute.from(1 as unknown as URL);
    },
    TypeError,
    "url",
  );
});

Deno.test("Uri.Absolute.prototype.scheme", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.scheme, "http");
  assertStrictEquals(u0b.scheme, "http");
  assertStrictEquals(u1.scheme, "http");
  assertStrictEquals(u2.scheme, "https");
  assertStrictEquals(u3.scheme, "file");
  assertStrictEquals(u4.scheme, "blob");
  assertStrictEquals(u5.scheme, "urn");
  assertStrictEquals(u6.scheme, "data");

  assertStrictEquals(Uri.Absolute.fromString("chrome://hoge").scheme, "chrome");
  assertStrictEquals(Uri.Absolute.fromString("tel:aaaa").scheme, "tel");
  assertStrictEquals(
    Uri.Absolute.fromString("urn:ietf:rfc:2648").scheme,
    "urn",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("geo:13.4125,103.8667").scheme,
    "geo",
  );
});

Deno.test("Uri.Absolute.prototype.rawHost", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.rawHost, "example.com");
  assertStrictEquals(u0b.rawHost, "example.com");
  assertStrictEquals(u1.rawHost, "example.com");
  assertStrictEquals(u2.rawHost, "example.com");
  assertStrictEquals(u3.rawHost, "");
  assertStrictEquals(u4.rawHost, "");
  assertStrictEquals(u5.rawHost, "");
  assertStrictEquals(u6.rawHost, "");
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0.1:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0.1.:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127:8080/").rawHost,
    "0.0.0.127",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0:8080/").rawHost,
    "127.0.0.0",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0:8080/").rawHost,
    "127.0.0.0",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0x7F.0.0.1:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0x7F000001:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://2130706433:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0177.000.000.001:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0177.0X.000.0x1:8080/").rawHost,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://[::1]:8080/").rawHost,
    "[::1]",
  );

  assertStrictEquals(Uri.Absolute.fromString("chrome://hoge").rawHost, "hoge");
  assertStrictEquals(Uri.Absolute.fromString("tel:aaaa").rawHost, "");
  assertStrictEquals(Uri.Absolute.fromString("urn:ietf:rfc:2648").rawHost, "");
  assertStrictEquals(
    Uri.Absolute.fromString("geo:13.4125,103.8667").rawHost,
    "",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://ドメイン名例.JP:8080/").rawHost,
    "xn--eckwd4c7cu47r2wf.jp",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("file://127.0.0.1/aaaa").rawHost,
    "127.0.0.1",
  );

  assertStrictEquals(
    Uri.Absolute.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc")
      .rawHost,
    "xn--example-6q4fyliikhk162btq3b2zd4y2o.jp",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://abＡＢ12.JP/abc").rawHost,
    "abab12.jp",
  );
  //TODO bidiとか
});

Deno.test("Uri.Absolute.prototype.host", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.host, "example.com");
  assertStrictEquals(u0b.host, "example.com");
  assertStrictEquals(u1.host, "example.com");
  assertStrictEquals(u2.host, "example.com");
  assertStrictEquals(u3.host, "");
  assertStrictEquals(u4.host, "");
  assertStrictEquals(u5.host, "");
  assertStrictEquals(u6.host, "");
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0.1:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0.1.:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127:8080/").host,
    "0.0.0.127",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0.0:8080/").host,
    "127.0.0.0",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://127.0:8080/").host,
    "127.0.0.0",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0x7F.0.0.1:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0x7F000001:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://2130706433:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0177.000.000.001:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://0177.0X.000.0x1:8080/").host,
    "127.0.0.1",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://[::1]:8080/").host,
    "[::1]",
  );

  assertStrictEquals(Uri.Absolute.fromString("chrome://hoge").host, "hoge");
  assertStrictEquals(Uri.Absolute.fromString("tel:aaaa").host, "");
  assertStrictEquals(Uri.Absolute.fromString("urn:ietf:rfc:2648").host, "");
  assertStrictEquals(Uri.Absolute.fromString("geo:13.4125,103.8667").host, "");
  assertStrictEquals(
    Uri.Absolute.fromString("http://ドメイン名例.JP:8080/").host,
    "ドメイン名例.jp",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("file://127.0.0.1/aaaa").host,
    "127.0.0.1",
  );

  assertStrictEquals(
    Uri.Absolute.fromString("http://日本語ドメイン名ＥＸＡＭＰＬＥ.JP/abc")
      .host,
    "日本語ドメイン名example.jp",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://abＡＢ12.JP/abc").host,
    "abab12.jp",
  );
  //TODO bidiとか
});

Deno.test("Uri.Absolute.prototype.port", () => {
  const a0 = Uri.Absolute.fromString("http://example.com/");
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(a0.port, 80);
  assertStrictEquals(u0.port, 8080);
  assertStrictEquals(u0b.port, 8080);
  assertStrictEquals(u1.port, 80);
  assertStrictEquals(u2.port, 80);
  assertStrictEquals(Number.isNaN(u3.port), true);
  assertStrictEquals(Number.isNaN(u4.port), true);
  assertStrictEquals(Number.isNaN(u5.port), true);
  assertStrictEquals(Number.isNaN(u6.port), true);

  assertStrictEquals(
    Number.isNaN(Uri.Absolute.fromString("chrome://hoge").port),
    true,
  );
  assertStrictEquals(
    Number.isNaN(Uri.Absolute.fromString("tel:aaaa").port),
    true,
  );
  assertStrictEquals(
    Number.isNaN(Uri.Absolute.fromString("urn:ietf:rfc:2648").port),
    true,
  );
  assertStrictEquals(
    Number.isNaN(Uri.Absolute.fromString("geo:13.4125,103.8667").port),
    true,
  );
});

Deno.test("Uri.Absolute.prototype.rawPath", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.rawPath, "/");
  assertStrictEquals(u0b.rawPath, "/");
  assertStrictEquals(u1.rawPath, "/hoge");
  assertStrictEquals(u2.rawPath, "/hoge");
  assertStrictEquals(u3.rawPath, "/D:/hoge/index.txt");
  assertStrictEquals(
    u4.rawPath,
    "https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  assertStrictEquals(u5.rawPath, "uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
  assertStrictEquals(u6.rawPath, ",Hello%2C%20World!");

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:8080").rawPath,
    "/",
  );
});

Deno.test("Uri.Absolute.prototype.path", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hog%2Fe");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20W%2Forld!");

  assertEquals(u0.path, []);
  assertEquals(u0b.path, []);
  assertEquals(u1.path, ["hoge"]);
  assertEquals(u2.path, ["hog/e"]);
  assertEquals(u3.path, ["D:", "hoge", "index.txt"]);
  assertEquals(
    u4.path,
    ["https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f"],
  );
  assertEquals(u5.path, ["uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6"]);
  assertEquals(u6.path, [",Hello, W/orld!"]);

  assertEquals(
    Uri.Absolute.fromString("http://example.com:8080").path,
    [],
  );
});

Deno.test("Uri.Absolute.prototype.rawQuery", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.rawQuery, "");
  assertStrictEquals(u0b.rawQuery, "");
  assertStrictEquals(u1.rawQuery, "");
  assertStrictEquals(u2.rawQuery, "");
  assertStrictEquals(u3.rawQuery, "");
  assertStrictEquals(u4.rawQuery, "");
  assertStrictEquals(u5.rawQuery, "");
  assertStrictEquals(u6.rawQuery, "");

  assertStrictEquals(Uri.Absolute.fromString("chrome://hoge").rawQuery, "");
  assertStrictEquals(Uri.Absolute.fromString("tel:aaaa").rawQuery, "");
  assertStrictEquals(Uri.Absolute.fromString("urn:ietf:rfc:2648").rawQuery, "");
  assertStrictEquals(
    Uri.Absolute.fromString("geo:13.4125,103.8667").rawQuery,
    "",
  );

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?").rawQuery,
    "",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?=").rawQuery,
    "=",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?=&=").rawQuery,
    "=&=",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo").rawQuery,
    "foo",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=5").rawQuery,
    "foo=5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=5#bar").rawQuery,
    "foo=5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=5%3D6").rawQuery,
    "foo=5%3D6",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a")
      .rawQuery,
    "foo=5%3D6&bar=a",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=%E3%81%82")
      .rawQuery,
    "foo=%E3%81%82",
  );
});

Deno.test("Uri.Absolute.prototype.query", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(JSON.stringify(u0.query), "[]");
  assertStrictEquals(JSON.stringify(u0b.query), "[]");
  assertStrictEquals(JSON.stringify(u1.query), "[]");
  assertStrictEquals(JSON.stringify(u2.query), "[]");
  assertStrictEquals(JSON.stringify(u3.query), "[]");
  assertStrictEquals(JSON.stringify(u4.query), "[]");
  assertStrictEquals(JSON.stringify(u5.query), "[]");
  assertStrictEquals(JSON.stringify(u6.query), "[]");

  assertStrictEquals(
    JSON.stringify(Uri.Absolute.fromString("chrome://hoge").query),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify(Uri.Absolute.fromString("tel:aaaa").query),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify(Uri.Absolute.fromString("urn:ietf:rfc:2648").query),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify(Uri.Absolute.fromString("geo:13.4125,103.8667").query),
    "[]",
  );

  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?").query,
    ),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?=").query,
    ),
    '[["",""]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?=&=").query,
    ),
    '[["",""],["",""]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo").query,
    ),
    '[["foo",""]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo=5").query,
    ),
    '[["foo","5"]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo=5#bar").query,
    ),
    '[["foo","5"]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo=5%3D6").query,
    ),
    '[["foo","5=6"]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo=5%3D6&bar=a")
        .query,
    ),
    '[["foo","5=6"],["bar","a"]]',
  );
  assertStrictEquals(
    JSON.stringify(
      Uri.Absolute.fromString("http://example.com:80/hoge?foo=%E3%81%82").query,
    ),
    '[["foo","あ"]]',
  );
});

Deno.test("Uri.Absolute.prototype.rawFragment", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.rawFragment, "");
  assertStrictEquals(u0b.rawFragment, "");
  assertStrictEquals(u1.rawFragment, "");
  assertStrictEquals(u2.rawFragment, "");
  assertStrictEquals(u3.rawFragment, "");
  assertStrictEquals(u4.rawFragment, "");
  assertStrictEquals(u5.rawFragment, "");
  assertStrictEquals(u6.rawFragment, "");

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#").rawFragment,
    "",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#f<o>o").rawFragment,
    "f%3Co%3Eo",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5").rawFragment,
    "foo#5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5=%3CA")
      .rawFragment,
    "foo#5=%3CA",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5%3DA").rawFragment,
    "foo#5%3DA",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#%E3%81%82").rawFragment,
    "%E3%81%82",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3")
      .rawFragment,
    "%20!%22%3C%3E%60%3",
  );
});

Deno.test("Uri.Absolute.prototype.fragment", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.fragment, "");
  assertStrictEquals(u0b.fragment, "");
  assertStrictEquals(u1.fragment, "");
  assertStrictEquals(u2.fragment, "");
  assertStrictEquals(u3.fragment, "");
  assertStrictEquals(u4.fragment, "");
  assertStrictEquals(u5.fragment, "");
  assertStrictEquals(u6.fragment, "");

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#").fragment,
    "",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#f<o>o").fragment,
    "f<o>o",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5").fragment,
    "foo#5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5=%3CA").fragment,
    "foo#5=<A",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5%3DA").fragment,
    "foo#5=A",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#%E3%81%82").fragment,
    "あ",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#あ").fragment,
    "あ",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#%20!%22%3C%3E%60%3")
      .fragment,
    ' !"<>`%3',
  );
});

Deno.test("Uri.Absolute.prototype.origin", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.origin, "http://example.com:8080");
  assertStrictEquals(u0b.origin, "http://example.com:8080");
  assertStrictEquals(u1.origin, "http://example.com");
  assertStrictEquals(u2.origin, "https://example.com:80");
  assertStrictEquals(u3.origin, "null");
  assertStrictEquals(u4.origin, "https://whatwg.org");
  assertStrictEquals(u5.origin, "null");
  assertStrictEquals(u6.origin, "null");

  assertStrictEquals(Uri.Absolute.fromString("chrome://hoge").origin, "null");
  assertStrictEquals(Uri.Absolute.fromString("tel:aaaa").origin, "null");
  assertStrictEquals(
    Uri.Absolute.fromString("urn:ietf:rfc:2648").origin,
    "null",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("geo:13.4125,103.8667").origin,
    "null",
  );
  assertStrictEquals(Uri.Absolute.fromString("about:blank").origin, "null");
});

Deno.test("Uri.Absolute.prototype.toString()", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.toString(), "http://example.com:8080/");
  assertStrictEquals(u0b.toString(), "http://example.com:8080/");
  assertStrictEquals(u1.toString(), "http://example.com/hoge");
  assertStrictEquals(u2.toString(), "https://example.com:80/hoge");
  assertStrictEquals(u3.toString(), "file:///D:/hoge/index.txt");
  assertStrictEquals(
    u4.toString(),
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  assertStrictEquals(
    u5.toString(),
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  assertStrictEquals(u6.toString(), "data:,Hello%2C%20World!");

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?").toString(),
    "http://example.com/hoge",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo").toString(),
    "http://example.com/hoge?foo",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?foo=5").toString(),
    "http://example.com/hoge?foo=5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#").toString(),
    "http://example.com/hoge",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#f<o>o").toString(),
    "http://example.com/hoge#f%3Co%3Eo",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge#foo#5").toString(),
    "http://example.com/hoge#foo#5",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com/hoge").toString(),
    "http://example.com/hoge",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com/hoge/huga").toString(),
    "http://example.com/hoge/huga",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com/hoge/huga/").toString(),
    "http://example.com/hoge/huga/",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com/hoge/huga/../").toString(),
    "http://example.com/hoge/",
  );
  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com/hoge/huga/./").toString(),
    "http://example.com/hoge/huga/",
  );

  assertStrictEquals(
    Uri.Absolute.fromString("http://example.com:80/hoge?fo o").toString(),
    "http://example.com/hoge?fo%20o",
  );
});

Deno.test("Uri.Absolute.prototype.toJSON()", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  assertStrictEquals(u0.toJSON(), "http://example.com:8080/");
});

Deno.test("Uri.Absolute.prototype.toURL()", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  assertStrictEquals(u0.toURL().href, "http://example.com:8080/");
});

Deno.test("Uri.Absolute.prototype.originEquals(Uri)", () => {
  const u0A = Uri.Absolute.fromString("http://example.com:8080/");
  const u0Ab = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1A = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2A = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3A = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4A = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5A = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6A = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0A.originEquals(u0A), true);
  assertStrictEquals(u0A.originEquals(u0Ab), true);
  assertStrictEquals(u0Ab.originEquals(u1A), false);
  assertStrictEquals(u1A.originEquals(u2A), false);
  assertStrictEquals(u2A.originEquals(u3A), false);
  assertStrictEquals(u3A.originEquals(u3A), false);
  assertStrictEquals(
    Uri.Absolute.fromString("https://whatwg.org/hoge").originEquals(u4A),
    true,
  );
  assertStrictEquals(u5A.originEquals(u6A), false);
  assertStrictEquals(u6A.originEquals(u6A), false);
});

Deno.test("Uri.Absolute.prototype.originEquals(URL)", () => {
  const u0B = Uri.Absolute.fromString("http://example.com:8080/");
  const u0Bb = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1B = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2B = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3B = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4B = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5B = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6B = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0B.originEquals(u0B.toURL()), true);
  assertStrictEquals(u0B.originEquals(u0Bb.toURL()), true);
  assertStrictEquals(u0Bb.originEquals(u1B.toURL()), false);
  assertStrictEquals(u1B.originEquals(u2B.toURL()), false);
  assertStrictEquals(u2B.originEquals(u3B.toURL()), false);
  assertStrictEquals(u3B.originEquals(u3B.toURL()), false);
  assertStrictEquals(
    Uri.Absolute.fromString("https://whatwg.org/hoge").originEquals(
      u4B.toURL(),
    ),
    true,
  );
  assertStrictEquals(u5B.originEquals(u6B.toURL()), false);
  assertStrictEquals(u6B.originEquals(u6B.toURL()), false);
});

Deno.test("Uri.Absolute.prototype.originEquals(string)", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:8080/");
  const u0b = Uri.Absolute.fromString("Http://example.COM:8080/");
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge");
  const u2 = Uri.Absolute.fromString("https://example.com:80/hoge");
  const u3 = Uri.Absolute.fromString("file:///D:/hoge/index.txt");
  const u4 = Uri.Absolute.fromString(
    "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f",
  );
  const u5 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );
  const u6 = Uri.Absolute.fromString("data:,Hello%2C%20World!");

  assertStrictEquals(u0.originEquals(u0.toString()), true);
  assertStrictEquals(u0.originEquals(u0b.toString()), true);
  assertStrictEquals(u0b.originEquals(u1.toString()), false);
  assertStrictEquals(u1.originEquals(u2.toString()), false);
  assertStrictEquals(u2.originEquals(u3.toString()), false);
  assertStrictEquals(u3.originEquals(u3.toString()), false);
  assertStrictEquals(
    Uri.Absolute.fromString("https://whatwg.org/hoge").originEquals(
      u4.toString(),
    ),
    true,
  );
  assertStrictEquals(u5.originEquals(u6.toString()), false);
  assertStrictEquals(u6.originEquals(u6.toString()), false);

  assertStrictEquals(u1.originEquals("HTTP://EXAMPLE.COM/"), true);
  assertStrictEquals(u1.originEquals("HTTP://EXAMPLE.COM:80/"), true);
});

Deno.test("Uri.Absolute.prototype.originEquals(*)", () => {
  assertThrows(
    () => {
      Uri.Absolute.fromString("http://example.com:8080/").originEquals(
        1 as unknown as string,
      );
    },
    TypeError,
    "other",
  );
});

// Deno.test("Uri.Absolute.prototype.isSpecial()", () => {
//   assertStrictEquals(Uri.Absolute.fromString("http://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("https://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("ws://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("wss://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("ftp://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("file://example.com/").isSpecial(), true);
//   assertStrictEquals(Uri.Absolute.fromString("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f").isSpecial(), false);
// });

Deno.test("Uri.Absolute.prototype.hasCredentials()", () => {
  const u1 = Uri.Absolute.fromString("http://usr@example.com:80/hoge?a=1#a")
    .hasCredentials();
  assertStrictEquals(u1, true);

  const u2 = Uri.Absolute.fromString("http://usr:pwd@example.com:80/hoge?a=1#a")
    .hasCredentials();
  assertStrictEquals(u2, true);

  const u3 = Uri.Absolute.fromString("http://:pwd@example.com:80/hoge?a=1#a")
    .hasCredentials();
  assertStrictEquals(u3, true);

  const u4 = Uri.Absolute.fromString("http://:@example.com:80/hoge?a=1#a")
    .hasCredentials();
  assertStrictEquals(u4, false);
});

Deno.test("Uri.Absolute.prototype.withoutCredentials()", () => {
  const u1 = Uri.Absolute.fromString("http://usr@example.com:80/hoge?a=1#a")
    .withoutCredentials();
  assertStrictEquals(u1.toString(), "http://example.com/hoge?a=1#a");

  const u2 = Uri.Absolute.fromString("http://usr:pwd@example.com:80/hoge?a=1#a")
    .withoutCredentials();
  assertStrictEquals(u2.toString(), "http://example.com/hoge?a=1#a");
});

Deno.test("Uri.Absolute.prototype.hasQuery()", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1#a")
    .hasQuery();
  assertStrictEquals(u1, true);

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge?a").hasQuery();
  assertStrictEquals(u2, true);

  const u6 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  ).hasQuery();
  assertStrictEquals(u6, false);

  const u7 = Uri.Absolute.fromString("data:,Hello%2C%20World!").hasQuery();
  assertStrictEquals(u7, false);
});

Deno.test("Uri.Absolute.prototype.withQuery(Array<string>)", () => {
  const u0 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1")
    .withQuery([]);
  assertStrictEquals(JSON.stringify(u0.query), "[]");
  assertStrictEquals(u0.toString(), "http://example.com/hoge");

  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1")
    .withQuery([["b", "2"]]);
  assertStrictEquals(JSON.stringify(u1.query), '[["b","2"]]');
  assertStrictEquals(u1.toString(), "http://example.com/hoge?b=2");

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withQuery([["b", "3"], ["c", "1"]]);
  assertStrictEquals(JSON.stringify(u2.query), '[["b","3"],["c","1"]]');
  assertStrictEquals(u2.toString(), "http://example.com/hoge?b=3&c=1#foo");

  const u3 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withQuery([["b", "3"], ["b", "1"]]);
  assertStrictEquals(JSON.stringify(u3.query), '[["b","3"],["b","1"]]');
  assertStrictEquals(u3.toString(), "http://example.com/hoge?b=3&b=1#foo");

  const u4 = Uri.Absolute.fromString("http://example.com:80/hoge").withQuery([[
    "b",
    "2=4",
  ]]);
  assertStrictEquals(JSON.stringify(u4.query), '[["b","2=4"]]');
  assertStrictEquals(u4.toString(), "http://example.com/hoge?b=2%3D4");

  const u5 = Uri.Absolute.fromString("http://example.com:80/hoge").withQuery([[
    "b",
    "",
  ]]);
  assertStrictEquals(JSON.stringify(u5.query), '[["b",""]]');
  assertStrictEquals(u5.toString(), "http://example.com/hoge?b=");

  const u6 = Uri.Absolute.fromString("http://example.com:80/hoge").withQuery([[
    "b",
    "あ",
  ]]);
  assertStrictEquals(JSON.stringify(u6.query), '[["b","あ"]]');
  assertStrictEquals(u6.toString(), "http://example.com/hoge?b=%E3%81%82");

  const u7 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1")
    .withQuery([["", ""]]);
  assertStrictEquals(JSON.stringify(u7.query), '[["",""]]');
  assertStrictEquals(u7.toString(), "http://example.com/hoge?=");
});

Deno.test("Uri.Absolute.prototype.withQuery(Array<*>)", () => {
  const u1B = Uri.Absolute.fromString("http://example.com:80/hoge?a=1")
    .withQuery([["b", 1] as unknown as [string, string]]);
  assertStrictEquals(JSON.stringify(u1B.query), "[]");
  assertStrictEquals(u1B.toString(), "http://example.com/hoge");

  const u1Bb = Uri.Absolute.fromString("http://example.com:80/hoge?a=1")
    .withQuery([["b", "1", "2"] as unknown as [string, string]]);
  assertStrictEquals(JSON.stringify(u1Bb.query), "[]");
  assertStrictEquals(u1Bb.toString(), "http://example.com/hoge");
});

Deno.test("Uri.Absolute.prototype.withoutQuery()", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1#a")
    .withoutQuery();
  assertStrictEquals(u1.toString(), "http://example.com/hoge#a");

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge?a")
    .withoutQuery();
  assertStrictEquals(u2.toString(), "http://example.com/hoge");

  const u6 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  ).withoutQuery();
  assertStrictEquals(
    u6.toString(),
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );

  const u7 = Uri.Absolute.fromString("data:,Hello%2C%20World!").withoutQuery();
  assertStrictEquals(u7.toString(), "data:,Hello%2C%20World!");
});

Deno.test("Uri.Absolute.prototype.hasFragment()", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1#a")
    .hasFragment();
  assertStrictEquals(u1, true);

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge?a")
    .hasFragment();
  assertStrictEquals(u2, false);

  const u6 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  ).hasFragment();
  assertStrictEquals(u6, false);

  const u7 = Uri.Absolute.fromString("data:,Hello%2C%20World!").hasFragment();
  assertStrictEquals(u7, false);
});

Deno.test("Uri.Absolute.prototype.withFragment(string)", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("a");
  assertStrictEquals(u1.fragment, "a");
  assertStrictEquals(u1.toString(), "http://example.com/hoge#a");

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("#a");
  assertStrictEquals(u2.fragment, "#a");
  assertStrictEquals(u2.toString(), "http://example.com/hoge##a");

  const u3 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("a<2");
  assertStrictEquals(u3.fragment, "a<2");
  assertStrictEquals(u3.toString(), "http://example.com/hoge#a%3C2");

  const u4 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("");
  assertStrictEquals(u4.fragment, "");
  assertStrictEquals(u4.toString(), "http://example.com/hoge");

  const u5 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("#h#o#g#e");
  assertStrictEquals(u5.fragment, "#h#o#g#e");
  assertStrictEquals(u5.toString(), "http://example.com/hoge##h#o#g#e");

  const u6 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment('# h"#<o>#g#`e');
  assertStrictEquals(u6.fragment, '# h"#<o>#g#`e');
  assertStrictEquals(
    u6.toString(),
    "http://example.com/hoge##%20h%22#%3Co%3E#g#%60e",
  );

  const u7 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment("あ");
  assertStrictEquals(u7.fragment, "あ");
  assertStrictEquals(u7.toString(), "http://example.com/hoge#%E3%81%82");
});

Deno.test("Uri.Absolute.prototype.withFragment(*)", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge#foo")
    .withFragment(1 as unknown as string);
  assertStrictEquals(u1.fragment, "");
  assertStrictEquals(u1.toString(), "http://example.com/hoge");
});

Deno.test("Uri.Absolute.prototype.withoutFragment()", () => {
  const u1 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1#")
    .withoutFragment();
  assertStrictEquals(u1.fragment, "");
  assertStrictEquals(u1.toString(), "http://example.com/hoge?a=1");

  const u2 = Uri.Absolute.fromString("http://example.com:80/hoge#f<o>o")
    .withoutFragment();
  assertStrictEquals(u2.fragment, "");
  assertStrictEquals(u2.toString(), "http://example.com/hoge");

  const u3 = Uri.Absolute.fromString("http://example.com:80/hoge?a=1#foo#5")
    .withoutFragment();
  assertStrictEquals(u3.fragment, "");
  assertStrictEquals(u3.toString(), "http://example.com/hoge?a=1");

  const u4 = Uri.Absolute.fromString("http://example.com:80/hoge#foo#5=%3CA")
    .withoutFragment();
  assertStrictEquals(u4.fragment, "");
  assertStrictEquals(u4.toString(), "http://example.com/hoge");

  const u5 = Uri.Absolute.fromString("http://example.com:80/hoge#foo#5%3DA")
    .withoutFragment();
  assertStrictEquals(u5.fragment, "");
  assertStrictEquals(u5.toString(), "http://example.com/hoge");

  const u6 = Uri.Absolute.fromString(
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  ).withoutFragment();
  assertStrictEquals(u6.fragment, "");
  assertStrictEquals(
    u6.toString(),
    "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  );

  const u7 = Uri.Absolute.fromString("data:,Hello%2C%20World!")
    .withoutFragment();
  assertStrictEquals(u7.fragment, "");
  assertStrictEquals(u7.toString(), "data:,Hello%2C%20World!");
});
