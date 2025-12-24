// ==UserScript==
// @name         TikTok Video Hands Free (Reversed) + Auto Like
// @namespace    vm-tiktok-handsfree-reversed-like
// @version      2.0
// @description  Auto-like after delay and move to previous video when current one ends
// @author       theCaravan + ChatGPT
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const LIKE_DELAY_MS = 10_000;
  let lastVideo = null;
  let likeTimer = null;

  function isVideoPage() {
    return location.href.includes('/video/');
  }

  function findLikeButton() {
    return [...document.querySelectorAll('button[aria-pressed="false"]')]
      .find(btn => btn.querySelector('[data-e2e="browse-like-icon"]'));
  }

  function scheduleLike() {
    clearTimeout(likeTimer);

    likeTimer = setTimeout(() => {
      const btn = findLikeButton();
      if (btn) {
        btn.click();
        console.log('[AutoLike] ❤️ Liked');
      }
    }, LIKE_DELAY_MS);
  }

  function handleVideoEnd() {
    console.log('[HandsFree-Reversed] Video ended');

    // New navigation (up arrow)
    const nav = document.querySelector('.css-1o2f1ti-DivFeedNavigationContainer');
    if (nav) {
      const upButton = nav.querySelector('button:first-child');
      if (upButton) {
        upButton.click();
        return;
      }
    }

    // Fallback
    const prevButton = document.querySelector('button[data-e2e="arrow-left"]');
    prevButton?.click();
  }

  function setupVideo(video) {
    if (!video || video === lastVideo) return;

    lastVideo = video;
    console.log('[Setup] New video detected');

    clearTimeout(likeTimer);

    video.removeEventListener('ended', handleVideoEnd);
    video.addEventListener('ended', handleVideoEnd);

    scheduleLike();
  }

  const observer = new MutationObserver(() => {
    if (!isVideoPage()) return;
    const video = document.querySelector('video');
    if (video) setupVideo(video);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
