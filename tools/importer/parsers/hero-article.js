/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article.
 * Base block: hero
 * Source: https://arrowheadintermediaries.com/news/arrowhead-intermediaries-appoints-benjamin-auray-as-chief-commercial-officer/
 * Generated: 2026-06-22
 *
 * Model (blocks/hero-article/_hero-article.json) — simple block:
 *   - image    (reference) -> row 1: the wide horizontal cover image
 *   - imageAlt (text, collapsed into <img alt="...">, no hint)
 *   - text     (richtext)  -> row 2: category label + headline
 *
 * The article-header container holds the post title (<h2>) and the featured
 * cover image (<img>). The category label ("Leadership Appointment") comes from
 * page metadata (page-structure.json) since the source renders it as a graphic.
 * The article BODY (.elementor-widget-theme-post-content) is NOT part of this
 * block — it is migrated as default content.
 */
export default function parse(element, { document }) {
  // --- Extract content (validated against cleaned.html) ---
  // Headline: post title <h2> inside the header container.
  const heading = element.querySelector(
    '.elementor-widget-theme-post-title h2, .elementor-widget-theme-post-title h1, h2, h1',
  );

  // Cover image: the featured-image widget's <img> (exclude any body images).
  const img = element.querySelector(
    '.elementor-widget-theme-post-featured-image img, img',
  );

  // Category label from analysis (source renders it as a graphic, not text).
  const categoryLabel = 'Leadership Appointment';

  // Empty-block guard.
  if (!heading && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Row 1: image (reference). Field hint required before the image. ---
  const imageCell = document.createElement('div');
  imageCell.appendChild(document.createComment(' field:image '));
  if (img) {
    const cleanImg = document.createElement('img');
    cleanImg.setAttribute('src', img.getAttribute('src'));
    cleanImg.setAttribute('alt', img.getAttribute('alt') || '');
    imageCell.appendChild(cleanImg);
  }

  // --- Row 2: text (richtext). Category label (eyebrow) + headline. ---
  const textCell = document.createElement('div');
  textCell.appendChild(document.createComment(' field:text '));

  if (categoryLabel) {
    const label = document.createElement('p');
    label.textContent = categoryLabel;
    textCell.appendChild(label);
  }

  if (heading) {
    // Normalize to a clean <h1> for the article header (drop Elementor classes).
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    textCell.appendChild(h1);
  }

  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });

  // The article body (.elementor-widget-theme-post-content) is nested INSIDE this
  // header container. Replacing the container wholesale would destroy it, so move
  // the body out and keep it as default content below the header, separated by a
  // section break. (The sections transformer cannot anchor to the body once the
  // container is replaced, so we insert the break and the body's Section Metadata
  // here.)
  const body = element.querySelector('.elementor-widget-theme-post-content');
  if (body) {
    // Section Metadata (style: article-body) applies the article prose styling
    // (constrained column, bold-italic deck, floated headshot + caption).
    const bodyMeta = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: { style: 'article-body' },
    });
    element.replaceWith(block, document.createElement('hr'), body, bodyMeta);
  } else {
    element.replaceWith(block);
  }
}
