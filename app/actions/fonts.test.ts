import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BODY_FONT_WEIGHTS,
  bodyFontStylesheetUrl,
  cssFontFamilyValue,
  FONT_CONFIGS,
  fontConfigAt,
  googleFontsStylesheetUrl,
  pickerPreviewFamilies,
  pickerPreviewStylesheetUrl,
  pickerPreviewText,
} from "./fonts.ts";

test("body stylesheets request the used variable range, swap display, and no italics or text subset", () => {
  for (let [, family] of FONT_CONFIGS) {
    let url = bodyFontStylesheetUrl(family);
    assert.match(url, /^https:\/\/fonts\.googleapis\.com\/css2\?/);
    assert.match(url, new RegExp(`family=${family.replaceAll(" ", "\\+")}:wght@400\\.\\.700`));
    assert.match(url, /display=swap/);
    assert.doesNotMatch(url, /ital/);
    assert.doesNotMatch(url, /text=/);
    assert.doesNotMatch(url, /400;500;700/);
  }
  assert.equal(fontConfigAt(0)[1], "Inter");
  assert.equal(fontConfigAt(99)[1], "Inter");
  assert.equal(cssFontFamilyValue("Instrument Sans"), "'Instrument Sans', var(--font-sans)");
});

test("picker preview stylesheets subset family names and skip the active family", () => {
  let text = pickerPreviewText();
  assert.equal(text, " ()DGIMSacefiklmnoprstu");
  for (let [displayName] of FONT_CONFIGS) {
    for (let char of displayName) assert.ok(text.includes(char), displayName);
  }

  let url = pickerPreviewStylesheetUrl("Inter");
  assert.match(url, /display=swap/);
  assert.match(url, /text=/);
  assert.ok(url.includes(`text=${encodeURIComponent(text)}`));
  assert.doesNotMatch(url, /ital/);
  assert.doesNotMatch(url, /Inter/);
  assert.match(url, /family=Geist:wght@400/);
  assert.match(url, /family=Instrument\+Sans:wght@400/);
  assert.match(url, /family=DM\+Sans:wght@400/);
  assert.match(url, /family=Space\+Grotesk:wght@400/);
  assert.doesNotMatch(url, /400\.\.700/);
  assert.deepEqual(pickerPreviewFamilies("Geist"), [
    "Inter",
    "Instrument Sans",
    "DM Sans",
    "Space Grotesk",
  ]);
});

test("google fonts helper encodes spaces and omits empty text", () => {
  assert.equal(
    googleFontsStylesheetUrl(["DM Sans"], "400"),
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&display=swap",
  );
  assert.equal(
    googleFontsStylesheetUrl(["Inter"], "400", ""),
    "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
  );
  assert.equal(
    googleFontsStylesheetUrl("Space Grotesk", "400"),
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap",
  );
  assert.equal(
    googleFontsStylesheetUrl(["DM Sans", "Space Grotesk"], "400"),
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&family=Space+Grotesk:wght@400&display=swap",
  );
});

test("google fonts helper encodes supplied text", () => {
  assert.equal(
    googleFontsStylesheetUrl("Instrument Sans", "400", "Remix"),
    "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400&display=swap&text=Remix",
  );
  assert.equal(
    googleFontsStylesheetUrl(["DM Sans", "Space Grotesk"], "400", "Remix"),
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&family=Space+Grotesk:wght@400&display=swap&text=Remix",
  );
});

test("google fonts helper accepts multiple font weights", () => {
  assert.equal(
    googleFontsStylesheetUrl(["DM Sans", "Space Grotesk"], BODY_FONT_WEIGHTS),
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Space+Grotesk:wght@400..700&display=swap",
  );
});
