/*
 * hero-article: news/article header.
 *   A wide horizontal cover image displayed INLINE at the top, followed by the
 *   text group (category label + headline + optional publish date). Unlike the
 *   vanilla hero, the image is not an absolutely-positioned background overlay
 *   — it sits in normal flow above the text.
 *
 * Authored DOM (from the parser): first cell holds the cover image, the last
 * cell holds the richtext (label, title, date). This decorator tags the two
 * groups so CSS can lay them out as image-over-text.
 */
export default function decorate(block) {
  const cells = [...block.children];

  // First row that contains a picture/img is the cover image.
  const imageRow = cells.find((row) => row.querySelector('picture, img'));
  if (imageRow) {
    imageRow.classList.add('hero-article-image');
  }

  // The remaining text row holds label + title (+ date).
  const textRow = cells.find((row) => row !== imageRow);
  if (textRow) {
    textRow.classList.add('hero-article-content');
  }

  // Place the header text (label + headline) ABOVE the cover image.
  if (textRow && imageRow) {
    block.insertBefore(textRow, imageRow);
  }
}
