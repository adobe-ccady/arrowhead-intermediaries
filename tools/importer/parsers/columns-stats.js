/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-stats.
 * Base block: columns (core/franklin columns).
 * Source: https://arrowheadintermediaries.com/ (#numbers)
 * Generated: 2026-06-17
 *
 * Layout: three side-by-side statistics, each a large number + label.
 * Output: a single columns row with 3 cells (one per stat). Each cell holds
 * the stat number as a heading (large value) followed by its label paragraph.
 *
 * Columns block: per the xwalk hinting rules, columns blocks do NOT use
 * field hints — cells contain only default content.
 *
 * Counter values are emitted as PLAIN final text ("7,000+", "22", "170+");
 * the migrated output does NOT animate. The parser is robust to either:
 *   (a) original Elementor counter markup (prefix + number + suffix spans), or
 *   (b) already-flattened plain text (after the cleanup transformer runs).
 */
export default function parse(element, { document }) {
  // Each stat is an Elementor "counter" widget. Fall back to any element that
  // carries a counter title/number if the widget wrapper class changes.
  let counters = Array.from(element.querySelectorAll('.elementor-counter'));
  if (!counters.length) {
    counters = Array.from(
      element.querySelectorAll('.elementor-widget-counter, [data-widget_type="counter.default"]'),
    );
  }

  // Build the stat value text, tolerant of flattened text or counter spans.
  const buildValue = (counter) => {
    const wrapper = counter.querySelector('.elementor-counter-number-wrapper');
    if (wrapper) {
      const prefix = wrapper.querySelector('.elementor-counter-number-prefix');
      const number = wrapper.querySelector('.elementor-counter-number');
      const suffix = wrapper.querySelector('.elementor-counter-number-suffix');
      if (number) {
        const text = [
          prefix ? prefix.textContent.trim() : '',
          number.textContent.trim(),
          suffix ? suffix.textContent.trim() : '',
        ].join('');
        return text.trim();
      }
      // No inner number span: counter already flattened to plain text.
      return wrapper.textContent.replace(/\s+/g, ' ').trim();
    }
    // No wrapper at all: pull any leftover non-title text from the counter.
    const title = counter.querySelector('.elementor-counter-title');
    const titleText = title ? title.textContent : '';
    return counter.textContent.replace(titleText, '').replace(/\s+/g, ' ').trim();
  };

  const getLabel = (counter) => {
    const title = counter.querySelector('.elementor-counter-title');
    return title ? title.textContent.trim() : '';
  };

  const cells = [];
  const columnRow = [];

  counters.forEach((counter) => {
    const value = buildValue(counter);
    const label = getLabel(counter);
    if (!value && !label) return;

    const cellContent = [];
    if (value) {
      const numberEl = document.createElement('h2');
      numberEl.textContent = value;
      cellContent.push(numberEl);
    }
    if (label) {
      const labelEl = document.createElement('p');
      labelEl.textContent = label;
      cellContent.push(labelEl);
    }
    columnRow.push(cellContent);
  });

  // Empty-block guard: nothing extracted -> unwrap rather than emit empty block.
  if (!columnRow.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push(columnRow);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
