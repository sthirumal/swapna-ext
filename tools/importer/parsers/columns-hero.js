/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-hero block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Columns-Hero")
 * - Row 2+: Image columns side-by-side
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="w-layout-grid grid-layout mobile-portrait-1-column grid-gap-md">
 *   <div class="utility-aspect-1x1">
 *     <img src="..." alt="...">
 *   </div>
 *   <div class="utility-aspect-1x1">
 *     <img src="..." alt="...">
 *   </div>
 * </div>
 *
 * Generated: 2026-01-30
 */
export default function parse(element, { document }) {
  // Extract image containers from grid layout
  // VALIDATED: Found .utility-aspect-1x1 > img pattern in captured DOM
  const imageContainers = element.querySelectorAll('.utility-aspect-1x1');

  // Build cells array - each image goes in a column
  const cells = [];

  if (imageContainers.length > 0) {
    // Single row with all images as columns
    const imageRow = [];
    imageContainers.forEach(container => {
      const img = container.querySelector('img');
      if (img) {
        imageRow.push(img.cloneNode(true));
      }
    });
    if (imageRow.length > 0) {
      cells.push(imageRow);
    }
  } else {
    // Fallback: try direct img children
    const directImages = element.querySelectorAll(':scope > div > img, :scope img.cover-image');
    if (directImages.length > 0) {
      const imageRow = Array.from(directImages).map(img => img.cloneNode(true));
      cells.push(imageRow);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
