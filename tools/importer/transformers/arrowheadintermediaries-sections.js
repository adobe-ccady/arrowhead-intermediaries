/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Arrowhead Intermediaries section breaks + section metadata.
 *
 * Driven by payload.template.sections (from page-templates.json). The homepage
 * template has 7 sections:
 *   1. hero                  (style: null)
 *   2. statistics            (style: "stats")
 *   3. read-our-story-intro  (style: null)
 *   4. our-story-tabs        (style: null)
 *   5. leadership-banner     (style: null)
 *   6. explore-our-divisions (style: "divisions-background-image")
 *   7. news                  (style: null)
 *
 * For each section (processed in reverse order so insertions don't shift later ones):
 *  - Insert an <hr> before the section element when it is NOT the first section and
 *    there is content before it (gives section breaks: expected 6 = sections.length - 1).
 *  - When the section has a `style`, append a Section Metadata block after the section
 *    element (expected 2: statistics + explore-our-divisions).
 *
 * Section selectors come from page-templates.json (verified against cleaned.html).
 *
 * Runs in beforeTransform: several sections share a selector with the block
 * instance that occupies them (e.g. #numbers is both the "statistics" section
 * and the columns-stats block). Block parsers replace those elements via
 * element.replaceWith(block) during parsing, so by afterTransform the section
 * selectors no longer match. Inserting the <hr> breaks and Section Metadata
 * blocks before parsing keeps them anchored as siblings; the parser then
 * replaces the block element in place between the inserted markers.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process in reverse so DOM insertions do not shift the positions of
  // sections we have not handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section || !section.selector) continue;

    const sectionEl = element.querySelector(section.selector);
    if (!sectionEl) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metaBlock);
    }

    // Section break before every non-first section that has content before it.
    if (i > 0 && sectionEl.previousElementSibling) {
      sectionEl.before(doc.createElement('hr'));
    }
  }
}
