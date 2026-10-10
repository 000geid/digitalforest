import { RecentNotes } from "@quartz-community/recent-notes/components"

export const RecentNotesMenu = (options) => RecentNotes({ ...options, ...blogEntryOptions })

export const blogEntryOptions = {
  hideTagPages: true,
  hideFolderPages: true,
  filter: (page) => /^\d{4}\//.test(page.slug ?? ""),
}
