let cleanup = () => {}

function setupMatrixZeros() {
  cleanup()
  const element = document.querySelector<HTMLElement>(".matrix-zeros")
  if (!element) return

  const grids = [...element.querySelectorAll<HTMLElement>(".matrix-zeros-grid")]
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
  // mirrors the $mobile breakpoint in quartz/styles/variables.scss
  const mobileMedia = window.matchMedia("(max-width: 800px)")
  let grid: HTMLElement | undefined
  let characters: HTMLElement[] = []
  let columns = 0
  let rows = 0
  let resetTimer = 0
  let activePointerId: number | null = null

  function reset() {
    for (const character of characters) character.style.transform = ""
  }

  // bind to the grid matching the active breakpoint (desktop vs compact mobile)
  function bindActiveGrid() {
    const active =
      grids.find((candidate) => getComputedStyle(candidate).display !== "none") ?? grids[0]
    if (!active || active === grid) return
    reset()
    grid = active
    characters = [...active.querySelectorAll<HTMLElement>(".matrix-character")]
    columns = Number(active.dataset.columns)
    rows = Number(active.dataset.rows)
  }

  function disturb(x: number, y: number, strength: number) {
    if (motionPreference.matches) return
    for (let index = 0; index < characters.length; index++) {
      const character = characters[index]
      const distance = Math.hypot((index % columns) - x, Math.floor(index / columns) - y)
      if (distance > 4) continue
      const offset = (1 - distance / 4) * strength
      const dx = ((index % columns) - x) / (distance || 1)
      const dy = (Math.floor(index / columns) - y) / (distance || 1)
      character.style.transform = `translate(${dx * offset}px, ${dy * offset + offset * 0.5}px)`
    }
    window.clearTimeout(resetTimer)
    if (activePointerId === null) resetTimer = window.setTimeout(reset, 140)
  }

  function onPointer(event: PointerEvent) {
    if (event.type === "pointerdown") {
      activePointerId = event.pointerId
      element!.setPointerCapture(event.pointerId)
    } else if (activePointerId !== null && event.pointerId !== activePointerId) {
      return
    }
    const bounds = element!.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * columns
    const y = ((event.clientY - bounds.top) / bounds.height) * rows
    disturb(x, y, activePointerId === null ? 10 : 18)
  }

  function onPointerEnd(event: PointerEvent) {
    if (activePointerId !== event.pointerId) return
    activePointerId = null
    window.clearTimeout(resetTimer)
    reset()
  }

  function onClick(event: MouseEvent) {
    if (event.detail === 0) disturb(columns / 2, rows / 2, 18)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    disturb(columns / 2, rows / 2, 18)
  }

  bindActiveGrid()
  element.addEventListener("pointermove", onPointer)
  element.addEventListener("pointerdown", onPointer)
  element.addEventListener("pointerup", onPointerEnd)
  element.addEventListener("pointercancel", onPointerEnd)
  element.addEventListener("lostpointercapture", onPointerEnd)
  element.addEventListener("click", onClick)
  element.addEventListener("keydown", onKeyDown)
  motionPreference.addEventListener("change", reset)
  mobileMedia.addEventListener("change", bindActiveGrid)

  cleanup = () => {
    window.clearTimeout(resetTimer)
    element.removeEventListener("pointermove", onPointer)
    element.removeEventListener("pointerdown", onPointer)
    element.removeEventListener("pointerup", onPointerEnd)
    element.removeEventListener("pointercancel", onPointerEnd)
    element.removeEventListener("lostpointercapture", onPointerEnd)
    element.removeEventListener("click", onClick)
    element.removeEventListener("keydown", onKeyDown)
    mobileMedia.removeEventListener("change", bindActiveGrid)
    motionPreference.removeEventListener("change", reset)
    reset()
  }
}

document.addEventListener("nav", setupMatrixZeros)
document.addEventListener("prenav", cleanup)
setupMatrixZeros()
