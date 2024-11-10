// ==UserScript==
// @name         TikTok Auto Next for Photo Carousel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically advance TikTok photo carousels after a delay
// @author       theCaravan
// @match        https://www.tiktok.com/@*/photo/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a carousel is present
    function isCarousel() {
        const carouselDots = document.querySelectorAll('.css-6kj9o0-DivDotWrapper');
        return carouselDots && carouselDots.length > 1;
    }

    // Function to automatically advance the carousel after 10 seconds
    function autoAdvanceCarousel() {
        setTimeout(() => {
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
            if (nextButton) {
                console.log('Carousel auto-advance, next button pressed.');
                nextButton.click();
            } else {
                console.log('Next button not found for carousel.');
            }
        }, 10000); // Delay of 10 seconds before advancing carousel
    }

    // Observe the page for new carousel content
    function observeNewCarousel() {
        const observer = new MutationObserver(() => {
            if (isCarousel()) {
                console.log('Carousel detected, setting up carousel auto-advance.');
                autoAdvanceCarousel();
            }
        });

        // Start observing for changes in the document body
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewCarousel();
})();
