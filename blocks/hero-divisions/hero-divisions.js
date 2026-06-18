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

  [...inner.children].forEach((el) => {
    const link = el.querySelector(':scope > a');
    const isLinkOnly = el.tagName === 'P' && link && el.textContent.trim() === link.textContent.trim();
    if (isLinkOnly) {
      link.classList.add('hero-divisions-card');
      right.append(link);
    } else {
      left.append(el);
    }
  });

  block.textContent = '';
  block.append(left, right);
}
