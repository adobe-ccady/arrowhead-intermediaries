import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  let fragment = await loadFragment(footerPath);
  // fallback to local content path for `aem up` preview when metadata is absent
  if (!fragment) {
    fragment = await loadFragment('/content/footer');
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // first section = brand/legal info; second = legal links row
  const sections = footer.children;
  if (sections[0]) sections[0].classList.add('footer-info');
  if (sections[1]) sections[1].classList.add('footer-legal');

  block.append(footer);
}
