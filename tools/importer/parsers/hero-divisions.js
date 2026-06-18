/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-divisions.
 * Base block: hero
 * Source: https://arrowheadintermediaries.com/
 * Generated: 2026-06-17
 *
 * Model (blocks/hero-divisions/_hero-divisions.json) — simple block:
 *   - image    (reference)  -> row 1 (empty: background VIDEO is intentionally NOT migrated)
 *   - imageAlt (text, collapsed into image, no hint)
 *   - text     (richtext)   -> row 2: heading + intro paragraph + 3 external quick-link buttons
 *
 * Notes:
 *   - The background video (AI-background-video.mp4) is NOT migrated as interactive media;
 *     the image row is left empty per the local block model (imageCount: 0).
 *   - The .hero-mouse scroll anchor is removed by the cleanup transformer; it is excluded here.
 *   - The three division links (Programs/Wholesale/Specialty) stay EXTERNAL (href preserved).
 */
export default function parse(element, { document }) {
  // --- Extract content (validated against source.html) ---
  // Heading: <h2 class="elementor-heading-title ...">
  const heading = element.querySelector('h2.elementor-heading-title, .elementor-widget-heading h2, h1, h2');

  // Intro paragraph: inside the text-editor widget
  const description = element.querySelector('.elementor-widget-text-editor p, p');

  // Three external quick-link buttons: <a class="elementor-button ..."> within .hero-btn widgets
  // (exclude the .hero-mouse anchor explicitly)
  const buttonLinks = Array.from(
    element.querySelectorAll('.hero-btn a.elementor-button, a.elementor-button'),
  ).filter((a) => !a.classList.contains('hero-mouse'));

  // Empty-block guard
  if (!heading && !description && buttonLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Build the richtext "text" cell content ---
  const textCellNodes = [];
  if (heading) {
    // Normalize the heading to a clean h1 for the hero (drop Elementor classes/<br>).
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    textCellNodes.push(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.replace(/\s+/g, ' ').trim();
    textCellNodes.push(p);
  }
  buttonLinks.forEach((a) => {
    // Preserve external href; build a clean anchor with just the button label.
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    const label = a.querySelector('.elementor-button-text');
    link.textContent = (label ? label.textContent : a.textContent).replace(/\s+/g, ' ').trim();
    const p = document.createElement('p');
    p.appendChild(link);
    textCellNodes.push(p);
  });

  // --- Field hints (xwalk) ---
  // Row 1: image (reference). No image migrated -> empty cell, NO hint (Rule 2).
  const imageCell = document.createElement('div');

  // Row 2: text (richtext). Mandatory field hint before content.
  const textCell = document.createElement('div');
  textCell.appendChild(document.createComment(' field:text '));
  textCellNodes.forEach((node) => textCell.appendChild(node));

  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-divisions', cells });
  element.replaceWith(block);
}
