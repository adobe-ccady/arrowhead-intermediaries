import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment(footerPath);
  // fallback to the local `aem up` preview path where content lives under /content
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
