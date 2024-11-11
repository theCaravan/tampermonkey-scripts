// ==UserScript==
// @name         TikTok Photo Hands-Free
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically advance TikTok photo carousels every 10 seconds on SPA sites
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the URL contains "/photo/"
    function isPhotoCarouselPage() {
        return window.location.href.includes("/photo/");
    }

    // Function to start auto-advancing carousels
    function autoAdvanceCarousel() {
        setInterval(() => {
            if (isPhotoCarouselPage()) {  // Only run if on a photo carousel page
                const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
                if (nextButton) {
                    console.log('Carousel auto-advance: next button pressed.');
                    nextButton.click();
                } else {
                    console.log('Next button not found for carousel.');
                }
            }
        }, 10000); // 10-second interval
    }

    // Detect URL changes in an SPA environment
    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (isPhotoCarouselPage()) {
                    console.log("Photo carousel detected, starting auto-advance.");
                    autoAdvanceCarousel(); // Restart auto-advance on URL change
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Initialize the observer to detect URL changes
    observeUrlChanges();
})();
