// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    function setupVideoEndListener(video) {
        if (!video) return;
        // Remove any existing event listeners to avoid duplicates
        video.removeEventListener('ended', handleVideoEnd);
        // Add an event listener to detect when the video ends, with a delay to ensure the video length has loaded
        setTimeout(() => {
            video.addEventListener('ended', handleVideoEnd);
        }, 3000); // 3 second delay
    }

    function handleVideoEnd() {
        try {
            const video = document.querySelector('video');
            const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
            if (video) {
                console.log('Video ended: ', video.currentTime, 'of', video.duration, 'seconds');
            }
            if (nextButton) {
                console.log('Next button pressed');
                nextButton.click();
            } else {
                console.log('Next button not found');
            }
        } catch (error) {
            console.error('Error occurred during video end handling:', error);
        }
    }

    function isCarousel() {
        // Check if carousel pagination dots are present
        const paginationWrapper = document.querySelector('.css-1qe8vby-DivPaginationWrapper');
        if (paginationWrapper) {
            const dots = paginationWrapper.querySelectorAll('.css-1wtwqpy-DivDot');
            console.log('Carousel detected with', dots.length, 'images');
            return dots.length > 0;
        }
        return false;
    }

    function observeNewVideos() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                setupVideoEndListener(video);
            }
            
            // Check if a carousel is detected
            if (isCarousel()) {
                console.log('Carousel detected, setting up carousel auto-advance.');
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
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial setup
    observeNewVideos();
})();
