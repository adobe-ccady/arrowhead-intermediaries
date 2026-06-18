/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-banner.
 * Base block: columns (core/franklin/components/columns/v1/columns).
 * Source: https://arrowheadintermediaries.com/ (#our-leaders)
 * Generated for xwalk project.
 *
 * Layout: a 2-column, single-row side-by-side banner.
 *   - Left column: horizontal leadership image (Meet-Leaders_horizontal-image.png)
 *   - Right column: heading ("Meet our leaders"), a paragraph, and a "View Leadership" CTA.
 *
 * Notes:
 *   - This is a Columns block, so NO field-hint comments are added (Columns blocks
 *     use default content only and do not require <!-- field:... --> hints).
 *   - The CTA links to /leadership/ and is kept internal/relative.
 *   - The columns block expects one row whose cells are the columns.
 */
export default function parse(element, { document }) {
  // The inner wrapper holds the two column containers as direct children.
  const inner = element.querySelector('.e-con-inner') || element;

  // Two column containers (image column + text/CTA column). Fall back to direct
  // children of the inner wrapper if the elementor child classes vary.
  let columnContainers = Array.from(inner.querySelectorAll(':scope > .e-con.e-child'));
  if (columnContainers.length < 2) {
    columnContainers = Array.from(inner.querySelectorAll(':scope > div'));
  }

  // Left column: the leadership image.
  const image = element.querySelector('.elementor-widget-image img, img');

  // Right column content: heading, paragraph, CTA.
  const heading = element.querySelector(
    '.elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, h2, h3'
  );
  const paragraph = element.querySelector(
    '.elementor-widget-text-editor p, p'
  );
  // CTA: prefer the elementor button link; keep its href relative/internal.
  const cta = element.querySelector(
    '.elementor-widget-button a, a.elementor-button, a[href="/leadership/"]'
  );
  if (cta) {
    // Flatten elementor's nested span wrappers down to plain link text so the
    // anchor renders as a simple CTA link.
    const label = cta.textContent.trim();
    if (label) cta.textContent = label;
  }

  // Empty-block guard: bail gracefully if essential content is missing.
  if (!image && !heading && !paragraph && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left cell: the image.
  const leftCell = [];
  if (image) leftCell.push(image);

  // Right cell: heading, paragraph, then CTA (in that order).
  const rightCell = [];
  if (heading) rightCell.push(heading);
  if (paragraph) rightCell.push(paragraph);
  if (cta) rightCell.push(cta);

  // Single row of two columns (cells). No field hints for Columns blocks.
  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
