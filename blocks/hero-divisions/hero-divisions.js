/*
 * hero-divisions: two-column split hero.
 *   Left  — white panel with the headline + intro copy.
 *   Right — aerial photo with the three division links as stacked white
 *           cards, centered vertically over the image.
 *
 * Authored DOM (from the parser) is a single text cell holding the heading,
 * the intro paragraph, and three link paragraphs. This decorator splits that
 * cell into a left content group and a right card group.
 */
export default function decorate(block) {
  // The text cell is the last child row (first row is the empty image cell).
  const cells = [...block.children];
  const textCell = cells[cells.length - 1];
  const inner = textCell.querySelector(':scope > div') || textCell;

  const left = document.createElement('div');
  left.className = 'hero-divisions-content';

  const right = document.createElement('div');
  right.className = 'hero-divisions-cards';

  // A division card is a "link-only" element: its entire text content is a
  // single anchor (e.g. <p><a>Programs</a></p> or a bare <a>). Everything else
  // (heading, intro copy) is left content. Scanning by this rule — rather than
  // assuming a fixed child order — tolerates the DOM differences between the
  // local preview and AEM's richtext rendering.
  const cardify = (link) => {
    link.classList.add('hero-divisions-card');
    right.append(link);
  };

  [...inner.children].forEach((el) => {
    const anchors = el.tagName === 'A' ? [el] : [...el.querySelectorAll(':scope > a')];
    const textIsLinksOnly = anchors.length > 0
      && el.textContent.trim() === anchors.map((a) => a.textContent.trim()).join('');
    if (textIsLinksOnly) {
      // One or more anchors with no other text — treat each as a division card.
      anchors.forEach(cardify);
    } else {
      left.append(el);
    }
  });

  block.textContent = '';
  block.append(left, right);
}
