/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-story (xwalk container block).
 * Base block: tabs
 * Source: https://arrowheadintermediaries.com/ (homepage "Read our story" tabs)
 * Generated: 2026-06-17
 *
 * Source markup is Elementor nested-tabs:
 *   .e-n-tabs-heading > button.e-n-tab-title > span.e-n-tab-title-text  (labels)
 *   .e-n-tabs-content > div[role=tabpanel] > figure>img + p             (panels)
 *
 * Container block: each tab = one row.
 *   Cell 1: tab title            -> field:title
 *   Cell 2: panel content        -> field:content_heading + field:content_image + field:content_richtext
 * content_headingType is a collapsed (Type) field — no cell/hint.
 */
export default function parse(element, { document }) {
  // Tab labels — buttons in the heading row, in document order.
  const tabTitles = Array.from(
    element.querySelectorAll('.e-n-tabs-heading .e-n-tab-title .e-n-tab-title-text, .e-n-tabs-heading .e-n-tab-title'),
  );
  // Dedupe: prefer the inner span text node; fall back to the button itself.
  const labelEls = Array.from(
    element.querySelectorAll('.e-n-tabs-heading .e-n-tab-title'),
  ).map((btn) => btn.querySelector('.e-n-tab-title-text') || btn);

  // Tab panels — content containers, in document order.
  const panels = Array.from(
    element.querySelectorAll('.e-n-tabs-content [role="tabpanel"], .e-n-tabs-content > div'),
  );

  // Empty-block guard: nothing meaningful to import.
  if (labelEls.length === 0 && panels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const count = Math.max(labelEls.length, panels.length);

  for (let i = 0; i < count; i += 1) {
    const labelEl = labelEls[i];
    const panel = panels[i];

    // ---- Cell 1: tab title (field:title) ----
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:title '));
    if (labelEl) {
      const labelText = (labelEl.textContent || '').trim();
      // Prefer the aria-label of the matching panel if the button text is empty.
      const text = labelText || (panel && (panel.getAttribute('aria-label') || '').trim()) || '';
      titleCell.appendChild(document.createTextNode(text));
    }

    // ---- Cell 2: panel content (heading + image + richtext) ----
    const contentCell = document.createDocumentFragment();

    // content_heading: there is no explicit heading in the source panels;
    // the tab label doubles as the panel heading. Leave hint + label text.
    const headingText = labelEl
      ? (labelEl.textContent || '').trim()
      : (panel && (panel.getAttribute('aria-label') || '').trim()) || '';
    if (headingText) {
      contentCell.appendChild(document.createComment(' field:content_heading '));
      contentCell.appendChild(document.createTextNode(headingText));
    }

    if (panel) {
      // content_image: the figure's image.
      const img = panel.querySelector('figure img, img');
      if (img) {
        contentCell.appendChild(document.createComment(' field:content_image '));
        contentCell.appendChild(img);
      }

      // content_richtext: the body paragraph(s).
      const paras = Array.from(panel.querySelectorAll(':scope > p, p'));
      if (paras.length) {
        contentCell.appendChild(document.createComment(' field:content_richtext '));
        paras.forEach((p) => contentCell.appendChild(p));
      }
    }

    cells.push([titleCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-story', cells });
  element.replaceWith(block);
}
