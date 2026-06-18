import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav);
      nav.querySelector('button').focus();
    }
  }
}

/**
 * Toggles the entire nav (mobile)
 * @param {Element} nav The nav element
 * @param {*} forceExpanded Optional param to force expand/collapse
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  let fragment = await loadFragment(navPath);
  // fallback to local content path for `aem up` preview when metadata is absent
  if (!fragment) {
    fragment = await loadFragment('/content/nav');
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: strip the generic button styling off the logo link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const bc = brandLink.closest('.button-container');
      if (bc) bc.className = '';
    }
  }

  // sections: hoist the menu <ul> to be a direct child of <nav> so the
  // structure is nav > ul.nav-list > li > a (matches the source markup).
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const list = navSections.querySelector('ul');
    if (list) {
      list.classList.add('nav-list');
      navSections.replaceWith(list);
      // neutralize any button-container wrappers on plain links
      list.querySelectorAll('.button-container').forEach((bc) => {
        bc.classList.remove('button-container');
        const a = bc.querySelector('.button');
        if (a) a.classList.remove('button');
      });
    }
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // reset expanded state on breakpoint change
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
