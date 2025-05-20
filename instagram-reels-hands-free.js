// ==UserScript==
// @name         Instagram Reel Auto-Advance & Auto-Unmute
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Auto-advance reels, unmute video and remove blocking divs without logging
// @match        *://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function isReelPage() {
        return !!document.querySelector('video[playsinline]');
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

    function unmuteVideo(video) {
        if (!video) return;

        // Force unmute continuously
        video.muted = false;
        video.volume = 1;
        video.controls = true;

        // Try to play in case paused
        video.play().catch(() => {});

        // Remove blocking divs
        const blockingDivs = document.querySelectorAll('div[data-instancekey^="id-vpuid-"]');
        blockingDivs.forEach(div => {
            while (div.firstChild) {
                div.firstChild.remove();
            }
        });
    }

    let lastVideo = null;

    const observer = new MutationObserver(() => {
        if (isReelPage()) {
            const video = findVideoElement();
            if (video && video !== lastVideo) {
                lastVideo = video;
                setupVideoListeners(video);
                unmuteVideo(video);
            } else if (video) {
                // If same video, keep forcing unmute in case Instagram resets it
                unmuteVideo(video);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
