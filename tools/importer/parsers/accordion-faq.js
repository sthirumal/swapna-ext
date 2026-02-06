/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: accordion
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Accordion-Faq")
 * - Row 2+: Two columns per row (question | answer)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="flex-vertical">
 *   <div class="accordion transparent-accordion w-dropdown">
 *     <div class="w-dropdown-toggle">
 *       <div class="paragraph-lg">Question text</div>
 *     </div>
 *     <nav class="accordion-content w-dropdown-list">
 *       <div class="rich-text w-richtext">
 *         <p>Answer text</p>
 *       </div>
 *     </nav>
 *   </div>
 *   ...more accordion items
 * </div>
 *
 * Generated: 2026-01-30
 */
export default function parse(element, { document }) {
  // Extract accordion items
  // VALIDATED: Found .accordion.w-dropdown pattern in captured DOM
  const accordionItems = element.querySelectorAll('.accordion.w-dropdown') ||
                         element.querySelectorAll('.w-dropdown');

  // Build cells array - one row per accordion item
  const cells = [];

  accordionItems.forEach(item => {
    // Get question text
    // VALIDATED: Found .w-dropdown-toggle .paragraph-lg pattern in captured DOM
    const questionElement = item.querySelector('.w-dropdown-toggle .paragraph-lg') ||
                            item.querySelector('.w-dropdown-toggle');
    const questionText = questionElement ? questionElement.textContent.trim() : '';

    // Get answer text
    // VALIDATED: Found .accordion-content .rich-text p pattern in captured DOM
    const answerElement = item.querySelector('.accordion-content .rich-text p') ||
                          item.querySelector('.accordion-content p') ||
                          item.querySelector('.w-dropdown-list p');
    const answerText = answerElement ? answerElement.textContent.trim() : '';

    if (questionText) {
      // Build question cell
      const questionCell = document.createElement('div');
      questionCell.textContent = questionText;

      // Build answer cell
      const answerCell = document.createElement('div');
      answerCell.textContent = answerText;

      // Add row: [question, answer]
      cells.push([questionCell, answerCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-Faq', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
