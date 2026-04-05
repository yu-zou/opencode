import { describe, expect, test, beforeEach, afterEach } from "bun:test"
import { proxy, noproxy, proxied } from "../../src/util/network"

describe("util.network", () => {
  const save = { ...process.env }

  afterEach(() => {
    process.env = { ...save }
  })

  describe("proxy()", () => {
    test("returns value from HTTPS_PROXY when set", () => {
      process.env.HTTPS_PROXY = "https://proxy.example.com:8080"
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBe("https://proxy.example.com:8080")
    })

    test("returns value from https_proxy when HTTPS_PROXY is not set", () => {
      delete process.env.HTTPS_PROXY
      process.env.https_proxy = "https://proxy2.example.com:8080"
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBe("https://proxy2.example.com:8080")
    })

    test("returns value from ALL_PROXY when neither HTTPS_PROXY nor https_proxy is set", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      process.env.ALL_PROXY = "http://proxy3.example.com:8080"
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBe("http://proxy3.example.com:8080")
    })

    test("returns value from HTTP_PROXY as last fallback", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      process.env.HTTP_PROXY = "http://proxy4.example.com:8080"
      delete process.env.http_proxy
      expect(proxy()).toBe("http://proxy4.example.com:8080")
    })

    test("returns undefined when no proxy env vars are set", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBeUndefined()
    })

    test("returns undefined when env var is empty string", () => {
      process.env.HTTPS_PROXY = ""
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBeUndefined()
    })

    test("returns undefined when env var is whitespace", () => {
      process.env.HTTPS_PROXY = "   "
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBeUndefined()
    })

    test("respects precedence: HTTPS_PROXY wins over http_proxy", () => {
      process.env.HTTPS_PROXY = "https://high-priority.com"
      process.env.http_proxy = "http://low-priority.com"
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      expect(proxy()).toBe("https://high-priority.com")
    })

    test("returns value from all_proxy when lowercase variants set", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      process.env.all_proxy = "http://all-proxy.com"
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxy()).toBe("http://all-proxy.com")
    })

    test("returns value from http_proxy when uppercase variants not set", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      process.env.http_proxy = "http://lowercase.com"
      expect(proxy()).toBe("http://lowercase.com")
    })
  })

  describe("noproxy()", () => {
    test("returns NO_PROXY value", () => {
      process.env.NO_PROXY = "localhost,.example.com"
      delete process.env.no_proxy
      expect(noproxy()).toBe("localhost,.example.com")
    })

    test("falls back to no_proxy when NO_PROXY is not set", () => {
      delete process.env.NO_PROXY
      process.env.no_proxy = "127.0.0.1"
      expect(noproxy()).toBe("127.0.0.1")
    })

    test("returns undefined when neither is set", () => {
      delete process.env.NO_PROXY
      delete process.env.no_proxy
      expect(noproxy()).toBeUndefined()
    })

    test("returns undefined when NO_PROXY is empty string", () => {
      process.env.NO_PROXY = ""
      delete process.env.no_proxy
      expect(noproxy()).toBeUndefined()
    })

    test("returns undefined when NO_PROXY is whitespace", () => {
      process.env.NO_PROXY = "  \t  "
      delete process.env.no_proxy
      expect(noproxy()).toBeUndefined()
    })
  })

  describe("proxied()", () => {
    test("returns true when proxy() returns a value", () => {
      process.env.HTTP_PROXY = "http://proxy.example.com"
      expect(proxied()).toBe(true)
    })

    test("returns false when no env vars set", () => {
      delete process.env.HTTPS_PROXY
      delete process.env.https_proxy
      delete process.env.ALL_PROXY
      delete process.env.all_proxy
      delete process.env.HTTP_PROXY
      delete process.env.http_proxy
      expect(proxied()).toBe(false)
    })

    test("returns false when proxy is empty string", () => {
      process.env.HTTP_PROXY = ""
      expect(proxied()).toBe(false)
    })

    test("returns false when proxy is whitespace", () => {
      process.env.HTTP_PROXY = "  "
      expect(proxied()).toBe(false)
    })
  })
})
