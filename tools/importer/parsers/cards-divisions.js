/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-divisions.
 * Base block: cards.
 * Source: https://arrowheadintermediaries.com/ (#our-divisions)
 * Generated: 2026-06-17
 *
 * Block model (xwalk, container block - blocks/cards-divisions/_cards-divisions.json):
 *   child item "cards-divisions-card": { image (reference), text (richtext) }
 *   => each card = one ROW with two COLUMNS: [image cell, text cell]
 *
 * Source structure (Elementor): #our-divisions contains an intro <h3> (section
 * default-content, handled elsewhere) followed by three division containers
 * (.e-child), each holding:
 *   - a category heading <h4> (PROGRAMS / WHOLESALE / SPECIALTY)
 *   - an image-box widget with a linked logo <img> and a description <p> that
 *     carries an embedded EXTERNAL division link.
 *
 * Fixed card order is preserved by iterating the .e-child containers in document
 * order: PROGRAMS -> WHOLESALE -> SPECIALTY.
 *
 * All three division links (the logo anchor and the embedded paragraph anchor)
 * are EXTERNAL (https://arrowheadprograms.com/, https://bridgespecialtygroup.com/,
 * https://www.one80.com/) and are preserved verbatim so they stay external.
 */
export default function parse(element, { document }) {
  // Each division card lives in a direct .e-child container inside the inner wrapper.
  const cardContainers = element.querySelectorAll(
    ':scope > .e-con-inner > .e-child, :scope .e-con-inner > .e-con.e-child',
  );

  const cells = [];

  cardContainers.forEach((card) => {
    // Linked logo image (the <a> wraps the <img>; the anchor href is the external division link).
    const imageLink = card.querySelector('.elementor-image-box-img a, figure a');
    const img = card.querySelector('.elementor-image-box-img img, figure img, img');

    // Category heading: PROGRAMS / WHOLESALE / SPECIALTY.
    const heading = card.querySelector('.elementor-widget-heading h4, h4, [class*="heading-title"]');

    // Description paragraph (contains the embedded external link).
    const description = card.querySelector('.elementor-image-box-description, .elementor-image-box-content p, p');

    // Skip a container that has no usable content.
    if (!img && !heading && !description) return;

    // --- Image cell: field:image (collapsed alt). Keep the external linking anchor. ---
    const imageCell = document.createComment(' field:image ');
    const imageContent = [];
    if (imageLink) {
      // Preserve the anchor wrapping the image so the external division link is retained.
      imageContent.push(imageLink);
    } else if (img) {
      imageContent.push(img);
    }

    // --- Text cell: field:text (richtext). Category heading + description paragraph. ---
    const textComment = document.createComment(' field:text ');
    const textContent = [];
    if (heading) {
      // Normalize the Elementor heading to a clean <h4> for the richtext field.
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      textContent.push(h);
    }
    if (description) {
      // Description <p> carries the embedded EXTERNAL link (preserved verbatim).
      textContent.push(description);
    }

    cells.push([
      [imageCell, ...imageContent],
      [textComment, ...textContent],
    ]);
  });

  // Empty-block guard: no division cards found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-divisions', cells });

  // Preserve the section heading ("Explore our divisions") as default content
  // above the block so it survives import (the block selector is the whole
  // #our-divisions section, which would otherwise consume the heading).
  const sectionHeading = element.querySelector(
    ':scope > .e-con-inner > .elementor-widget-heading h3, :scope .elementor-widget-heading h3',
  );
  if (sectionHeading) {
    const h = document.createElement('h3');
    h.textContent = sectionHeading.textContent.trim();
    element.replaceWith(h, block);
  } else {
    element.replaceWith(block);
  }
}
