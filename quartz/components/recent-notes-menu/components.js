import { readFileSync } from "node:fs"
import { transformSync } from "esbuild"
import { RecentNotes } from "@quartz-community/recent-notes/components"

const script = transformSync(
  readFileSync(new URL("../scripts/recentNotesMenu.inline.ts", import.meta.url), "utf8"),
  { loader: "ts" },
).code

export const RecentNotesMenu = (options) => {
  const component = RecentNotes(options)
  component.afterDOMLoaded = script
  return component
}
