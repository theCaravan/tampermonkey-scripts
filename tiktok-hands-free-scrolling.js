// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    function setupVideoEndListener(video) {
        if (!video) return;
        video.removeEventListener('ended', handleVideoEnd);
        video.addEventListener('ended', handleVideoEnd);
    }

    function handleVideoEnd() {
        try {
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
            if (nextButton) {
                console.log('Next button pressed');
                nextButton.click();
            } else {
                console.log('Next button not found');
            }
        } catch (error) {
            console.error('Error during video end handling:', error);
        }
    }

    function detectCarouselLoop() {
        const paginationDots = document.querySelectorAll('.css-1n2xfd8-DivDot'); // Active dot selector
        if (paginationDots.length <= 1) return; // Skip if only one image in the carousel

        // Check if the first dot is currently active, indicating we're at the start of the carousel
        const isFirstDotActive = paginationDots[0].classList.contains('css-1wtwqpy-DivDot'); // Adjust if TikTok's active class name changes
        if (isFirstDotActive) {
            console.log('Carousel loop detected; scrolling to next video');
            scrollToNext();
        }
    }

    function scrollToNext() {
        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log('Advancing to next video');
            nextButton.click();
        } else {
            console.log('Next button not found');
        }
    }

    function observePage() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                setupVideoEndListener(video);
            }

            const carousel = document.querySelector('.css-1afuipw-DivPhotoControl'); // Image carousel container
            if (carousel) {
                console.log('Carousel detected, monitoring for loop to first image');
                detectCarouselLoop();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observePage();
})();
