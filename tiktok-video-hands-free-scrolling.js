// ==UserScript==
// @name         TikTok Hands-Free + Auto Like
// @namespace    vm-tiktok-handsfree-like
// @version      2.0
// @description  Auto-like after delay and auto-advance when video ends
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
    console.log('[HandsFree] Video ended');

    const nav = document.querySelector('.css-1o2f1ti-DivFeedNavigationContainer');
    if (nav) {
      const buttons = nav.querySelectorAll('button');
      if (buttons[1]) {
        buttons[1].click();
        return;
      }
    }

    const fallback = document.querySelector('button[data-e2e="arrow-right"]');
    fallback?.click();
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
