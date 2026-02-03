/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-showcase block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: tabs
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Tabs-Showcase")
 * - Row 2+: Two columns per row (tab label | tab content with heading + image)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="w-tabs">
 *   <div class="w-tab-menu">
 *     <a class="w-tab-link">Tab Label</a>
 *     ...
 *   </div>
 *   <div class="w-tab-content">
 *     <div class="w-tab-pane">
 *       <h3>Heading</h3>
 *       <img src="..." alt="...">
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-01-30
 */
export default function parse(element, { document }) {
  // Extract tab menu items
  // VALIDATED: Found .w-tab-menu .w-tab-link pattern in captured DOM
  const tabLinks = element.querySelectorAll('.w-tab-menu .w-tab-link, .w-tab-menu a');

  // Extract tab panes
  // VALIDATED: Found .w-tab-content .w-tab-pane pattern in captured DOM
  const tabPanes = element.querySelectorAll('.w-tab-content .w-tab-pane');

  // Build cells array - one row per tab
  const cells = [];

  // Match tabs with their content by index
  const tabCount = Math.min(tabLinks.length, tabPanes.length);

  for (let i = 0; i < tabCount; i++) {
    const tabLink = tabLinks[i];
    const tabPane = tabPanes[i];

    // Get tab label
    // VALIDATED: Found .paragraph-lg in tab link in captured DOM
    const labelElement = tabLink.querySelector('.paragraph-lg') || tabLink;
    const labelText = labelElement.textContent.trim();

    // Build label cell
    const labelCell = document.createElement('div');
    labelCell.textContent = labelText;

    // Build content cell
    const contentCell = document.createElement('div');

    // Get heading from tab pane - VALIDATED: Found h3.h2-heading in captured DOM
    const heading = tabPane.querySelector('h3.h2-heading') ||
                    tabPane.querySelector('h3') ||
                    tabPane.querySelector('h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      contentCell.appendChild(h2);
    }

    // Get image from tab pane - VALIDATED: Found img.cover-image in captured DOM
    const img = tabPane.querySelector('img.cover-image') ||
                tabPane.querySelector('img');
    if (img) {
      const p = document.createElement('p');
      const imgClone = img.cloneNode(true);
      p.appendChild(imgClone);
      contentCell.appendChild(p);
    }

    // Add row: [label, content]
    cells.push([labelCell, contentCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Showcase', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
