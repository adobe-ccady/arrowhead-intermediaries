/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroDivisionsParser from './parsers/hero-divisions.js';
import columnsStatsParser from './parsers/columns-stats.js';
import tabsStoryParser from './parsers/tabs-story.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsDivisionsParser from './parsers/cards-divisions.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/arrowheadintermediaries-cleanup.js';
import sectionsTransformer from './transformers/arrowheadintermediaries-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-divisions': heroDivisionsParser,
  'columns-stats': columnsStatsParser,
  'tabs-story': tabsStoryParser,
  'columns-banner': columnsBannerParser,
  'cards-divisions': cardsDivisionsParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Arrowhead Intermediaries homepage: header nav, hero with tagline and division quick-links, statistics, our-story tabs, leadership banner, division cards, news cards, footer',
  urls: [
    'https://arrowheadintermediaries.com/',
  ],
  blocks: [
    {
      name: 'hero-divisions',
      instances: ['#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-a46922b.e-con-full.e-flex.e-con.e-parent.e-lazyloaded'],
    },
    {
      name: 'columns-stats',
      instances: ['#numbers'],
    },
    {
      name: 'tabs-story',
      instances: ['#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-2e9cfdd.e-flex.e-con-boxed.e-con.e-parent'],
    },
    {
      name: 'columns-banner',
      instances: ['#our-leaders'],
    },
    {
      name: 'cards-divisions',
      instances: ['#our-divisions'],
    },
    {
      name: 'cards-news',
      instances: ['#news'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'hero',
      selector: '#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-a46922b.e-con-full.e-flex.e-con.e-parent.e-lazyloaded',
      style: null,
      blocks: ['hero-divisions'],
      defaultContent: [],
    },
    {
      id: 'statistics',
      name: 'statistics',
      selector: '#numbers',
      style: 'stats',
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'read-our-story-intro',
      name: 'read-our-story-intro',
      selector: '#our-story',
      style: null,
      blocks: [],
      defaultContent: ['#our-story h3', '#our-story p'],
    },
    {
      id: 'our-story-tabs',
      name: 'our-story-tabs',
      selector: '#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-2e9cfdd.e-flex.e-con-boxed.e-con.e-parent',
      style: null,
      blocks: ['tabs-story'],
      defaultContent: [],
    },
    {
      id: 'leadership-banner',
      name: 'leadership-banner',
      selector: '#our-leaders',
      style: null,
      blocks: ['columns-banner'],
      defaultContent: [],
    },
    {
      id: 'explore-our-divisions',
      name: 'explore-our-divisions',
      selector: '#our-divisions',
      style: 'divisions-background-image',
      blocks: ['cards-divisions'],
      defaultContent: ['#our-divisions h3'],
    },
    {
      id: 'news',
      name: 'news',
      selector: '#news',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['#news h3'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections last (adds breaks + metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform: initial cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform: final cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
