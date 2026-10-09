import { readFileSync } from "node:fs"
import { transformSync } from "esbuild"
import { h } from "preact"

const script = transformSync(
  readFileSync(new URL("../scripts/matrixZeros.inline.ts", import.meta.url), "utf8"),
  { loader: "ts" },
).code

const glyph = [
  "001111111100",
  "001111111100",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "110000000011",
  "001111111100",
  "001111111100",
]
const columns = 64
const glyphStartX = 11

// Desktop keeps the original proportions; mobile uses a compact grid so the
// band stays short on narrow screens. CSS toggles visibility by breakpoint.
const variants = {
  desktop: { rows: 19, glyphStartY: 3 },
  mobile: { rows: 15, glyphStartY: 1 },
}

function showBackgroundCharacter(rows, x, y) {
  const edgeDistance = Math.min(x, columns - 1 - x, y, rows - 1 - y)
  const density = [12, 35, 60, 85][edgeDistance] ?? 100
  const hash = (x * 37 + y * 73 + x * y * 19) % 100
  return hash < density
}

function buildGrid(rows, glyphStartY) {
  return Array.from({ length: rows }, (_, y) =>
    h(
      "div",
      { class: "matrix-zeros-row" },
      Array.from({ length: columns }, (_, x) => {
        const digit = Math.floor((x - glyphStartX) / 16)
        const digitX = (x - glyphStartX) % 16
        const glyphY = y - glyphStartY
        const foreground =
          digit >= 0 &&
          digit < 3 &&
          digitX < 12 &&
          glyphY >= 0 &&
          glyphY < glyph.length &&
          glyph[glyphY][digitX] === "1"
        const visible = foreground || showBackgroundCharacter(rows, x, y)
        return h(
          "span",
          {
            class: foreground
              ? "matrix-character foreground"
              : visible
                ? "matrix-character"
                : "matrix-character empty",
          },
          foreground || (x * 7 + y * 11) % 3 === 0 ? "0" : "1",
        )
      }),
    ),
  )
}

function buildGridElement(variant, rows, glyphStartY) {
  return h(
    "div",
    {
      class: `matrix-zeros-grid matrix-zeros-grid--${variant}`,
      "aria-hidden": "true",
      "data-columns": columns,
      "data-rows": rows,
    },
    buildGrid(rows, glyphStartY),
  )
}

const MatrixZerosComponent = () =>
  h(
    "div",
    {
      class: "matrix-zeros",
      role: "button",
      tabIndex: 0,
      "aria-label": "Animar 000",
    },
    buildGridElement("desktop", variants.desktop.rows, variants.desktop.glyphStartY),
    buildGridElement("mobile", variants.mobile.rows, variants.mobile.glyphStartY),
  )

MatrixZerosComponent.afterDOMLoaded = script

export const MatrixZeros = () => MatrixZerosComponent
