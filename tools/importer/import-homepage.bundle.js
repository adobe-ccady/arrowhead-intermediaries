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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-divisions.js
  function parse(element, { document }) {
    const heading = element.querySelector("h2.elementor-heading-title, .elementor-widget-heading h2, h1, h2");
    const description = element.querySelector(".elementor-widget-text-editor p, p");
    const buttonLinks = Array.from(
      element.querySelectorAll(".hero-btn a.elementor-button, a.elementor-button")
    ).filter((a) => !a.classList.contains("hero-mouse"));
    if (!heading && !description && buttonLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCellNodes = [];
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      textCellNodes.push(h1);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.replace(/\s+/g, " ").trim();
      textCellNodes.push(p);
    }
    buttonLinks.forEach((a) => {
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      const label = a.querySelector(".elementor-button-text");
      link.textContent = (label ? label.textContent : a.textContent).replace(/\s+/g, " ").trim();
      const p = document.createElement("p");
      p.appendChild(link);
      textCellNodes.push(p);
    });
    const imageCell = document.createElement("div");
    const textCell = document.createElement("div");
    textCell.appendChild(document.createComment(" field:text "));
    textCellNodes.forEach((node) => textCell.appendChild(node));
    const cells = [
      [imageCell],
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-divisions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse2(element, { document }) {
    let counters = Array.from(element.querySelectorAll(".elementor-counter"));
    if (!counters.length) {
      counters = Array.from(
        element.querySelectorAll('.elementor-widget-counter, [data-widget_type="counter.default"]')
      );
    }
    const buildValue = (counter) => {
      const wrapper = counter.querySelector(".elementor-counter-number-wrapper");
      if (wrapper) {
        const prefix = wrapper.querySelector(".elementor-counter-number-prefix");
        const number = wrapper.querySelector(".elementor-counter-number");
        const suffix = wrapper.querySelector(".elementor-counter-number-suffix");
        if (number) {
          const text = [
            prefix ? prefix.textContent.trim() : "",
            number.textContent.trim(),
            suffix ? suffix.textContent.trim() : ""
          ].join("");
          return text.trim();
        }
        return wrapper.textContent.replace(/\s+/g, " ").trim();
      }
      const title = counter.querySelector(".elementor-counter-title");
      const titleText = title ? title.textContent : "";
      return counter.textContent.replace(titleText, "").replace(/\s+/g, " ").trim();
    };
    const getLabel = (counter) => {
      const title = counter.querySelector(".elementor-counter-title");
      return title ? title.textContent.trim() : "";
    };
    const cells = [];
    const columnRow = [];
    counters.forEach((counter) => {
      const value = buildValue(counter);
      const label = getLabel(counter);
      if (!value && !label) return;
      const cellContent = [];
      if (value) {
        const numberEl = document.createElement("h2");
        numberEl.textContent = value;
        cellContent.push(numberEl);
      }
      if (label) {
        const labelEl = document.createElement("p");
        labelEl.textContent = label;
        cellContent.push(labelEl);
      }
      columnRow.push(cellContent);
    });
    if (!columnRow.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push(columnRow);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-story.js
  function parse3(element, { document }) {
    const tabTitles = Array.from(
      element.querySelectorAll(".e-n-tabs-heading .e-n-tab-title .e-n-tab-title-text, .e-n-tabs-heading .e-n-tab-title")
    );
    const labelEls = Array.from(
      element.querySelectorAll(".e-n-tabs-heading .e-n-tab-title")
    ).map((btn) => btn.querySelector(".e-n-tab-title-text") || btn);
    const panels = Array.from(
      element.querySelectorAll('.e-n-tabs-content [role="tabpanel"], .e-n-tabs-content > div')
    );
    if (labelEls.length === 0 && panels.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const count = Math.max(labelEls.length, panels.length);
    for (let i = 0; i < count; i += 1) {
      const labelEl = labelEls[i];
      const panel = panels[i];
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(" field:title "));
      if (labelEl) {
        const labelText = (labelEl.textContent || "").trim();
        const text = labelText || panel && (panel.getAttribute("aria-label") || "").trim() || "";
        titleCell.appendChild(document.createTextNode(text));
      }
      const contentCell = document.createDocumentFragment();
      const headingText = labelEl ? (labelEl.textContent || "").trim() : panel && (panel.getAttribute("aria-label") || "").trim() || "";
      if (headingText) {
        contentCell.appendChild(document.createComment(" field:content_heading "));
        contentCell.appendChild(document.createTextNode(headingText));
      }
      if (panel) {
        const img = panel.querySelector("figure img, img");
        if (img) {
          contentCell.appendChild(document.createComment(" field:content_image "));
          contentCell.appendChild(img);
        }
        const paras = Array.from(panel.querySelectorAll(":scope > p, p"));
        if (paras.length) {
          contentCell.appendChild(document.createComment(" field:content_richtext "));
          paras.forEach((p) => contentCell.appendChild(p));
        }
      }
      cells.push([titleCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse4(element, { document }) {
    const inner = element.querySelector(".e-con-inner") || element;
    let columnContainers = Array.from(inner.querySelectorAll(":scope > .e-con.e-child"));
    if (columnContainers.length < 2) {
      columnContainers = Array.from(inner.querySelectorAll(":scope > div"));
    }
    const image = element.querySelector(".elementor-widget-image img, img");
    const heading = element.querySelector(
      ".elementor-widget-heading h1, .elementor-widget-heading h2, .elementor-widget-heading h3, h2, h3"
    );
    const paragraph = element.querySelector(
      ".elementor-widget-text-editor p, p"
    );
    const cta = element.querySelector(
      '.elementor-widget-button a, a.elementor-button, a[href="/leadership/"]'
    );
    if (cta) {
      const label = cta.textContent.trim();
      if (label) cta.textContent = label;
    }
    if (!image && !heading && !paragraph && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const rightCell = [];
    if (heading) rightCell.push(heading);
    if (paragraph) rightCell.push(paragraph);
    if (cta) rightCell.push(cta);
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-divisions.js
  function parse5(element, { document }) {
    const cardContainers = element.querySelectorAll(
      ":scope > .e-con-inner > .e-child, :scope .e-con-inner > .e-con.e-child"
    );
    const cells = [];
    cardContainers.forEach((card) => {
      const imageLink = card.querySelector(".elementor-image-box-img a, figure a");
      const img = card.querySelector(".elementor-image-box-img img, figure img, img");
      const heading = card.querySelector('.elementor-widget-heading h4, h4, [class*="heading-title"]');
      const description = card.querySelector(".elementor-image-box-description, .elementor-image-box-content p, p");
      if (!img && !heading && !description) return;
      const imageCell = document.createComment(" field:image ");
      const imageContent = [];
      if (imageLink) {
        imageContent.push(imageLink);
      } else if (img) {
        imageContent.push(img);
      }
      const textComment = document.createComment(" field:text ");
      const textContent = [];
      if (heading) {
        const h = document.createElement("h4");
        h.textContent = heading.textContent.trim();
        textContent.push(h);
      }
      if (description) {
        textContent.push(description);
      }
      cells.push([
        [imageCell, ...imageContent],
        [textComment, ...textContent]
      ]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-divisions", cells });
    const sectionHeading = element.querySelector(
      ":scope > .e-con-inner > .elementor-widget-heading h3, :scope .elementor-widget-heading h3"
    );
    if (sectionHeading) {
      const h = document.createElement("h3");
      h.textContent = sectionHeading.textContent.trim();
      element.replaceWith(h, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const articles = Array.from(element.querySelectorAll("article.elementor-post"));
    const cells = [];
    articles.forEach((article) => {
      const img = article.querySelector(".elementor-post__thumbnail img, .elementor-post__thumbnail__link img, img");
      const titleLink = article.querySelector(".elementor-post__title a, h3 a, h2 a");
      const date = article.querySelector(".elementor-post-date, .elementor-post__meta-data .elementor-post-date");
      const readMore = article.querySelector("a.elementor-post__read-more, .elementor-post__read-more");
      const imageCell = [];
      imageCell.push(document.createComment(" field:image "));
      if (img) imageCell.push(img);
      const textCell = [];
      textCell.push(document.createComment(" field:text "));
      if (titleLink) {
        const heading = document.createElement("h3");
        const headingLink = document.createElement("a");
        headingLink.setAttribute("href", titleLink.getAttribute("href") || "");
        headingLink.textContent = (titleLink.textContent || "").trim();
        heading.appendChild(headingLink);
        textCell.push(heading);
      }
      if (date) {
        const datePara = document.createElement("p");
        datePara.textContent = (date.textContent || "").trim();
        textCell.push(datePara);
      }
      if (readMore) {
        const readPara = document.createElement("p");
        const readLink = document.createElement("a");
        readLink.setAttribute("href", readMore.getAttribute("href") || "");
        readLink.textContent = (readMore.textContent || "").trim();
        readPara.appendChild(readLink);
        textCell.push(readPara);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    const sectionHeading = element.querySelector(
      ":scope > .e-con-inner > .elementor-widget-heading h3, :scope .elementor-widget-heading h3"
    );
    if (sectionHeading) {
      const h = document.createElement("h3");
      h.textContent = sectionHeading.textContent.trim();
      element.replaceWith(h, block);
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-divisions": parse,
    "columns-stats": parse2,
    "tabs-story": parse3,
    "columns-banner": parse4,
    "cards-divisions": parse5,
    "cards-news": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Arrowhead Intermediaries homepage: header nav, hero with tagline and division quick-links, statistics, our-story tabs, leadership banner, division cards, news cards, footer",
    urls: [
      "https://arrowheadintermediaries.com/"
    ],
    blocks: [
      {
        name: "hero-divisions",
        instances: ["#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-a46922b.e-con-full.e-flex.e-con.e-parent.e-lazyloaded"]
      },
      {
        name: "columns-stats",
        instances: ["#numbers"]
      },
      {
        name: "tabs-story",
        instances: ["#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-2e9cfdd.e-flex.e-con-boxed.e-con.e-parent"]
      },
      {
        name: "columns-banner",
        instances: ["#our-leaders"]
      },
      {
        name: "cards-divisions",
        instances: ["#our-divisions"]
      },
      {
        name: "cards-news",
        instances: ["#news"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "hero",
        selector: "#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-a46922b.e-con-full.e-flex.e-con.e-parent.e-lazyloaded",
        style: null,
        blocks: ["hero-divisions"],
        defaultContent: []
      },
      {
        id: "statistics",
        name: "statistics",
        selector: "#numbers",
        style: "stats",
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "read-our-story-intro",
        name: "read-our-story-intro",
        selector: "#our-story",
        style: null,
        blocks: [],
        defaultContent: ["#our-story h3", "#our-story p"]
      },
      {
        id: "our-story-tabs",
        name: "our-story-tabs",
        selector: "#content > div.page-content > div.elementor.elementor-22 > div.elementor-element.elementor-element-2e9cfdd.e-flex.e-con-boxed.e-con.e-parent",
        style: null,
        blocks: ["tabs-story"],
        defaultContent: []
      },
      {
        id: "leadership-banner",
        name: "leadership-banner",
        selector: "#our-leaders",
        style: null,
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "explore-our-divisions",
        name: "explore-our-divisions",
        selector: "#our-divisions",
        style: "divisions-background-image",
        blocks: ["cards-divisions"],
        defaultContent: ["#our-divisions h3"]
      },
      {
        id: "news",
        name: "news",
        selector: "#news",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["#news h3"]
      }
    ]
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
  var import_homepage_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
