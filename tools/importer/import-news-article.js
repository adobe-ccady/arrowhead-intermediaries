/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/arrowheadintermediaries-cleanup.js';
import sectionsTransformer from './transformers/arrowheadintermediaries-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'news-article',
  description: 'Arrowhead Intermediaries news article: hero-article header (cover image + category label + headline) followed by default-content article body (deck, portrait, paragraphs, media contacts)',
  urls: [
    'https://arrowheadintermediaries.com/news/arrowhead-intermediaries-appoints-benjamin-auray-as-chief-commercial-officer/',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.elementor-element-65d19ab .e-con-inner'],
    },
  ],
  sections: [
    {
      id: 'article-header',
      name: 'article-header',
      selector: '.elementor-element-65d19ab .e-con-inner',
      style: null,
      blocks: ['hero-article'],
      defaultContent: [],
    },
    {
      id: 'article-body',
      name: 'article-body',
      selector: '.elementor-element-202beff.elementor-widget-theme-post-content',
      style: 'article-body',
      blocks: [],
      defaultContent: ['.elementor-element-202beff.elementor-widget-theme-post-content'],
    },
  ],
};

// PAGE METADATA OVERRIDES - the new page is titled "News Page" per request.
const METADATA_OVERRIDES = {
  Title: 'News Page',
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

/**
 * Apply page metadata overrides to the metadata block created by
 * WebImporter.rules.createMetadata. Updates the value cell of a row whose
 * label matches an override key, or appends a new row when absent.
 */
function applyMetadataOverrides(main, document) {
  const tables = main.querySelectorAll('table');
  let metaTable = null;
  tables.forEach((t) => {
    const first = t.querySelector('tr th, tr td');
    if (first && /metadata/i.test(first.textContent || '')) metaTable = t;
  });
  if (!metaTable) return;

  Object.entries(METADATA_OVERRIDES).forEach(([key, value]) => {
    let updated = false;
    metaTable.querySelectorAll('tr').forEach((row) => {
      const cells = row.children;
      if (cells.length >= 2 && (cells[0].textContent || '').trim().toLowerCase() === key.toLowerCase()) {
        cells[1].textContent = value;
        updated = true;
      }
    });
    if (!updated) {
      const row = document.createElement('tr');
      const k = document.createElement('td');
      k.textContent = key;
      const v = document.createElement('td');
      v.textContent = value;
      row.append(k, v);
      metaTable.append(row);
    }
  });
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

    // 5b. Override the page title to "News Page" (per request)
    applyMetadataOverrides(main, document);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: 'News Page',
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
