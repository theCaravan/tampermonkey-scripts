// ==UserScript==
// @name         TikTok Auto Next for Photo Carousel
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically advance TikTok photo carousels after 10 seconds
// @author       theCaravan
// @match        https://www.tiktok.com/@*/photo/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to advance to the next image every 10 seconds
    function autoAdvanceCarousel() {
        setInterval(() => {
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
            if (nextButton) {
                console.log('Carousel auto-advance: next button pressed.');
                nextButton.click();
            } else {
                console.log('Next button not found for carousel.');
            }
        }, 10000); // 10-second interval
    }

    autoAdvanceCarousel();  // Start the auto-advance process
})();
