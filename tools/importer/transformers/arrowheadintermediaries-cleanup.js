/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Arrowhead Intermediaries site-wide cleanup.
 *
 * All selectors are verified against migration-work/cleaned.html.
 *
 * beforeTransform (runs before block parsing):
 *  - Remove OneTrust cookie consent / banner (#onetrust-consent-sdk, #onetrust-banner-sdk)
 *    and the "Manage Cookies" trigger (#ot-sdk-btn). Verified in cleaned.html
 *    (lines 473, 483, 486).
 *  - Remove hero scroll/fade animation helper anchor (a.hero-mouse). Verified at line 109.
 *  - Remove news "Load More" controls that sit AFTER the three static article cards:
 *    .e-load-more-anchor (line 432), .elementor-button-wrapper (line 434, holds the
 *    "Load More" button), .e-load-more-message (line 445), .e-load-more-spinner.
 *    These are dynamic post-listing controls, not authored content.
 *  - Flatten the Elementor animated number counters into plain text so the columns-stats
 *    parser sees "7,000+", "22", "170+" as text rather than animated counter widgets.
 *    Counter markup verified at lines 146-174 (.elementor-counter-number-wrapper with
 *    prefix/number/suffix spans).
 *
 * afterTransform (final cleanup):
 *  - Remove auto-populated site chrome (header, footer) that EDS populates separately.
 *  - Remove non-authorable leftover elements (iframe, link, noscript, source).
 */

function flattenCounters(element) {
  // Each .elementor-counter-number-wrapper contains:
  //   <span class="elementor-counter-number-prefix">
  //   <span class="elementor-counter-number">7,000</span>
  //   <span class="elementor-counter-number-suffix">+</span>
  // Replace the wrapper with plain text (prefix + number + suffix) so the value
  // becomes static text, not an interactive/animated widget.
  const wrappers = element.querySelectorAll('.elementor-counter-number-wrapper');
  wrappers.forEach((wrapper) => {
    const prefix = wrapper.querySelector('.elementor-counter-number-prefix');
    const number = wrapper.querySelector('.elementor-counter-number');
    const suffix = wrapper.querySelector('.elementor-counter-number-suffix');
    const text = [prefix, number, suffix]
      .map((el) => (el ? el.textContent.trim() : ''))
      .join('');
    wrapper.replaceWith(wrapper.ownerDocument.createTextNode(text));
  });
}

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent / banner + "Manage Cookies" trigger (verified in cleaned.html).
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#ot-sdk-btn',
    ]);

    // Hero scroll animation helper anchor (a.hero-mouse).
    WebImporter.DOMUtils.remove(element, ['.hero-mouse']);

    // Accessibility "Skip to content" link (a[href="#content"]) - not authored content.
    WebImporter.DOMUtils.remove(element, ['a.skip-link', 'a[href="#content"]']);

    // News "Load More" dynamic controls (sit after the three static article cards).
    WebImporter.DOMUtils.remove(element, [
      '.e-load-more-anchor',
      '.elementor-button-wrapper',
      '.e-load-more-message',
      '.e-load-more-spinner',
    ]);

    // Flatten animated number counters into plain text.
    flattenCounters(element);
  }

  if (hookName === TransformHook.afterTransform) {
    // EDS auto-populates header/footer; they are out of scope for page content.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'iframe',
      'link',
      'noscript',
      'source',
    ]);
  }
}
