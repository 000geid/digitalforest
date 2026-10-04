let recentNotesMenuCleanup = () => {}

function setupRecentNotesMenu() {
  recentNotesMenuCleanup()

  const sidebar = document.querySelector<HTMLElement>(".sidebar.left")
  const notes = sidebar?.querySelector<HTMLElement>(".recent-notes")
  const explorer = sidebar?.querySelector<HTMLElement>(".explorer")
  const explorerContent = explorer?.querySelector<HTMLElement>(".explorer-content")
  const explorerList = explorerContent?.querySelector<HTMLElement>(".explorer-ul")
  if (!sidebar || !notes || !explorer || !explorerContent || !explorerList) return

  const mobile = window.matchMedia("(max-width: 800px)")
  const placeNotes = () => {
    if (mobile.matches) {
      explorerContent.insertBefore(notes, explorerList)
    } else {
      sidebar.insertBefore(notes, explorer)
    }
  }

  placeNotes()
  mobile.addEventListener("change", placeNotes)
  recentNotesMenuCleanup = () => mobile.removeEventListener("change", placeNotes)
}

document.addEventListener("nav", setupRecentNotesMenu)
setupRecentNotesMenu()
