import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // News cover images are externally hosted (arrowheadintermediaries.com WP
    // uploads). createOptimizedPicture appends AEM rendition params that break
    // external URLs, so only optimize same-origin images.
    let sameOrigin = false;
    try {
      sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
    } catch (e) {
      sameOrigin = false;
    }
    if (!sameOrigin) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // "Load More" control below the cards (matches source layout). The migrated
  // page shows the three static cards; this is a presentational affordance.
  const loadMoreWrapper = document.createElement('div');
  loadMoreWrapper.className = 'cards-news-load-more';
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'cards-news-load-more-button';
  loadMore.textContent = 'Load More';
  loadMoreWrapper.append(loadMore);
  block.append(loadMoreWrapper);
}
