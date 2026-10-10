import { h } from "preact"
import { render } from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import { ContentBody } from "@quartz-community/content-page/components"
import { RecentNotes } from "@quartz-community/recent-notes/components"
import { blogEntryOptions } from "./components.js"

export const BlogNavigationPages = (options) => {
  const Content = ContentBody()
  const Recent = RecentNotes({ ...options, ...blogEntryOptions, showTags: false })
  const Archive = RecentNotes({ ...options, ...blogEntryOptions, showTags: false, limit: Infinity })

  const NavigationBody = (props) => {
    const tree = {
      ...props.tree,
      children: props.tree.children.map((node) => {
        const mode = node.type === "element" && node.properties?.dataBlogEntries
        if (mode !== "recent" && mode !== "archive") return node

        // Render the existing list into the Markdown slot during the build.
        const list = fromHtml(render(h(mode === "recent" ? Recent : Archive, props)), {
          fragment: true,
        }).children[0]
        list.properties.className.push("blog-entries")
        list.children = list.children.filter(
          (child) => child.type !== "element" || child.tagName !== "h3",
        )
        return list
      }),
    }
    return h(Content, { ...props, tree })
  }
  NavigationBody.css = Recent.css

  return {
    name: "BlogNavigationPages",
    priority: 100,
    match: ({ slug }) => slug === "index" || slug === "archivo",
    layout: "content",
    body: () => NavigationBody,
  }
}
