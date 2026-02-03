/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-articles block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Articles")
 * - Row 2+: Two columns per row (image | content with tag, title, description, link)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="w-layout-grid grid-layout tablet-1-column grid-gap-md">
 *   <a class="utility-link-content-block">
 *     <div class="w-layout-grid grid-layout">
 *       <img src="..." alt="..." class="cover-image">
 *       <div>
 *         <div class="flex-horizontal"><div class="tag">...</div><div>X min read</div></div>
 *         <h3>Title</h3>
 *         <p>Description</p>
 *         <div>Read</div>
 *       </div>
 *     </div>
 *   </a>
 * </div>
 *
 * Generated: 2026-01-30
 */
export default function parse(element, { document }) {
  // Extract article cards from grid layout
  // VALIDATED: Found a.utility-link-content-block pattern in captured DOM
  const articleCards = element.querySelectorAll('a.utility-link-content-block');

  // Build cells array - one row per article card with 2 columns
  const cells = [];

  articleCards.forEach(card => {
    // Get image - VALIDATED: Found img.cover-image in captured DOM
    const img = card.querySelector('img.cover-image') ||
                card.querySelector('img');

    // Get tag - VALIDATED: Found .tag in captured DOM
    const tag = card.querySelector('.tag');
    const tagText = tag ? tag.textContent.trim() : '';

    // Get read time - VALIDATED: Found .paragraph-sm in captured DOM
    const readTime = card.querySelector('.paragraph-sm.utility-margin-bottom-0');
    const readTimeText = readTime ? readTime.textContent.trim() : '';

    // Get title - VALIDATED: Found h3.h4-heading in captured DOM
    const title = card.querySelector('h3.h4-heading') ||
                  card.querySelector('h3');

    // Get description - VALIDATED: Found p in captured DOM
    const description = card.querySelector('p:not(.paragraph-sm)');

    // Get link href
    const href = card.getAttribute('href') || '';

    // Build content column
    const contentCell = document.createElement('div');

    // Add tag and read time
    if (tagText || readTimeText) {
      const metaLine = document.createElement('p');
      if (tagText) {
        const strong = document.createElement('strong');
        strong.textContent = tagText;
        metaLine.appendChild(strong);
      }
      if (readTimeText) {
        metaLine.appendChild(document.createTextNode(' ' + readTimeText));
      }
      contentCell.appendChild(metaLine);
    }

    // Add title
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.appendChild(h3);
    }

    // Add description
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }

    // Add read link
    if (href) {
      const linkP = document.createElement('p');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read';
      linkP.appendChild(link);
      contentCell.appendChild(linkP);
    }

    // Add row: [image, content]
    if (img) {
      const imgClone = img.cloneNode(true);
      cells.push([imgClone, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Articles', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
