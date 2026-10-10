import { readFileSync } from "node:fs"
import { transformSync } from "esbuild"
import { h } from "preact"
import { pathToRoot, joinSegments } from "@quartz-community/utils/path"

const script = transformSync(
  readFileSync(new URL("../scripts/mobileNavigation.inline.ts", import.meta.url), "utf8"),
  { loader: "ts" },
).code

function icon(name) {
  return h(
    "svg",
    {
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "aria-hidden": "true",
    },
    name === "menu"
      ? [6, 12, 18].map((y) => h("path", { d: `M4 ${y}h16` }))
      : name === "close"
        ? [h("path", { d: "M6 6l12 12M6 18L18 6" })]
        : [h("circle", { cx: 10.5, cy: 10.5, r: 6.5 }), h("path", { d: "m16 16 4 4" })],
  )
}

const MobileNavigationComponent = ({ fileData, allFiles, cfg }) => {
  const root = pathToRoot(fileData.slug)
  const link = (slug, label) =>
    h(
      "a",
      {
        href: joinSegments(root, slug),
        class: "internal mobile-drawer-link",
        "aria-current":
          fileData.slug === slug || fileData.slug === `${slug}index` ? "page" : undefined,
      },
      label,
    )
  const years = [
    ...new Set(
      allFiles
        .filter((page) => page.unlisted !== true && /^\d{4}\/(?!index$).+/.test(page.slug ?? ""))
        .map((page) => page.slug.split("/")[0]),
    ),
  ].sort((a, b) => Number(b) - Number(a))

  return h(
    "div",
    { class: "mobile-navigation" },
    h(
      "button",
      {
        type: "button",
        class: "mobile-navigation-toggle",
        "aria-label": "Abrir menú",
        "aria-expanded": "false",
        "aria-controls": "mobile-drawer",
        "aria-haspopup": "dialog",
      },
      icon("menu"),
    ),
    h(
      "dialog",
      { id: "mobile-drawer", class: "mobile-drawer", "aria-labelledby": "mobile-drawer-title" },
      h(
        "header",
        { class: "mobile-drawer-header" },
        h("h2", { id: "mobile-drawer-title" }, cfg.pageTitle),
        h(
          "button",
          {
            type: "button",
            class: "mobile-drawer-close",
            "aria-label": "Cerrar menú",
            autofocus: true,
          },
          icon("close"),
        ),
      ),
      h(
        "div",
        { class: "mobile-drawer-content" },
        h(
          "button",
          { type: "button", class: "mobile-drawer-search" },
          icon("search"),
          "Buscar en el blog",
        ),
        h(
          "nav",
          { "aria-label": "Navegación principal", class: "mobile-drawer-links" },
          link("", "Inicio"),
          link("archivo", "Archivo completo"),
          link("random/about-obsidian", "Sobre este sitio"),
        ),
        h("h3", { class: "mobile-drawer-label", id: "mobile-drawer-topics" }, "Explorar por tema"),
        h(
          "nav",
          { "aria-labelledby": "mobile-drawer-topics", class: "mobile-drawer-links" },
          link("#tecnología-y-proyectos", "Tecnología y proyectos"),
          link("#música-y-cine", "Música y cine"),
          link("#libros-política-y-otras-ideas", "Libros, política y otras ideas"),
        ),
        h(
          "details",
          { class: "mobile-drawer-years" },
          h("summary", {}, "Por año"),
          h(
            "nav",
            { "aria-label": "Archivo por año", class: "mobile-drawer-links" },
            years.map((year) => link(`${year}/`, year)),
          ),
        ),
      ),
    ),
  )
}

MobileNavigationComponent.afterDOMLoaded = script

export const MobileNavigation = () => MobileNavigationComponent
