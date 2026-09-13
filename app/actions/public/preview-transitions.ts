import { navigate } from "remix/ui"

// Experiment: animate preview-picker navigation while Remix owns the document update.
export function installPreviewTransitions() {
  if (!document.startViewTransition || !window.navigation) return

  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let active: ViewTransition | undefined

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion.matches
    ) {
      return
    }

    let link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("#design-font-picker a[href]")
        : null
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return
    if (link.hasAttribute("data-rmx-document")) return

    let destination = new URL(link.href)
    if (destination.origin !== location.origin || destination.pathname !== location.pathname) return

    event.preventDefault()
    let href = destination.href
    active?.skipTransition()

    let transition = document.startViewTransition(async () => {
      await navigate(href, { resetScroll: false })
    })
    active = transition

    // Skipping an animation must not turn a successful navigation into an error.
    void transition.ready.catch(() => {})
    void transition.finished.then(
      () => {
        if (active === transition) active = undefined
      },
      (error) => {
        if (active === transition) active = undefined
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Preview transition failed", error)
        }
      },
    )
  })
}
