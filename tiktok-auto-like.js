// ==UserScript==
// @name         Auto Like After Delay
// @namespace    vm-auto-like
// @version      1.0
// @description Wait 10s, then press the heart button if not already liked
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(() => {
  const DELAY_MS = 10_000;
  const MAX_RETRIES = 20;
  const RETRY_INTERVAL = 500;

  function findLikeButton() {
    // Primary: aria-pressed=false + heart icon
    const buttons = document.querySelectorAll(
      'button[aria-pressed="false"]'
    );

    for (const btn of buttons) {
      if (btn.querySelector('[data-e2e="browse-like-icon"]')) {
        return btn;
      }
    }

    // Fallback: aria-label contains "Like"
    return document.querySelector(
      'button[aria-pressed="false"][aria-label*="Like"]'
    );
  }

  function tryClick(retries = 0) {
    const btn = findLikeButton();

    if (btn) {
      btn.click();
      console.log('[AutoLike] Heart clicked 💖');
      return;
    }

    if (retries < MAX_RETRIES) {
      setTimeout(() => tryClick(retries + 1), RETRY_INTERVAL);
    } else {
      console.log('[AutoLike] Heart not found, giving up');
    }
  }

  setTimeout(() => tryClick(), DELAY_MS);
})();
