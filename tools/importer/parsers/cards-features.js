/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-features block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Features")
 * - Row 2+: One card per row, single column with text content
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="w-layout-grid grid-layout desktop-4-column tablet-3-column">
 *   <div class="flex-horizontal flex-gap-xxs">
 *     <div><div class="icon">...</div></div>
 *     <p>Feature text content</p>
 *   </div>
 *   ...more items
 * </div>
 *
 * Generated: 2026-01-30
 */
export default function parse(element, { document }) {
  // Extract feature items from grid layout
  // VALIDATED: Found .flex-horizontal.flex-gap-xxs pattern in captured DOM
  const featureItems = element.querySelectorAll('.flex-horizontal.flex-gap-xxs');

  // Build cells array - one row per feature
  const cells = [];

  featureItems.forEach(item => {
    // Get the text content (paragraph)
    // VALIDATED: Found p.utility-margin-bottom-0 in captured DOM
    const textElement = item.querySelector('p') ||
                        item.querySelector('.utility-margin-bottom-0');

    if (textElement) {
      // Create cell with just the text content (no icons for features)
      const textContent = document.createElement('div');
      textContent.textContent = textElement.textContent.trim();
      cells.push([textContent]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Features', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
