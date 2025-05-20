// ==UserScript==
// @name         Instagram Reels Hands Free
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automatically advances to the next Instagram reel
// @match        *://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function isReelPage() {
        return window.location.href.includes("/reel/");
    }

    function findVideoElement() {
        return document.querySelector('video[playsinline]');
    }

    function findNextButton() {
        return document.querySelector('div._aaqg._aaqh button._abl-');
    }

    function handleVideoEnd() {
        const nextButton = findNextButton();
        if (nextButton) {
            nextButton.click();
        }
    }

    function setupVideoListeners(video) {
        if (!video) return;
        video.removeEventListener('ended', handleVideoEnd);
        video.addEventListener('ended', handleVideoEnd);
    }

    function observeReels() {
        const observer = new MutationObserver(() => {
            if (isReelPage()) {
                const video = findVideoElement();
                if (video) {
                    setupVideoListeners(video);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeReels();
})();
