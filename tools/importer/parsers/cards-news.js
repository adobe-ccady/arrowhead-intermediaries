/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news.
 * Base block: cards
 * Source URL: https://arrowheadintermediaries.com/
 * Generated: 2026-06-17
 *
 * Container block (cards-news-card items). Model fields (blocks/cards-news/_cards-news.json):
 *   - image (reference)  -> card cover image; imageAlt collapses into <img alt="...">
 *   - text  (richtext)   -> headline (linked) + publish date + READ THE POST » link
 *
 * Each source <article class="elementor-post"> becomes one block row with two cells:
 *   cell 1: <!-- field:image --> cover <picture>/<img>
 *   cell 2: <!-- field:text -->  headline link, date, read-more link
 *
 * The "Load More" button and pagination are dynamic post-listing features and are
 * not present in the cleaned source.html (removed upstream) — only the three static
 * article cards are parsed here.
 */
export default function parse(element, { document }) {
  // Each card is an Elementor post article. Validated against source.html.
  const articles = Array.from(element.querySelectorAll('article.elementor-post'));

  const cells = [];

  articles.forEach((article) => {
    // INPUT EXTRACTION (selectors validated against source.html) -----------------
    // Cover image lives inside the thumbnail wrapper.
    const img = article.querySelector('.elementor-post__thumbnail img, .elementor-post__thumbnail__link img, img');

    // Headline is the linked title inside .elementor-post__title.
    const titleLink = article.querySelector('.elementor-post__title a, h3 a, h2 a');

    // Publish date.
    const date = article.querySelector('.elementor-post-date, .elementor-post__meta-data .elementor-post-date');

    // Read-more link.
    const readMore = article.querySelector('a.elementor-post__read-more, .elementor-post__read-more');

    // ---- Image cell: field:image ---------------------------------------------
    const imageCell = [];
    imageCell.push(document.createComment(' field:image '));
    if (img) imageCell.push(img);

    // ---- Body/text cell: field:text ------------------------------------------
    const textCell = [];
    textCell.push(document.createComment(' field:text '));

    if (titleLink) {
      // Preserve the linked headline as a heading for richtext semantics.
      const heading = document.createElement('h3');
      const headingLink = document.createElement('a');
      headingLink.setAttribute('href', titleLink.getAttribute('href') || '');
      headingLink.textContent = (titleLink.textContent || '').trim();
      heading.appendChild(headingLink);
      textCell.push(heading);
    }

    if (date) {
      const datePara = document.createElement('p');
      datePara.textContent = (date.textContent || '').trim();
      textCell.push(datePara);
    }

    if (readMore) {
      const readPara = document.createElement('p');
      const readLink = document.createElement('a');
      readLink.setAttribute('href', readMore.getAttribute('href') || '');
      readLink.textContent = (readMore.textContent || '').trim();
      readPara.appendChild(readLink);
      textCell.push(readPara);
    }

    // One row per card: [image cell, text cell]
    cells.push([imageCell, textCell]);
  });

  // Empty-block guard: nothing meaningful extracted.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });

  // Preserve the section heading ("News") as default content above the block
  // so it survives import (the block selector is the whole #news section, which
  // would otherwise consume the heading).
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
