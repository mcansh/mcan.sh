const PICKER_ID = "design-font-picker"
const PICKER_BUTTON = '[popovertarget="design-font-picker"]'
const LOADED_ATTR = "data-font-role"

function pickerElement(): HTMLElement | null {
  let node = document.getElementById(PICKER_ID)
  if (!(node instanceof HTMLElement)) return null
  return node
}

function isOpenToggle(event: Event): boolean {
  if (!("newState" in event)) return false
  return event.newState === "open"
}

function loadPickerPreviewFonts(picker: HTMLElement) {
  let href = picker.getAttribute("data-picker-fonts")
  if (href === null || href === "") return
  if (document.querySelector(`link[${LOADED_ATTR}="picker-preview"]`) !== null) return

  let link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.setAttribute(LOADED_ATTR, "picker-preview")
  link.addEventListener("error", () => link.remove(), { once: true })
  document.head.append(link)
}

export function installPickerFontLoader() {
  document.addEventListener(
    "toggle",
    (event) => {
      if (!(event.target instanceof HTMLElement)) return
      if (event.target.id !== PICKER_ID) return
      if (!isOpenToggle(event)) return
      loadPickerPreviewFonts(event.target)
    },
    true,
  )

  document.addEventListener(
    "pointerenter",
    (event) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest(PICKER_BUTTON) === null) return
      let picker = pickerElement()
      if (picker === null) return
      loadPickerPreviewFonts(picker)
    },
    true,
  )

  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element)) return
    if (event.target.closest(`${PICKER_BUTTON}, #${PICKER_ID}`) === null) return
    let picker = pickerElement()
    if (picker === null) return
    loadPickerPreviewFonts(picker)
  })
}
