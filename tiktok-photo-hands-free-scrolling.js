// ==UserScript==
// @name         TikTok Photo Hands-Free
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically advance TikTok photo carousels every 10 seconds on SPA sites
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let countdown = 12;
    let intervalId;

    // Check if the page is a photo carousel
    function isPhotoCarouselPage() {
        return window.location.href.includes("/photo/");
    }

    // Function to advance to the next image in the carousel
    function advanceCarousel() {
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log('12 seconds passed. Advancing to the next image in the carousel.');
            nextButton.click();
        } else {
            console.log('Next button not found for carousel.');
        }
        resetCountdown(); // Reset the countdown for the next image
    }

    // Start the countdown for advancing the carousel
    function startCountdown() {
        intervalId = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                advanceCarousel();
            }
        }, 1000);
    }

    // Reset countdown back to 12 seconds
    function resetCountdown() {
        clearInterval(intervalId);
        countdown = 12;
        startCountdown();
    }

    // Detect URL changes in an SPA environment
    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (isPhotoCarouselPage()) {
                    console.log("Photo carousel detected. Starting 12-second countdown.");
                    resetCountdown();
                } else {
                    clearInterval(intervalId); // Stop countdown if not on a carousel page
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Initialize the observer to detect URL changes
    observeUrlChanges();
})();
