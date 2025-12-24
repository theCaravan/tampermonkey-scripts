// ==UserScript==
// @name         Instagram Reel Auto-Advance, Auto-Unmute & Auto-Like
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Auto-advance reels, unmute video, and auto-like after delay
// @match        *://www.instagram.com/*
// @grant        none
// @author       theCaravan + ChatGPT
// ==/UserScript==

(function () {
    'use strict';

    const LIKE_DELAY_MS = 10_000;
    let lastVideo = null;
    let likeTimer = null;

    function isReelPage() {
        return !!document.querySelector('video[playsinline]');
    }

    function findVideoElement() {
        return document.querySelector('video[playsinline]');
    }

    function findNextButton() {
        return document.querySelector('div._aaqg._aaqh button._abl-');
    }

    function findLikeButton() {
        // Unliked heart = aria-label="Like"
        return [...document.querySelectorAll('[role="button"] svg[aria-label="Like"]')]
            .map(svg => svg.closest('[role="button"]'))
            .find(Boolean);
    }

    function scheduleLike() {
        clearTimeout(likeTimer);

        likeTimer = setTimeout(() => {
            const btn = findLikeButton();
            if (btn) {
                btn.click();
            }
        }, LIKE_DELAY_MS);
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

        video.muted = false;
        video.volume = 1;
        video.controls = true;

        const blockingDivs = document.querySelectorAll(
            'div[data-instancekey^="id-vpuid-"]'
        );
        blockingDivs.forEach(div => {
            while (div.firstChild) {
                div.firstChild.remove();
            }
        });
    }

    const observer = new MutationObserver(() => {
        if (!isReelPage()) return;

        const video = findVideoElement();
        if (video && video !== lastVideo) {
            lastVideo = video;

            clearTimeout(likeTimer);
            setupVideoListeners(video);
            unmuteVideo(video);
            scheduleLike();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Keep video unmuted (Instagram likes to fight you)
    setInterval(() => {
        if (isReelPage()) {
            const video = findVideoElement();
            if (video) {
                unmuteVideo(video);
            }
        }
    }, 500);
})();
