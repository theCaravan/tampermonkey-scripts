// ==UserScript==
// @name         TikTok Auto Next on Video End with Delay
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Automatically scroll to the next video on TikTok when the current video ends, with a delay to ensure video length loads
// @author       theCaravan
// @match        *://www.tiktok.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';

    // Function to detect carousel elements on the page
    function isCarousel() {
        return document.querySelector('.css-1qe8vby-DivPaginationWrapper') !== null;
    }

    // Function to go to the next video
    function goToNextVideo() {
        const nextButton = document.querySelector('[data-e2e="arrow-right"]');
        if (nextButton) {
            console.log("Next button identified, advancing to next video.");
            nextButton.click();
        } else {
            console.log("Next button not found.");
        }
    }

    // Main function to control video/carousel navigation
    function handleContent() {
        if (isCarousel()) {
            console.log("Carousel detected. Advancing after 10 seconds.");
            setTimeout(goToNextVideo, 10000); // 10 seconds delay for carousels
        } else {
            console.log("Regular video detected. Monitoring for video end.");
            const video = document.querySelector('video');
            if (video) {
                video.addEventListener('ended', () => {
                    console.log("Video ended, advancing to next.");
                    goToNextVideo();
                }, { once: true });
            }
        }
    }

    // Detect new content when it becomes visible
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                console.log("New content detected, preparing script to run...");
                handleContent();
            }
        });
    });

    // Observe changes in the main feed container
    const feedContainer = document.querySelector('[data-e2e="feed-container"]');
    if (feedContainer) {
        observer.observe(feedContainer, { childList: true, subtree: true });
        console.log("Observation initiated on feed container.");
    } else {
        console.log("Feed container not found; observer could not be initialized.");
    }
})();
