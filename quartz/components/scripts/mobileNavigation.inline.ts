let mobileNavigationCleanup = () => {}

function setupMobileNavigation() {
  mobileNavigationCleanup()

  const toggle = document.querySelector<HTMLButtonElement>(".mobile-navigation-toggle")
  const drawer = document.querySelector<HTMLDialogElement>(".mobile-drawer")
  const close = drawer?.querySelector<HTMLButtonElement>(".mobile-drawer-close")
  const search = drawer?.querySelector<HTMLButtonElement>(".mobile-drawer-search")
  if (!toggle || !drawer || !close || !search) return

  const mobile = window.matchMedia("(max-width: 800px)")
  const onClose = () => {
    toggle.setAttribute("aria-expanded", "false")
    document.documentElement.classList.remove("mobile-navigation-open")
  }
  const closeDrawer = () => {
    if (drawer.open) drawer.close()
    onClose()
  }
  const openDrawer = () => {
    if (!mobile.matches || drawer.open) return
    drawer.showModal()
    toggle.setAttribute("aria-expanded", "true")
    document.documentElement.classList.add("mobile-navigation-open")
  }
  const onDrawerClick = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeDrawer()
    } else if (event.target === drawer) {
      const bounds = drawer.getBoundingClientRect()
      if (
        event.clientX < bounds.left ||
        event.clientX >= bounds.right ||
        event.clientY < bounds.top ||
        event.clientY >= bounds.bottom
      ) {
        closeDrawer()
      }
    }
  }
  const openSearch = () => {
    closeDrawer()
    document.querySelector<HTMLButtonElement>(".sidebar.left .search-button")?.click()
  }
  const onResize = () => {
    if (!mobile.matches) closeDrawer()
  }

  toggle.addEventListener("click", openDrawer)
  close.addEventListener("click", closeDrawer)
  search.addEventListener("click", openSearch)
  drawer.addEventListener("click", onDrawerClick)
  drawer.addEventListener("close", onClose)
  mobile.addEventListener("change", onResize)
  document.addEventListener("prenav", closeDrawer)

  mobileNavigationCleanup = () => {
    closeDrawer()
    toggle.removeEventListener("click", openDrawer)
    close.removeEventListener("click", closeDrawer)
    search.removeEventListener("click", openSearch)
    drawer.removeEventListener("click", onDrawerClick)
    drawer.removeEventListener("close", onClose)
    mobile.removeEventListener("change", onResize)
    document.removeEventListener("prenav", closeDrawer)
  }
  window.addCleanup?.(mobileNavigationCleanup)
}

document.addEventListener("nav", setupMobileNavigation)
