/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: https://wknd-trendsetters.site (all pages)
 * Generated: 2026-01-30
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Elements found: .nav.secondary-nav, footer.footer.inverse-footer
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation - EXTRACTED: Found <div class="nav secondary-nav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.w-nav-overlay'
    ]);

    // Remove footer - EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.inverse-footer'
    ]);

    // Remove mobile menu elements - EXTRACTED: Found in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav-mobile-menu-button',
      '.w-nav-button'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up remaining unwanted elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);

    // Remove inline base64 SVG icons from navigation remnants
    const inlineSvgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    inlineSvgImages.forEach(img => {
      // Only remove if it's an icon (small decorative element)
      if (img.closest('.icon, .icon-small, .icon-medium, .button-icon, .nav-caret')) {
        img.remove();
      }
    });
  }
}
