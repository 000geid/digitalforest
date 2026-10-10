import test from "node:test"
import assert from "node:assert/strict"
import vm from "node:vm"
import { h } from "preact"
import { render } from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import { MobileNavigation } from "./components.js"

function findNodes(node, predicate) {
  return (node.children ?? []).flatMap((child) => [
    ...(predicate(child) ? [child] : []),
    ...findNodes(child, predicate),
  ])
}

test("drawer links resolve from nested articles and years exclude unlisted and empty folders", () => {
  const html = render(
    h(MobileNavigation(), {
      fileData: { slug: "2024/bafici25/dia-1" },
      cfg: { pageTitle: "Bosque Digital" },
      allFiles: [
        { slug: "2021/empresa-estado" },
        { slug: "2026/post" },
        { slug: "2026/another" },
        { slug: "2024/bafici25/dia-1" },
        { slug: "2027/secret", unlisted: true },
        { slug: "2028/index" },
        { slug: "random/about-obsidian" },
      ],
    }),
  )
  const tree = fromHtml(html, { fragment: true })
  const links = findNodes(tree, (node) => node.tagName === "a")
  assert.deepEqual(
    links.map((node) => node.properties.href),
    [
      "../..",
      "../../archivo",
      "../../random/about-obsidian",
      "../../#tecnología-y-proyectos",
      "../../#música-y-cine",
      "../../#libros-política-y-otras-ideas",
      "../../2026/",
      "../../2024/",
      "../../2021/",
    ],
  )
})

test("drawer identifies the active page", () => {
  for (const [slug, expected] of [
    ["index", "."],
    ["archivo", "./archivo"],
    ["2026/index", "../2026/"],
  ]) {
    const tree = fromHtml(
      render(
        h(MobileNavigation(), {
          fileData: { slug },
          cfg: { pageTitle: "Bosque Digital" },
          allFiles: [{ slug: "2026/post" }],
        }),
      ),
      { fragment: true },
    )
    const current = findNodes(tree, (node) => node.properties?.ariaCurrent === "page")
    assert.equal(current.length, 1)
    assert.equal(current[0].properties.href, expected)
  }
})

function setup() {
  class FakeElement extends EventTarget {
    attributes = new Map()
    open = false
    clicks = 0
    closest() {
      return null
    }
    setAttribute(name, value) {
      this.attributes.set(name, value)
    }
    getBoundingClientRect() {
      return { left: 0, top: 0, right: 340, bottom: 800 }
    }
    showModal() {
      this.open = true
    }
    close() {
      this.open = false
      this.dispatchEvent(new Event("close"))
    }
    click() {
      this.clicks++
      this.dispatchEvent(new Event("click"))
    }
  }
  const toggle = new FakeElement()
  const drawer = new FakeElement()
  const close = new FakeElement()
  const search = new FakeElement()
  const siteSearch = new FakeElement()
  drawer.querySelector = (selector) => (selector === ".mobile-drawer-close" ? close : search)
  const doc = new EventTarget()
  const classes = new Set()
  doc.documentElement = {
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
  }
  doc.querySelector = (selector) =>
    ({
      ".mobile-navigation-toggle": toggle,
      ".mobile-drawer": drawer,
      ".sidebar.left .search-button": siteSearch,
    })[selector]
  const media = new FakeElement()
  media.matches = true
  const cleanups = []
  vm.runInNewContext(MobileNavigation().afterDOMLoaded, {
    document: doc,
    Element: FakeElement,
    window: { matchMedia: () => media, addCleanup: (fn) => cleanups.push(fn) },
  })
  doc.dispatchEvent(new Event("nav"))
  return { toggle, drawer, close, search, siteSearch, doc, media, classes, cleanups }
}

test("drawer closes on the backdrop, preserves interior clicks, and clears the scroll lock", () => {
  const { toggle, drawer, classes } = setup()
  toggle.click()
  assert.equal(drawer.open, true)
  assert.equal(toggle.attributes.get("aria-expanded"), "true")
  assert.equal(classes.has("mobile-navigation-open"), true)
  drawer.dispatchEvent(Object.assign(new Event("click"), { clientX: 100, clientY: 100 }))
  assert.equal(drawer.open, true)
  drawer.dispatchEvent(Object.assign(new Event("click"), { clientX: 390, clientY: 100 }))
  assert.equal(drawer.open, false)
  assert.equal(classes.has("mobile-navigation-open"), false)
  assert.equal(toggle.attributes.get("aria-expanded"), "false")
})

test("search hands off to the existing search and navigation closes the drawer", () => {
  const { toggle, drawer, search, siteSearch, doc, classes } = setup()
  toggle.click()
  search.click()
  assert.equal(drawer.open, false)
  assert.equal(siteSearch.clicks, 1)
  toggle.click()
  doc.dispatchEvent(new Event("prenav"))
  assert.equal(drawer.open, false)
  assert.equal(classes.has("mobile-navigation-open"), false)
})

test("desktop resize and SPA cleanup dismiss the drawer and detach old controls", () => {
  const { toggle, drawer, media, cleanups, classes } = setup()
  toggle.click()
  media.matches = false
  media.dispatchEvent(new Event("change"))
  assert.equal(drawer.open, false)
  toggle.click()
  assert.equal(drawer.open, false)
  media.matches = true
  toggle.click()
  cleanups[0]()
  assert.equal(drawer.open, false)
  assert.equal(classes.has("mobile-navigation-open"), false)
  toggle.click()
  assert.equal(drawer.open, false)
})
