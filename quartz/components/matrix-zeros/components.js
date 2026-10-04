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
const rows = 19
const glyphStartX = 11
const glyphStartY = 3

function showBackgroundCharacter(x, y) {
  const edgeDistance = Math.min(x, columns - 1 - x, y, rows - 1 - y)
  const density = [12, 35, 60, 85][edgeDistance] ?? 100
  const hash = (x * 37 + y * 73 + x * y * 19) % 100
  return hash < density
}

const characterRows = Array.from({ length: rows }, (_, y) =>
  h(
    "div",
    { class: "matrix-zeros-row", style: { width: "100%", whiteSpace: "nowrap" } },
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
      const visible = foreground || showBackgroundCharacter(x, y)
      return h(
        "span",
        {
          class: foreground
            ? "matrix-character foreground"
            : visible
              ? "matrix-character"
              : "matrix-character empty",
          "aria-hidden": "true",
          style: {
            display: "inline-block",
            width: `calc(100% / ${columns})`,
            textAlign: "center",
            visibility: visible ? "visible" : "hidden",
          },
        },
        foreground || (x * 7 + y * 11) % 3 === 0 ? "0" : "1",
      )
    }),
  ),
)

const MatrixZerosComponent = () =>
  h(
    "div",
    {
      class: "matrix-zeros",
      role: "button",
      tabIndex: 0,
      "aria-label": "Animar 000",
      "data-columns": columns,
      "data-rows": rows,
      style: { display: "block", width: "min(100%, 44rem)" },
    },
    h("div", { class: "matrix-zeros-grid", "aria-hidden": "true" }, characterRows),
  )

MatrixZerosComponent.afterDOMLoaded = script

export const MatrixZeros = () => MatrixZerosComponent
