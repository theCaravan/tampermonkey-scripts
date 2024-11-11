// ==UserScript==
// @name         TikTok Auto Next on Video End (SPA-compatible)
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Automatically move to the next video on TikTok when the current video ends, compatible with SPA sites
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the URL contains "/video/"
    function isVideoPage() {
        return window.location.href.includes("/video/");
    }

    // Function to set up an event listener for the current video’s end
    function setupVideoEndListener() {
        const video = document.querySelector('video');
        if (!video) return; // Exit if no video found

        video.removeEventListener('ended', handleVideoEnd); // Avoid duplicate listeners
        video.addEventListener('ended', handleVideoEnd); // Add listener for video end
        console.log("Video end listener set up.");
    }

    // Function to handle video end
    function handleVideoEnd() {
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log('Video ended: advancing to next video.');
            nextButton.click();
        } else {
            console.log('Next button not found for video.');
        }
    }

    // Detect URL changes in an SPA environment
    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (isVideoPage()) {
                    console.log("Video page detected, setting up video end listener.");
                    setupVideoEndListener();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Initialize the observer to detect URL changes
    observeUrlChanges();
})();
