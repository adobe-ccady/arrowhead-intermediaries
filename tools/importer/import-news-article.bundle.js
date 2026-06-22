/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-news-article.js
  var import_news_article_exports = {};
  __export(import_news_article_exports, {
    default: () => import_news_article_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document }) {
    const heading = element.querySelector(
      ".elementor-widget-theme-post-title h2, .elementor-widget-theme-post-title h1, h2, h1"
    );
    const img = element.querySelector(
      ".elementor-widget-theme-post-featured-image img, img"
    );
    const categoryLabel = "Leadership Appointment";
    if (!heading && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = document.createElement("div");
    imageCell.appendChild(document.createComment(" field:image "));
    if (img) {
      const cleanImg = document.createElement("img");
      cleanImg.setAttribute("src", img.getAttribute("src"));
      cleanImg.setAttribute("alt", img.getAttribute("alt") || "");
      imageCell.appendChild(cleanImg);
    }
    const textCell = document.createElement("div");
    textCell.appendChild(document.createComment(" field:text "));
    if (categoryLabel) {
      const label = document.createElement("p");
      label.textContent = categoryLabel;
      textCell.appendChild(label);
    }
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      textCell.appendChild(h1);
    }
    const cells = [
      [imageCell],
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-article", cells });
    const body = element.querySelector(".elementor-widget-theme-post-content");
    if (body) {
      const bodyMeta = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: { style: "article-body" }
      });
      element.replaceWith(block, document.createElement("hr"), body, bodyMeta);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/arrowheadintermediaries-cleanup.js
  function flattenCounters(element) {
    const wrappers = element.querySelectorAll(".elementor-counter-number-wrapper");
    wrappers.forEach((wrapper) => {
      const prefix = wrapper.querySelector(".elementor-counter-number-prefix");
      const number = wrapper.querySelector(".elementor-counter-number");
      const suffix = wrapper.querySelector(".elementor-counter-number-suffix");
      const text = [prefix, number, suffix].map((el) => el ? el.textContent.trim() : "").join("");
      wrapper.replaceWith(wrapper.ownerDocument.createTextNode(text));
    });
  }
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#ot-sdk-btn"
      ]);
      WebImporter.DOMUtils.remove(element, [".hero-mouse"]);
      WebImporter.DOMUtils.remove(element, ["a.skip-link", 'a[href="#content"]']);
      WebImporter.DOMUtils.remove(element, [
        ".e-load-more-anchor",
        ".elementor-button-wrapper",
        ".e-load-more-message",
        ".e-load-more-spinner"
      ]);
      flattenCounters(element);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/arrowheadintermediaries-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metaBlock);
      }
      if (i > 0 && sectionEl.previousElementSibling) {
        sectionEl.before(doc.createElement("hr"));
      }
    }
  }

  // tools/importer/import-news-article.js
  var parsers = {
    "hero-article": parse
  };
  var PAGE_TEMPLATE = {
    name: "news-article",
    description: "Arrowhead Intermediaries news article: hero-article header (cover image + category label + headline) followed by default-content article body (deck, portrait, paragraphs, media contacts)",
    urls: [
      "https://arrowheadintermediaries.com/news/arrowhead-intermediaries-appoints-benjamin-auray-as-chief-commercial-officer/"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: [".elementor-element-65d19ab .e-con-inner"]
      }
    ],
    sections: [
      {
        id: "article-header",
        name: "article-header",
        selector: ".elementor-element-65d19ab .e-con-inner",
        style: null,
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "article-body",
        name: "article-body",
        selector: ".elementor-element-202beff.elementor-widget-theme-post-content",
        style: "article-body",
        blocks: [],
        defaultContent: [".elementor-element-202beff.elementor-widget-theme-post-content"]
      }
    ]
  };
  var METADATA_OVERRIDES = {
    Title: "News Page"
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function applyMetadataOverrides(main, document) {
    const tables = main.querySelectorAll("table");
    let metaTable = null;
    tables.forEach((t) => {
      const first = t.querySelector("tr th, tr td");
      if (first && /metadata/i.test(first.textContent || "")) metaTable = t;
    });
    if (!metaTable) return;
    Object.entries(METADATA_OVERRIDES).forEach(([key, value]) => {
      let updated = false;
      metaTable.querySelectorAll("tr").forEach((row) => {
        const cells = row.children;
        if (cells.length >= 2 && (cells[0].textContent || "").trim().toLowerCase() === key.toLowerCase()) {
          cells[1].textContent = value;
          updated = true;
        }
      });
      if (!updated) {
        const row = document.createElement("tr");
        const k = document.createElement("td");
        k.textContent = key;
        const v = document.createElement("td");
        v.textContent = value;
        row.append(k, v);
        metaTable.append(row);
      }
    });
  }
  var import_news_article_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      applyMetadataOverrides(main, document);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: "News Page",
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_news_article_exports);
})();
